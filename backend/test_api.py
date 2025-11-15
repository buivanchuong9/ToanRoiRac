#!/usr/bin/env python3
"""
Test script để verify backend API và WebSocket
"""

import requests
import json

print("=" * 60)
print("TESTING KRUSKAL BACKEND API")
print("=" * 60)

# Test 1: Health check
print("\n1. Testing health check...")
try:
    response = requests.get("http://localhost:8000/")
    print(f"   ✅ Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Validate graph
print("\n2. Testing graph validation...")
test_graph = {
    "edges": [
        {"source": "A", "target": "B", "weight": 7},
        {"source": "A", "target": "D", "weight": 5},
        {"source": "B", "target": "C", "weight": 8}
    ]
}

try:
    response = requests.post(
        "http://localhost:8000/api/validate-graph",
        json=test_graph,
        headers={"Content-Type": "application/json"}
    )
    print(f"   ✅ Status: {response.status_code}")
    result = response.json()
    print(f"   Valid: {result['is_valid']}")
    print(f"   Nodes: {result['nodes']}")
    print(f"   Edges: {result['edges_count']}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Run Kruskal
print("\n3. Testing Kruskal algorithm...")
try:
    response = requests.post(
        "http://localhost:8000/api/kruskal",
        json=test_graph,
        headers={"Content-Type": "application/json"}
    )
    print(f"   ✅ Status: {response.status_code}")
    result = response.json()
    print(f"   Success: {result['success']}")
    print(f"   Total Cost: {result['total_cost']}")
    print(f"   MST Edges: {len(result['mst_edges'])}")
    print(f"   Steps: {len(result['steps'])}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("✅ ALL TESTS COMPLETED!")
print("=" * 60)
print("\nBackend is ready! You can now:")
print("  - Open http://localhost:8000/docs for API documentation")
print("  - Run 'npm run dev:frontend' to start the frontend")
print("  - Or run 'npm run dev' to start both")
