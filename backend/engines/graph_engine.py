import networkx as nx

class GraphEngine:
    @staticmethod
    def get_transaction_network() -> dict:
        # Create a NetworkX directed graph
        G = nx.DiGraph()

        # Define node statuses: SAFE, WARNING, DANGER
        nodes = [
            {"id": "user", "label": "Your Profile", "status": "SAFE", "x": 160, "y": 60},
            {"id": "mule1", "label": "Intermediary A", "status": "WARNING", "x": 80, "y": 160},
            {"id": "mule2", "label": "Intermediary B", "status": "SAFE", "x": 240, "y": 160},
            {"id": "scam_hub", "label": "Scam Ring Node", "status": "DANGER", "x": 80, "y": 280},
            {"id": "vendor", "label": "Merchant Target", "status": "SAFE", "x": 240, "y": 280}
        ]

        # Add nodes to networkx
        for node in nodes:
            G.add_node(node["id"], label=node["label"], status=node["status"])

        # Add directed edges
        edges = [
            {"from": "user", "to": "mule1"},
            {"from": "user", "to": "mule2"},
            {"from": "mule1", "to": "scam_hub"},
            {"from": "mule2", "to": "vendor"}
        ]

        for edge in edges:
            G.add_edge(edge["from"], edge["to"])

        # Returns network parameters for rendering
        return {
            "nodes": nodes,
            "edges": edges,
            "metrics": {
                "degreeCentrality": dict(nx.degree_centrality(G)),
                "clusteringCoefficient": nx.clustering(G)
            }
        }
