"""
FastAPI Backend cho Kruskal Visualization
Cung cấp REST API và WebSocket để stream các bước thuật toán
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import asyncio
import json
import uvicorn

from kruskal import KruskalAlgorithm, Edge


# Pydantic models cho request/response
class EdgeInput(BaseModel):
    """Model cho cạnh đầu vào"""
    source: str = Field(..., description="Đỉnh nguồn")
    target: str = Field(..., description="Đỉnh đích")
    weight: float = Field(..., gt=0, description="Trọng số cạnh (phải > 0)")


class GraphInput(BaseModel):
    """Model cho đồ thị đầu vào"""
    edges: List[EdgeInput] = Field(..., min_items=1, description="Danh sách các cạnh")


class KruskalResponse(BaseModel):
    """Response cho API chạy thuật toán Kruskal"""
    success: bool
    mst_edges: List[Dict]
    total_cost: float
    statistics: Dict
    steps: List[Dict]


# Khởi tạo FastAPI app
app = FastAPI(
    title="Kruskal Algorithm API",
    description="Backend API cho thuật toán Kruskal - Tìm cây khung nhỏ nhất",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Kruskal Algorithm API is running",
        "version": "1.0.0"
    }


@app.post("/api/kruskal", response_model=KruskalResponse)
async def run_kruskal(graph: GraphInput):
    """
    Chạy thuật toán Kruskal và trả về kết quả đầy đủ
    
    Args:
        graph: Đồ thị đầu vào với danh sách các cạnh
        
    Returns:
        KruskalResponse với MST, chi phí, thống kê và các bước
    """
    try:
        # Chuyển đổi input
        edges_dict = [edge.dict() for edge in graph.edges]
        
        # Chạy thuật toán
        kruskal = KruskalAlgorithm(edges_dict)
        mst_edges, total_cost, steps = kruskal.run()
        
        # Lấy thống kê
        statistics = kruskal.get_statistics(mst_edges, total_cost)
        
        # Chuẩn bị response
        return KruskalResponse(
            success=True,
            mst_edges=[
                {'source': e.source, 'target': e.target, 'weight': e.weight}
                for e in mst_edges
            ],
            total_cost=total_cost,
            statistics=statistics,
            steps=[step.to_dict() for step in steps]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/kruskal")
async def websocket_kruskal(websocket: WebSocket):
    """
    WebSocket endpoint để stream các bước thuật toán Kruskal theo thời gian thực
    
    Client gửi:
        {
            "edges": [...],
            "speed": 1.0  // Tốc độ animation (1.0 = normal, 2.0 = 2x faster)
        }
    
    Server gửi từng bước:
        {
            "type": "step",
            "data": {...}
        }
    
    Server gửi khi hoàn thành:
        {
            "type": "complete",
            "data": {...}
        }
    """
    await websocket.accept()
    
    try:
        # Nhận dữ liệu từ client
        data = await websocket.receive_json()
        edges = data.get('edges', [])
        speed = data.get('speed', 1.0)
        
        if not edges:
            await websocket.send_json({
                'type': 'error',
                'message': 'No edges provided'
            })
            await websocket.close()
            return
        
        # Chạy thuật toán
        kruskal = KruskalAlgorithm(edges)
        mst_edges, total_cost, steps = kruskal.run()
        
        # Stream từng bước với delay
        base_delay = 1.0  # 1 second
        delay = base_delay / speed
        
        for step in steps:
            await websocket.send_json({
                'type': 'step',
                'data': step.to_dict()
            })
            await asyncio.sleep(delay)
        
        # Gửi thông báo hoàn thành
        statistics = kruskal.get_statistics(mst_edges, total_cost)
        await websocket.send_json({
            'type': 'complete',
            'data': {
                'mst_edges': [
                    {'source': e.source, 'target': e.target, 'weight': e.weight}
                    for e in mst_edges
                ],
                'total_cost': total_cost,
                'statistics': statistics
            }
        })
        
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        try:
            await websocket.send_json({
                'type': 'error',
                'message': str(e)
            })
        except:
            pass
    finally:
        try:
            await websocket.close()
        except:
            pass


@app.post("/api/validate-graph")
async def validate_graph(graph: GraphInput):
    """
    Kiểm tra tính hợp lệ của đồ thị
    
    Returns:
        - is_valid: True/False
        - message: Thông báo lỗi (nếu có)
        - nodes: Danh sách các đỉnh
        - edges_count: Số cạnh
    """
    try:
        edges_dict = [edge.dict() for edge in graph.edges]
        kruskal = KruskalAlgorithm(edges_dict)
        
        return {
            'is_valid': True,
            'message': 'Graph is valid',
            'nodes': kruskal.nodes,
            'edges_count': len(kruskal.edges),
            'sorted_edges': [
                {'source': e.source, 'target': e.target, 'weight': e.weight}
                for e in kruskal.sorted_edges
            ]
        }
        
    except Exception as e:
        return {
            'is_valid': False,
            'message': str(e),
            'nodes': [],
            'edges_count': 0
        }


if __name__ == "__main__":
    # Chạy server
    print("🚀 Starting Kruskal Algorithm API Server...")
    print("📍 API Documentation: http://localhost:8000/docs")
    print("📍 WebSocket: ws://localhost:8000/ws/kruskal")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload khi code thay đổi
        log_level="info"
    )
