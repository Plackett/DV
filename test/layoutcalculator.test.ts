import { describe, it, expect, beforeEach } from 'vitest';
import { Graph, RadialLayoutCalculator, VerticalLayoutCalculator, ClusterLayoutCalculator, NodeLayoutData, EdgeLayoutData } from '../src/datahandler.ts'; // Adjust path if necessary

// Helper for comparing floating-point numbers due to precision issues
const expectFloatCloseTo = (received: number, expected: number, tolerance: number = 0.001) => {
    expect(received).toBeCloseTo(expected, tolerance);
};

describe('RadialLayoutCalculator', () => {
    let calculator: RadialLayoutCalculator;

    beforeEach(() => {
        calculator = new RadialLayoutCalculator();
    });

    describe('Layout Calculation (calculateLayout)', () => {
        it('should place the root node at (0,0) with depth 0 and radius 0', () => {
            const graph = new Graph(); // A graph with only a root
            const layout = calculator.calculateLayout(graph);
            const rootLayout = layout.get(0);
            expect(rootLayout).toBeDefined();
            expectFloatCloseTo(rootLayout!.x, 0);
            expectFloatCloseTo(rootLayout!.y, 0);
            expect(rootLayout!.depth).toBe(0);
            expect(rootLayout!.radius).toBe(0);
        });

        it('should calculate correct depths for nodes in a simple linear graph', () => {
            // Setup a graph: 0 -> 1 -> 2 -> 3
            const graph = new Graph();
            graph.addNode(0); // 1
            graph.addNode(1); // 2
            graph.addNode(2); // 3

            const layout = calculator.calculateLayout(graph);
            expect(layout.get(0)?.depth).toBe(0);
            expect(layout.get(1)?.depth).toBe(1);
            expect(layout.get(2)?.depth).toBe(2);
            expect(layout.get(3)?.depth).toBe(3);
        });

        it('should calculate correct depths for nodes in a balanced tree', () => {
            // Setup a graph: 0 -> (1,2), 1 -> (3,4), 2 -> (5,6)
            const graph = new Graph();
            graph.addNode(0); graph.addNode(0); // 1, 2
            graph.addNode(1); graph.addNode(1); // 3, 4
            graph.addNode(2); graph.addNode(2); // 5, 6

            const layout = calculator.calculateLayout(graph);
            expect(layout.get(0)?.depth).toBe(0);
            expect(layout.get(1)?.depth).toBe(1);
            expect(layout.get(2)?.depth).toBe(1);
            expect(layout.get(3)?.depth).toBe(2);
            expect(layout.get(4)?.depth).toBe(2);
            expect(layout.get(5)?.depth).toBe(2);
            expect(layout.get(6)?.depth).toBe(2);
        });

        it('should distribute two children evenly around the circle at the first depth level', () => {
            // Setup a graph: 0 -> 1, 0 -> 2
            const graph = new Graph();
            graph.addNode(0); // 1
            graph.addNode(0); // 2

            const layout = calculator.calculateLayout(graph);
            const node1Layout = layout.get(1);
            const node2Layout = layout.get(2);

            expect(node1Layout).toBeDefined();
            expect(node2Layout).toBeDefined();
            expect(node1Layout!.depth).toBe(1);
            expect(node2Layout!.depth).toBe(1);
            expect(node1Layout!.radius).toBeGreaterThan(0);
            expect(node2Layout!.radius).toBeGreaterThan(0);
            expectFloatCloseTo(Math.abs(node1Layout!.angle - node2Layout!.angle), Math.PI);
        });

        it('should handle an empty graph gracefully', () => {
            const graph = new Graph();
            const layout = calculator.calculateLayout(graph);
            expect(layout.size).toBe(1); // Only root node should be present
            expect(layout.get(0)).toBeDefined();
        });
    });

    describe('Edge Data Generation (generateEdges)', () => {
        it('should generate the correct number of edge data objects for a simple linear graph', () => {
            // 0 -> 1 -> 2
            const graph = new Graph();
            graph.addNode(0); // 1
            graph.addNode(1); // 2

            const layout = calculator.calculateLayout(graph); // Need layout for generateEdges
            const edges = calculator.generateEdges(graph, layout);
            expect(edges.length).toBe(2); // Edges: (0,1), (1,2)
        });

        it('should correctly identify source and target for each edge', () => {
            // 0 -> 1, 0 -> 2
            const graph = new Graph();
            graph.addNode(0); // 1
            graph.addNode(0); // 2

            const layout = calculator.calculateLayout(graph);
            const edges = calculator.generateEdges(graph, layout);

            const edge1 = edges.find(e => e.sourceID === 0 && e.targetID === 1);
            const edge2 = edges.find(e => e.sourceID === 0 && e.targetID === 2);

            expect(edge1).toBeDefined();
            expect(edge2).toBeDefined();
        });
    });
});

