// these classes are for actually storing the data
// -----------------------------------------------
export class Graph {
    root: Node
    nextID: number = 1

    constructor() {
        this.root = new Node(undefined,0)
    }

    addNode(identifier: number) {
        const element = this.root.findNode(identifier)
        if(!element) return null
        const next = new Node(element,this.nextID)
        this.nextID = this.nextID + 1
        element.children.push(next)
    }

    // deleting from array shifts all the identifiers over
    removeNode(identifier: number) {
        var element = this.root.findNode(identifier)
        if(!element) return null
        element = null
    }
}

export class Node {
    parent: Node | undefined
    children: Array<Node>
    id: number

    constructor(par : Node | undefined, identifier: number) {
        this.parent = par
        this.children = []
        this.id = identifier
    }

    findNode(identifier: number) : Node | null {
        if(this.id == identifier) {
            return this
        }

        for(const child of this.children) {
            const outcome = child.findNode(identifier)
            if(outcome) return outcome
        }

        return null;
    }
}

// this section is for when it actually becomes a picture
// ------------------------------------------------------
export interface NodeLayoutData {
    id: number
    x: number
    y: number
    depth: number
    angle: number
    radius: number
}

export interface EdgeLayoutData {
    sourceID: number
    targetID: number
}

export class RadialLayoutCalculator {
    calculateLayout(graph: Graph): Map<number, NodeLayoutData> {
        // Implementation for calculating node positions, depths, angles, etc.
        const layoutMap = new Map<number, NodeLayoutData>();

        // Start with the root
        const rootNode = graph.root;
        layoutMap.set(rootNode.id, { id: rootNode.id, x: 0, y: 0, depth: 0, angle: 0, radius: 0 });

        // A simple BFS-like traversal to calculate depths and initial angles/radii
        const queue: { node: Node; depth: number; parentAngle: number }[] = [{ node: rootNode, depth: 0, parentAngle: 0 }];
        const radiusIncrement = 50; // How much radius increases per depth level

        while (queue.length > 0) {
            const { node, depth, parentAngle } = queue.shift()!;

            // Children layout logic (very simplified for now)
            const numChildren = node.children.length;
            if (numChildren > 0) {
                const angleIncrement = (2 * Math.PI) / numChildren; // Distribute evenly
                const currentRadius = (depth + 1) * radiusIncrement;

                node.children.forEach((child, index) => {
                    // Simple angle calculation - you'll want to refine this
                    // to consider subtree span and prevent overlaps.
                    const childAngle = (parentAngle + index * angleIncrement) % (2 * Math.PI); // Keep angle within [0, 2PI]

                    // Convert polar to Cartesian coordinates
                    const x = currentRadius * Math.cos(childAngle);
                    const y = currentRadius * Math.sin(childAngle);

                    layoutMap.set(child.id, {
                        id: child.id,
                        x: x,
                        y: y,
                        depth: depth + 1,
                        angle: childAngle,
                        radius: currentRadius
                    });
                    queue.push({ node: child, depth: depth + 1, parentAngle: childAngle });
                });
            }
        }

        return layoutMap;
    }

    generateEdges(graph: Graph, nodeLayouts: Map<number, NodeLayoutData>): EdgeLayoutData[] {
        const edges: EdgeLayoutData[] = [];
        const queue: Node[] = [graph.root];
        const visited = new Set<number>();

        while (queue.length > 0) {
            const currentNode = queue.shift()!;
            if (visited.has(currentNode.id)) continue;
            visited.add(currentNode.id);

            for (const child of currentNode.children) {
                edges.push({ sourceID: currentNode.id, targetID: child.id });
                queue.push(child); // Add children to queue for their edges
            }
        }
        return edges;
    }
}

export class GraphTraversalUtils {
    static bfs(graph: Graph, startNodeId: number): number[] {
        // BFS implementation
        return [];
    }

    static dfs(graph: Graph, startNodeId: number): number[] {
        // DFS implementation
        return [];
    }

    static calculateDepths(graph: Graph): Map<number, number> {
        // Depth calculation implementation
        return new Map();
    }
}