// test-utils.ts
import { Graph, Node } from '../src/datahandler.ts'; // Adjust path

import * as fs from 'fs';
import * as path from 'path';

export interface JsonNodeDefinition {
    parent: number; // The ID of the parent node
    id: number;     // The ID of this node
}

export interface TestTreeDefinition {
    description: string;
    nodes: JsonNodeDefinition[];
}

interface AllTestTrees {
    [key: string]: TestTreeDefinition;
}

let loadedTestTrees: AllTestTrees | null = null;

export function loadTestTrees(): AllTestTrees {
    if (loadedTestTrees) {
        return loadedTestTrees;
    }
    // Adjust path to your test-trees.json if it's not in the same directory as test-utils.ts
    const jsonPath = path.join(__dirname, 'test-trees.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    loadedTestTrees = JSON.parse(rawData);
    return loadedTestTrees!;
}

/**
 * Builds a Graph instance based on a given test tree definition.
 * This function uses the `addNodeWithSpecificId` method, meaning the `id` field
 * in your JSON will be directly assigned to the created nodes.
 *
 * @param treeDefinition The definition of the tree from test-trees.json.
 * @returns A Graph instance.
 */
export function buildGraphFromTestTreeWithSpecificIds(treeDefinition: TestTreeDefinition): Graph {
    const graph = new Graph();
    // Assuming root (id 0) is already present and correctly initialized in Graph constructor.

    // Sort nodes to ensure parents are processed before their children.
    // This simplifies graph construction and avoids issues with `findNode` failing for parents that don't exist yet.
    const sortedNodes = [...treeDefinition.nodes].sort((a, b) => a.parent - b.parent);

    sortedNodes.forEach(nodeDef => {
        // Use the new method that accepts a specific ID
        const addedNode = graph.addNodeWithSpecificId(nodeDef.parent, nodeDef.id);
        if (!addedNode) {
            console.warn(`Failed to add node ${nodeDef.id} (parent: ${nodeDef.parent}). Check graph structure or existing IDs.`);
        }
    });
    return graph;
}