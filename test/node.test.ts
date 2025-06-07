// node.test.ts
import { describe, it, expect } from 'vitest';
import { Node } from '../src/datahandler.ts'; 

describe('Node Class', () => {

    describe('Node Construction (constructor)', () => {
        it('should correctly initialize a node with a parent and id', () => {
            const parentNode = new Node(0);
            const childNode = new Node(1);
            expect(childNode.id).toBe(1);
        });

        it('should correctly initialize a root node (parent undefined) with an id', () => {
            const rootNode = new Node(0);
            expect(rootNode.id).toBe(0);
        });

        it('should initialize children as an empty array', () => {
            const node = new Node(0);
            expect(node.children).toEqual([]);
            expect(node.children.length).toBe(0);
        });
    });

    describe('Node Finding (findNode)', () => {
        it('should return the node itself if its ID matches the identifier', () => {
            const node = new Node(5);
            expect(node.findNode(5)).toBe(node);
        });

        it('should return a direct child node if its ID matches the identifier', () => {
            const root = new Node(0);
            const child1 = new Node(1);
            const child2 = new Node(2);
            root.children.push(child1, child2);
            expect(root.findNode(1)).toBe(child1);
            expect(root.findNode(2)).toBe(child2);
        });

        it('should return a descendant node if its ID matches the identifier (deeper search)', () => {
            const root = new Node(0);
            const child1 = new Node(1);
            const grandchild1 = new Node(10);
            child1.children.push(grandchild1);
            root.children.push(child1);
            expect(root.findNode(10)).toBe(grandchild1);
        });

        it('should return null if no node with the identifier is found in the subtree', () => {
            const root = new Node(0);
            const child1 = new Node(1);
            root.children.push(child1);
            expect(root.findNode(999)).toBeNull();
            expect(child1.findNode(0)).toBeNull(); // Searching parent from child's subtree
        });

        it('should handle an empty children array gracefully when finding nodes', () => {
            const node = new Node(0);
            expect(node.findNode(0)).toBe(node);
            expect(node.findNode(1)).toBeNull();
        });
    });
});