describe('VerticalLayoutCalculator', () => {
    let calculator: VerticalLayoutCalculator;

    beforeEach(() => {
        calculator = new VerticalLayoutCalculator();
    });

    describe('Layout Calculation (calculateLayout)', () => {
        it('should place root node at 0,0 with depth 0', () => {
            const graph = new Graph()
            const layout = calculator.calculateLayout(graph)
            const rootLayout = layout.get(0)
            expect(rootLayout).toBeDefined()
            expectFloatCloseTo(rootLayout!.x, 0)
            expectFloatCloseTo(rootLayout!.y, 0)
            expect(rootLayout!.depth).toBe(0)
        })

        it('should place child node below root with depth 1', () => {
            const graph = new Graph()
            graph.addNode(0)
            const layout = calculator.calculateLayout(graph)
            const childLayout = layout.get(1)
            if(childLayout === undefined) throw console.error("Couldn't get child layout");
            expect(childLayout.y > 0).toBe(true)
            expect(childLayout.depth).toBe(1)
        })

        it('should calculate correct depths for nodes in a simple linear graph', () => {
            // Setup a graph: 0 -> 1 -> 2 -> 3
            const graph = new Graph();
            graph.addNode(0); // 1
            graph.addNode(1); // 2
            graph.addNode(2); // 3

            const layout = calculator.calculateLayout(graph);
            expect(layout.get(0)?.depth).toBe(0);
            expect(layout.get(1)?.depth).toBe(1);
            expect(layout.get(2)?.depth).toBe(2);
            expect(layout.get(3)?.depth).toBe(3);
        });

        it('should calculate correct depths for nodes in a balanced tree', () => {
            // Setup a graph: 0 -> (1,2), 1 -> (3,4), 2 -> (5,6)
            const graph = new Graph();
            graph.addNode(0); graph.addNode(0); // 1, 2
            graph.addNode(1); graph.addNode(1); // 3, 4
            graph.addNode(2); graph.addNode(2); // 5, 6

            const layout = calculator.calculateLayout(graph);
            expect(layout.get(0)?.depth).toBe(0);
            expect(layout.get(1)?.depth).toBe(1);
            expect(layout.get(2)?.depth).toBe(1);
            expect(layout.get(3)?.depth).toBe(2);
            expect(layout.get(4)?.depth).toBe(2);
            expect(layout.get(5)?.depth).toBe(2);
            expect(layout.get(6)?.depth).toBe(2);
        });

        it('should handle an empty graph gracefully', () => {
            const graph = new Graph();
            const layout = calculator.calculateLayout(graph);
            expect(layout.size).toBe(1); // Only root node should be present
            expect(layout.get(0)).toBeDefined();
        });

    })
});

// New test suite for the ClusterLayoutCalculator
describe('ClusterLayoutCalculator', () => {
    let calculator: ClusterLayoutCalculator;
    let graph: Graph;

    beforeEach(() => {
        calculator = new ClusterLayoutCalculator();
        graph = new Graph();
        graph.addNode(0); // id: 1
        graph.addNode(0); // id: 2
        graph.addNode(1); // id: 3
    });

    it('should generate a layout for every node in the graph', () => {
        const layout = calculator.calculateLayout(graph);
        expect(layout.size).toBe(4); // Root + 3 nodes
        expect(layout.has(0)).toBe(true);
        expect(layout.has(1)).toBe(true);
        expect(layout.has(2)).toBe(true);
        expect(layout.has(3)).toBe(true);
    });

    it('should produce a layout where no two nodes have the exact same coordinates', () => {
        const layout = calculator.calculateLayout(graph);
        const positions = Array.from(layout.values()).map(n => `${n.x},${n.y}`);
        const uniquePositions = new Set(positions);
        expect(positions.length).toBe(uniquePositions.size);
    });

    it('should generate the correct edge data', () => {
        const layout = calculator.calculateLayout(graph);
        const edges = calculator.generateEdges(graph, layout);
        expect(edges.length).toBe(3);
        expect(edges).toEqual(
            expect.arrayContaining([
                { sourceID: 0, targetID: 1 },
                { sourceID: 0, targetID: 2 },
                { sourceID: 1, targetID: 3 }
            ])
        );
    });
});