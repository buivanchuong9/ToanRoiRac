/**
 * API Client để kết nối với Python backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export interface Edge {
  source: string
  target: string
  weight: number
}

export interface KruskalStep {
  step_number: number
  edge: Edge
  status: 'selected' | 'rejected'
  message: string
  total_cost: number
  edges_selected: number
  connected_components: number
  component_map: { [key: string]: number }
}

export interface KruskalResult {
  success: boolean
  mst_edges: Edge[]
  total_cost: number
  statistics: {
    total_nodes: number
    total_edges: number
    mst_edges_count: number
    mst_total_cost: number
    edges_examined: number
    edges_rejected: number
    is_complete: boolean
  }
  steps: KruskalStep[]
}

/**
 * Chạy thuật toán Kruskal qua REST API
 */
export async function runKruskal(edges: Edge[]): Promise<KruskalResult> {
  const response = await fetch(`${API_BASE_URL}/api/kruskal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ edges }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to run Kruskal algorithm')
  }

  return response.json()
}

/**
 * Validate đồ thị trước khi chạy
 */
export async function validateGraph(edges: Edge[]): Promise<{
  is_valid: boolean
  message: string
  nodes: string[]
  edges_count: number
  sorted_edges?: Edge[]
}> {
  const response = await fetch(`${API_BASE_URL}/api/validate-graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ edges }),
  })

  return response.json()
}

/**
 * WebSocket client để stream các bước thuật toán
 */
export class KruskalWebSocket {
  private ws: WebSocket | null = null
  private onStepCallback?: (step: KruskalStep) => void
  private onCompleteCallback?: (result: any) => void
  private onErrorCallback?: (error: string) => void

  connect(
    edges: Edge[],
    speed: number = 1.0,
    callbacks: {
      onStep?: (step: KruskalStep) => void
      onComplete?: (result: any) => void
      onError?: (error: string) => void
    }
  ) {
    this.onStepCallback = callbacks.onStep
    this.onCompleteCallback = callbacks.onComplete
    this.onErrorCallback = callbacks.onError

    this.ws = new WebSocket(`${WS_BASE_URL}/ws/kruskal`)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.ws?.send(JSON.stringify({ edges, speed }))
    }

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        switch (message.type) {
          case 'step':
            this.onStepCallback?.(message.data)
            break
          case 'complete':
            this.onCompleteCallback?.(message.data)
            this.close()
            break
          case 'error':
            this.onErrorCallback?.(message.message)
            this.close()
            break
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        this.onErrorCallback?.('Failed to parse message')
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.onErrorCallback?.('WebSocket connection error')
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
    }
  }

  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
