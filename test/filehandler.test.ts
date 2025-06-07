import { describe, it, expect, beforeEach } from 'vitest';
import { openFile, saveGraph, saveGraphToFile } from '../src/filehandler.ts'; // Adjust path if necessary
import { Graph } from '../src/datahandler.ts';

describe('File Manipulation Capabilities', () => {
    let graph: Graph;

    // This runs before each test, creating a fresh graph instance.
    beforeEach(() => {
        graph = new Graph();
        // Populate the graph with some data for the save tests
        graph.addNode(0); // Adds node with id 1 to root
        graph.addNode(1); // Adds node with id 2 to node 1
    });

    // --- Tests for Opening Files ---
    describe('Opening Functionality', () => {
        it('should be able to load a valid json file and return a Graph object', () => {
            // This test assumes `openFile` is implemented to read and parse the file.
            // You will need a `test-tree.json` file for this to work.
            const result = openFile("./test-tree.json");
            expect(result).not.toBeNull();
            expect(result).toBeInstanceOf(Graph);
        });

        it('should import nodes and reconstruct the graph state correctly', () => {
            const temp = openFile("./test-tree.json");
            expect(temp).not.toBeNull();
            // Assuming test-tree.json has a root, a child, and a grandchild.
            expect(temp?.root.children.length).toBeGreaterThan(0);
            expect(temp?.nextID).toBe(3); // Based on the example from the previous test
        });

        it('should return null when trying to open a non-existent file', () => {
            const result = openFile("./non-existent-file.json");
            expect(result).toBeNull();
        });

        it('should return null for a file containing malformed JSON', () => {
            const result = openFile("./malformed.json");
            expect(result).toBeNull();
        });

        it('should return null for a JSON file that does not match the graph structure', () => {
            const result = openFile("./not-a-graph.json");
            expect(result).toBeNull();
        });

        it('should return null when attempting to open an unsupported file type like CSV (for now)', () => {
            // This test is forward-looking for when you add CSV support.
            const result = openFile("./test-data.csv");
            expect(result).toBeNull();
        });
    });

    // --- Tests for Saving Graph to a File ---
    describe('Saving to File Functionality', () => {
        it('should return true when saving successfully with a valid format and layout', () => {
            // This test will require mocking the 'fs' module to avoid actual file I/O.
            // For now, it checks the expected boolean return value.
            const result = saveGraphToFile('./output/test.svg', 'svg', 'radial');
            expect(result).toBe(true);
        });

        it('should return false for an unsupported file format', () => {
            const result = saveGraphToFile('./output/test.txt', 'txt', 'radial');
            expect(result).toBe(false);
        });

        it('should return false for an unsupported layout type', () => {
            const result = saveGraphToFile('./output/test.svg', 'svg', 'nonexistent-layout');
            expect(result).toBe(false);
        });

        it('should return false if the file path is invalid or unwritable', () => {
            // An invalid path might be one in a non-existent directory.
            const result = saveGraphToFile('nonexistent-dir/test.svg', 'svg', 'radial');
            expect(result).toBe(false);
        });
    });

    // --- Tests for Saving Graph to a String ---
    describe('Saving to String Functionality', () => {
        it('should return a non-null string for a valid format and layout', () => {
            const result = saveGraph('svg', 'radial');
            expect(result).not.toBeNull();
            expect(typeof result).toBe('string');
        });

        it('should return an SVG string when format is "svg"', () => {
            const result = saveGraph('svg', 'vertical');
            // A simple check to see if the string looks like an SVG.
            expect(result).toContain('<svg');
            expect(result).toContain('</svg>');
        });

        it('should return null for an unsupported format', () => {
            const result = saveGraph('png', 'radial');
            expect(result).toBeNull();
        });

        it('should return null for an unsupported layout', () => {
            const result = saveGraph('svg', 'circular');
            expect(result).toBeNull();
        });
    });
});