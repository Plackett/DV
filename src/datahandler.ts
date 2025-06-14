// these classes are for actually storing the data
// -----------------------------------------------
export class Graph {
    root: Node
    nextID: number = 1

    constructor() {
        this.root = new Node(0)
    }

    addNode(identifier: number) {
        const element = this.root.findNode(identifier)
        if(!element) return null
        const next = new Node(this.nextID)
        this.nextID = this.nextID + 1
        element.children.push(next)
    }

    // deleting from array shifts all the identifiers over
    removeNode(identifier: number) {
        // Can't remove the root node
        if (identifier === 0) return null;
        
        // Find the parent of the node to remove
        const findParent = (node: Node, targetId: number): Node | null => {
            // IDEAL FIX: Because we know the parent must have an ID less than the target we can start there
            // also returning null for root node is great good job sonnet!
            for (let i = 0; i < node.children.length; i++) {
                if (node.children[i].id === targetId) {
                    return node;
                }
                
                const parent = findParent(node.children[i], targetId);
                if (parent) return parent;
            }
            return null;
        };
        
        const parent = findParent(this.root, identifier);
        if (!parent) return null;
        
        // Remove the node from its parent's children array
        const index = parent.children.findIndex(child => child.id === identifier);
        if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
        }
        
        return null;
    }
}

export class Node {
    children: Array<Node>
    id: number

