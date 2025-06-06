// graph.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Graph, Node } from '../src/datahandler.ts'; // Adjust path if necessary

describe('Graph Class', () => {
    let graph: Graph;

    beforeEach(() => {
        graph = new Graph(); // Reset graph for each test
    });

    describe('Graph Construction (constructor)', () => {
        it('should correctly initialize the root node with id 0', () => {
            expect(graph.root).toBeInstanceOf(Node);
            expect(graph.root.id).toBe(0);
            expect(graph.root.parent).toBeUndefined();
        });

        it('should initialize nextID to 1', () => {
            expect(graph.nextID).toBe(1);
        });
    });

    describe('Graph Modification (addNode)', () => {
        it('should add a new node as a child of the specified parent node', () => {
            graph.addNode(0); // Add a child to the root (id 0)
            const childNode = graph.root.children[0];
            expect(childNode).toBeInstanceOf(Node);
            expect(childNode.parent).toBe(graph.root);
            expect(childNode.id).toBe(1);
        });

        it('should increment nextID after adding a node', () => {
            graph.addNode(0);
            expect(graph.nextID).toBe(2);
        });

        it('should assign sequential IDs to new nodes', () => {
            graph.addNode(0);
            expect(graph.root.children[0].id).toBe(1);
            graph.addNode(0);
            expect(graph.root.children[1].id).toBe(2);
        });

        it('should return null if the parent node is not found', () => {
            const result = graph.addNode(999);
            expect(result).toBeNull();
            expect(graph.root.children.length).toBe(0);
            expect(graph.nextID).toBe(1); // nextID should not change
        });

        it('should allow adding multiple children to the same parent', () => {
            graph.addNode(0); // Child 1 (id 1)
            graph.addNode(0); // Child 2 (id 2)
            expect(graph.root.children.length).toBe(2);
            expect(graph.root.children[0].id).toBe(1);
            expect(graph.root.children[1].id).toBe(2);
        });

        it('should maintain correct parent-child relationship for new nodes', () => {
            graph.addNode(0); // Node with id 1
            const child1 = graph.root.children[0];
            expect(child1.parent).toBe(graph.root);

            graph.addNode(child1.id); // Node with id 2, child of id 1
            const grandchild1 = child1.children[0];
            expect(grandchild1.parent).toBe(child1);
        });
    });

    describe('Graph Modification (removeNode)', () => {
        // IMPORTANT: These tests assume a CORRECTED `removeNode` implementation
        // in `datahandler.ts` that actually removes the node from the graph structure.

        it('should remove the specified node from its parent\'s children array', () => {
            // Arrange
            // graph.addNode(0); // Node with id 1
            // graph.addNode(0); // Node with id 2
            // const nodeToRemoveId = 1;

            // Act (assuming corrected removeNode)
            // const removedNode = graph.removeNode(nodeToRemoveId);

            // Assert (assuming corrected removeNode)
            // expect(removedNode).not.toBeNull();
            // expect(graph.root.children.length).toBe(1);
            // expect(graph.root.children.some(child => child.id === nodeToRemoveId)).toBeFalsy();
        });

        it('should return null if the node to be removed is not found', () => {
            // Act (assuming corrected removeNode)
            // const result = graph.removeNode(999);
            // Assert
            // expect(result).toBeNull();
        });

        // Add more `removeNode` tests here once implemented correctly:
        // - `should correctly handle removing a leaf node.`
        // - `should correctly handle removing a node with children (e.g., re-parenting, or removing subtree).`
        // - `should not affect other nodes in the graph.`
        // - `should handle attempts to remove the root node.`
    });
});