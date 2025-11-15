"""
Thuật toán Kruskal tối ưu với Union-Find (Disjoint Set Union)
Độ phức tạp: O(E log E) cho sắp xếp + O(E α(V)) cho Union-Find
"""

from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
import time


@dataclass
class Edge:
    """Cạnh của đồ thị"""
    source: str
    target: str
    weight: float
    
    def __repr__(self):
        return f"Edge({self.source} → {self.target}, w={self.weight})"


@dataclass
class KruskalStep:
    """Một bước trong quá trình thực hiện thuật toán Kruskal"""
    step_number: int
    edge: Edge
    status: str  # 'selected', 'rejected'
    message: str
    total_cost: float
    edges_selected: int
    connected_components: int
    component_map: Dict[str, int]  # Node -> Component ID
    
    def to_dict(self):
        """Chuyển đổi sang dictionary để gửi qua API"""
        return {
            'step_number': self.step_number,
            'edge': {
                'source': self.edge.source,
                'target': self.edge.target,
                'weight': self.edge.weight
            },
            'status': self.status,
            'message': self.message,
            'total_cost': self.total_cost,
            'edges_selected': self.edges_selected,
            'connected_components': self.connected_components,
            'component_map': self.component_map
        }


class UnionFind:
    """
    Cấu trúc Union-Find (Disjoint Set Union) với Path Compression và Union by Rank
    Tối ưu cho thuật toán Kruskal
    """
    
    def __init__(self, nodes: List[str]):
        """Khởi tạo Union-Find với danh sách các đỉnh"""
        self.parent = {node: node for node in nodes}
        self.rank = {node: 0 for node in nodes}
        self.component_count = len(nodes)
    
    def find(self, x: str) -> str:
        """
        Tìm đại diện (root) của tập chứa x
        Sử dụng Path Compression để tối ưu
        """
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x: str, y: str) -> bool:
        """
        Hợp nhất hai tập chứa x và y
        Sử dụng Union by Rank để tối ưu
        Returns: True nếu hợp nhất thành công, False nếu x và y đã cùng tập
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False  # Đã cùng component, tạo chu trình
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.component_count -= 1
        return True
    
    def get_component_map(self) -> Dict[str, int]:
        """Lấy mapping từ node -> component ID"""
        roots = {}
        component_id = 0
        result = {}
        
        for node in self.parent.keys():
            root = self.find(node)
            if root not in roots:
                roots[root] = component_id
                component_id += 1
            result[node] = roots[root]
        
        return result


class KruskalAlgorithm:
    """Thuật toán Kruskal để tìm Minimum Spanning Tree (MST)"""
    
    def __init__(self, edges: List[Dict]):
        """
        Khởi tạo thuật toán Kruskal
        Args:
            edges: Danh sách các cạnh dạng [{'source': 'A', 'target': 'B', 'weight': 5}]
        """
        self.edges = [Edge(e['source'], e['target'], e['weight']) for e in edges]
        self.nodes = self._extract_nodes()
        self.sorted_edges = sorted(self.edges, key=lambda e: e.weight)
        
    def _extract_nodes(self) -> List[str]:
        """Trích xuất danh sách các đỉnh từ danh sách cạnh"""
        nodes = set()
        for edge in self.edges:
            nodes.add(edge.source)
            nodes.add(edge.target)
        return list(nodes)
    
    def run(self) -> Tuple[List[Edge], float, List[KruskalStep]]:
        """
        Chạy thuật toán Kruskal
        Returns:
            - mst_edges: Danh sách các cạnh trong MST
            - total_cost: Tổng trọng số của MST
            - steps: Danh sách các bước thực hiện
        """
        if not self.nodes:
            return [], 0.0, []
        
        uf = UnionFind(self.nodes)
        mst_edges = []
        total_cost = 0.0
        steps = []
        step_number = 0
        
        for edge in self.sorted_edges:
            # Kiểm tra xem có thể thêm cạnh không (trước khi union)
            can_add = uf.find(edge.source) != uf.find(edge.target)
            
            if can_add:
                # Chấp nhận cạnh
                uf.union(edge.source, edge.target)
                mst_edges.append(edge)
                total_cost += edge.weight
                step_number += 1
                steps.append(KruskalStep(
                    step_number=step_number,
                    edge=edge,
                    status='selected',
                    message=f'✅ Chấp nhận cạnh {edge.source} → {edge.target} (trọng số: {edge.weight}) | Lý do: Hai đỉnh {edge.source} và {edge.target} thuộc 2 thành phần khác nhau, không tạo chu trình | Tổng chi phí: {total_cost}',
                    total_cost=total_cost,
                    edges_selected=len(mst_edges),
                    connected_components=uf.component_count,
                    component_map=uf.get_component_map()
                ))
                
            else:
                # Từ chối cạnh (tạo chu trình)
                step_number += 1
                steps.append(KruskalStep(
                    step_number=step_number,
                    edge=edge,
                    status='rejected',
                    message=f'❌ Từ chối cạnh {edge.source} → {edge.target} (trọng số: {edge.weight}) | Lý do: TẠO CHU TRÌNH - Hai đỉnh {edge.source} và {edge.target} đã cùng 1 thành phần (đã được kết nối), nếu thêm cạnh này sẽ tạo vòng lặp trong MST | Tổng chi phí: {total_cost}',
                    total_cost=total_cost,
                    edges_selected=len(mst_edges),
                    connected_components=uf.component_count,
                    component_map=uf.get_component_map()
                ))
        
        return mst_edges, total_cost, steps
    
    def get_statistics(self, mst_edges: List[Edge], total_cost: float) -> Dict:
        """Lấy thống kê về kết quả thuật toán"""
        return {
            'total_nodes': len(self.nodes),
            'total_edges': len(self.edges),
            'mst_edges_count': len(mst_edges),
            'mst_total_cost': total_cost,
            'edges_examined': len(self.sorted_edges),
            'edges_rejected': len(self.sorted_edges) - len(mst_edges),
            'is_complete': len(mst_edges) == len(self.nodes) - 1,
            'mst_edges': [
                {'source': e.source, 'target': e.target, 'weight': e.weight}
                for e in mst_edges
            ]
        }


# Example usage
if __name__ == '__main__':
    # Test case: Đồ thị mẫu
    test_edges = [
        {'source': 'A', 'target': 'B', 'weight': 7},
        {'source': 'A', 'target': 'D', 'weight': 5},
        {'source': 'B', 'target': 'C', 'weight': 8},
        {'source': 'B', 'target': 'D', 'weight': 9},
        {'source': 'B', 'target': 'E', 'weight': 7},
        {'source': 'C', 'target': 'E', 'weight': 5},
        {'source': 'D', 'target': 'E', 'weight': 15},
        {'source': 'D', 'target': 'F', 'weight': 6},
        {'source': 'E', 'target': 'F', 'weight': 8},
        {'source': 'E', 'target': 'G', 'weight': 9},
        {'source': 'F', 'target': 'G', 'weight': 11},
    ]
    
    print("=" * 60)
    print("THUẬT TOÁN KRUSKAL - MINIMUM SPANNING TREE")
    print("=" * 60)
    
    kruskal = KruskalAlgorithm(test_edges)
    mst_edges, total_cost, steps = kruskal.run()
    
    print(f"\n📊 Số đỉnh: {len(kruskal.nodes)}")
    print(f"📊 Số cạnh: {len(kruskal.edges)}")
    print(f"📊 Cạnh đã sắp xếp: {[f'{e.source}-{e.target}({e.weight})' for e in kruskal.sorted_edges]}")
    
    print("\n" + "=" * 60)
    print("CÁC BƯỚC THỰC HIỆN")
    print("=" * 60)
    
    for step in steps:
        print(f"\nBước {step.step_number}: {step.message}")
        print(f"  - Trạng thái: {step.status}")
        print(f"  - Tổng chi phí: {step.total_cost}")
        print(f"  - Cạnh đã chọn: {step.edges_selected}")
        print(f"  - Thành phần liên thông: {step.connected_components}")
    
    print("\n" + "=" * 60)
    print("KẾT QUẢ")
    print("=" * 60)
    
    stats = kruskal.get_statistics(mst_edges, total_cost)
    print(f"\n✨ MST tìm được:")
    for edge in mst_edges:
        print(f"   {edge}")
    print(f"\n💰 Tổng chi phí MST: {total_cost}")
    print(f"📈 Thống kê: {stats}")