    constructor(identifier: number) {
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
export class NodeLayoutData {
    id: number = 0
    x: number = 0
    y: number = 0
    depth: number = 0
    angle: number = 0
    radius: number = 0
}

export class EdgeLayoutData {
    sourceID: number = 0
    targetID: number = 0
}

interface LayoutCalculator {
    calculateLayout(graph: Graph): Map<number, NodeLayoutData>;
    generateEdges(graph: Graph, nodeLayouts: Map<number, NodeLayoutData>): EdgeLayoutData[];
}

export class RadialLayoutCalculator implements LayoutCalculator {
    private radiusIncrement = 80; // How much radius increases per depth level
    private minAnglePerLeafNode = Math.PI / 12; // minimum angle between leaves

    calculateLayout(graph: Graph): Map<number, NodeLayoutData> {
        const layoutMap = new Map<number, NodeLayoutData>();
        const subtreeAngularWidths = new Map<number, number>();
        const calculateSubtreeWidth = (node: Node): number => {
            if (node.children.length === 0) {
                subtreeAngularWidths.set(node.id, this.minAnglePerLeafNode);
                return this.minAnglePerLeafNode;
            }

            let totalChildrenWidth = 0;
            for (const child of node.children) {
                totalChildrenWidth += calculateSubtreeWidth(child);
            }

            subtreeAngularWidths.set(node.id, totalChildrenWidth);
            return totalChildrenWidth;
        };

        calculateSubtreeWidth(graph.root);


        // Step 2: Traverse (BFS) to assign REAL POLAR positions
        // Queue stores { node, depth, startAngle for this node's allocated wedge, endAngle for this node's allocated wedge }
        const queue: { node: Node; depth: number; startAngle: number; endAngle: number }[] = [
            // The root node itself occupies the full circle for its children's distribution
            // But its own 'position' is at (0,0) and angle doesn't apply
            { node: graph.root, depth: 0, startAngle: 0, endAngle: 2 * Math.PI }
        ];

        layoutMap.set(graph.root.id, { id: graph.root.id, x: 0, y: 0, depth: 0, angle: 0, radius: 0 });

        while (queue.length > 0) {
            const { node, depth, startAngle, endAngle } = queue.shift()!;

            const parentAngularSpan = endAngle - startAngle;

            const currentRadius = (depth + 1) * this.radiusIncrement;

            let currentAngularOffset = startAngle; // Tracks where the next child's segment begins

            // Get the total width of all children for proportionality
            const totalChildrenSubtreeWidth = subtreeAngularWidths.get(node.id) || this.minAnglePerLeafNode;

            const sortedChildren = [...node.children].sort((a, b) => {
                const widthA = subtreeAngularWidths.get(a.id) || this.minAnglePerLeafNode;
                const widthB = subtreeAngularWidths.get(b.id) || this.minAnglePerLeafNode;
                return widthA - widthB; // Sort by width to potentially make a more balanced layout
            });

            for (const child of sortedChildren) {
                const childSubtreeWidth = subtreeAngularWidths.get(child.id) || this.minAnglePerLeafNode;

                // Calculate the proportion of the parent's total angular span this child's subtree takes
                const proportionFactor = (totalChildrenSubtreeWidth > 0) ? (childSubtreeWidth / totalChildrenSubtreeWidth) : 0;
                const childAllocatedAngleSpan = parentAngularSpan * proportionFactor;

                const childEndAngle = currentAngularOffset + childAllocatedAngleSpan;

                // The angle for the child's *position* is the midpoint of its allocated span
                const childNodeAngle = (currentAngularOffset + childEndAngle) / 2;

                // Convert polar to Cartesian
                const x = currentRadius * Math.cos(childNodeAngle);
                const y = currentRadius * Math.sin(childNodeAngle);

                layoutMap.set(child.id, {
                    id: child.id,
                    x: x,
                    y: y,
                    depth: depth + 1,
                    angle: childNodeAngle,
                    radius: currentRadius
                });

                // Add child to queue, passing its *own allocated angular range* for its children
                queue.push({
                    node: child,
                    depth: depth + 1,
                    startAngle: currentAngularOffset,
                    endAngle: childEndAngle
                });

                // Move the offset for the next sibling
                currentAngularOffset = childEndAngle;
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

export class VerticalLayoutCalculator implements LayoutCalculator {
    private horizontalSpacing = 100; // Spacing between nodes horizontally
    private verticalSpacing = 80;    // Spacing between levels vertically

    calculateLayout(graph: Graph): Map<number, NodeLayoutData> {
        const layoutMap = new Map<number, NodeLayoutData>();
        const depthMap = this.calculateNodeDepths(graph.root);
        const widthsByLevel = new Map<number, number>();
        const positionsByLevel = new Map<number, number[]>();

        // First pass: count nodes at each level to determine width
        for (const [nodeId, depth] of depthMap.entries()) {
            if (!widthsByLevel.has(depth)) {
                widthsByLevel.set(depth, 0);
                positionsByLevel.set(depth, []);
            }
            widthsByLevel.set(depth, widthsByLevel.get(depth)! + 1);
        }

        // Second pass: BFS to assign positions
        const queue: Node[] = [graph.root];
        const visited = new Set<number>();

        // Position root at center
        layoutMap.set(graph.root.id, {
            id: graph.root.id,
            x: 0,
            y: 0,
            depth: 0,
            angle: 0,
            radius: 0
        });

        while (queue.length > 0) {
            const node = queue.shift()!;
            if (visited.has(node.id)) continue;
            visited.add(node.id);

            const nodeDepth = depthMap.get(node.id)!;
            const childDepth = nodeDepth + 1;

            // Sort children to ensure consistent layout
            const sortedChildren = [...node.children].sort((a, b) => a.id - b.id);
            
            if (sortedChildren.length > 0) {
                // Calculate total width needed for children
                const totalWidth = (sortedChildren.length - 1) * this.horizontalSpacing;
                // Start position (left-most child)
                let startX = -totalWidth / 2;
                
                // Position each child
                for (const child of sortedChildren) {
                    const positions = positionsByLevel.get(childDepth)!;
                    
                    // Check if this position is already taken
                    while (positions.includes(startX)) {
                        startX += 10; // Shift slightly if position is taken
                    }
                    
                    positions.push(startX);
                    
                    layoutMap.set(child.id, {
                        id: child.id,
                        x: startX,
                        y: childDepth * this.verticalSpacing,
                        depth: childDepth,
                        angle: 0, // Not used in vertical layout
                        radius: 0  // Not used in vertical layout
                    });
                    
                    queue.push(child);
                    startX += this.horizontalSpacing;
                }
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
                queue.push(child);
            }
        }
        return edges;
    }

    private calculateNodeDepths(root: Node): Map<number, number> {
        const depthMap = new Map<number, number>();
        const queue: { node: Node, depth: number }[] = [{ node: root, depth: 0 }];
        
        while (queue.length > 0) {
            const { node, depth } = queue.shift()!;
            if (depthMap.has(node.id)) continue;
            
            depthMap.set(node.id, depth);
            
            for (const child of node.children) {
                queue.push({ node: child, depth: depth + 1 });
            }
        }
        
        return depthMap;
    }
}

// utilizes gravity algorithm to position nodes
export class ClusterLayoutCalculator implements LayoutCalculator {
    calculateLayout(graph: Graph): Map<number, NodeLayoutData> {
        throw new Error("Method not implemented.")
    }
    generateEdges(graph: Graph, nodeLayouts: Map<number, NodeLayoutData>): EdgeLayoutData[] {
        throw new Error("Method not implemented.")
    }
}

export class GraphTraversalUtils {
    static bfs(graph: Graph, startNodeId: number): number[] {
        // TODO: BFS implementation
        return [];
    }

    static dfs(graph: Graph, startNodeId: number): number[] {
        // TODO: DFS implementation
        return [];
    }

    static calculateDepths(graph: Graph): Map<number, number> {
        // TODO: Depth calculation implementation
        return new Map();
    }
}