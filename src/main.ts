// main.ts
import { Graph, RadialLayoutCalculator, NodeLayoutData, EdgeLayoutData } from './datahandler.ts';

// Imagine you have a rendering component or function
// import { renderGraphToCanvas } from './renderer'; // This would be a separate file for rendering

function initializeAndRenderGraph() {
    console.log("Initializing graph...");

    // 1. Create a graph instance
    const myGraph = new Graph();

    // 2. Build out a simple graph structure
    myGraph.addNode(0); // Add child 1 to root
    myGraph.addNode(0); // Add child 2 to root
    myGraph.addNode(1); // Add child 3 to child 1
    myGraph.addNode(1); // Add child 4 to child 1
    myGraph.addNode(2); // Add child 5 to child 2

    // 3. Create a layout calculator instance
    const layoutCalculator = new RadialLayoutCalculator();

    // 4. Calculate the layout
    const nodeLayouts: Map<number, NodeLayoutData> = layoutCalculator.calculateLayout(myGraph);
    const edgeLayouts: EdgeLayoutData[] = layoutCalculator.generateEdges(myGraph, nodeLayouts);

    console.log("Calculated Node Layouts:", Array.from(nodeLayouts.values()));
    console.log("Calculated Edge Layouts:", edgeLayouts);

    // 5. If you had a rendering layer, you'd pass this data to it:
    // const canvasElement = document.getElementById('myCanvas'); // In a browser environment
    // if (canvasElement) {
    //     renderGraphToCanvas(canvasElement, nodeLayouts, edgeLayouts);
    // } else {
    //     console.warn("Canvas element not found. Graph not rendered visually.");
    // }

    console.log("Graph processing complete.");
}

// When your application starts (e.g., in a browser or Node.js environment)
// You would call this function.
// For a browser: window.onload = initializeAndRenderGraph;
// For a simple Node.js script:
initializeAndRenderGraph();