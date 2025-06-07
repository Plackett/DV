// main.ts
import { Graph, RadialLayoutCalculator, VerticalLayoutCalculator, NodeLayoutData, EdgeLayoutData } from './datahandler.ts';
import * as fs from 'fs';

// Imagine you have a rendering component or function
// import { renderGraphToCanvas } from './renderer'; // This would be a separate file for rendering

function initializeAndRenderGraph() {
    console.log("Initializing graph...")

    const myGraph = new Graph()

    myGraph.addNode(0)
    myGraph.addNode(0)
    myGraph.addNode(0)
    myGraph.addNode(1)
    myGraph.addNode(1)
    myGraph.addNode(1)
    myGraph.addNode(2)
    myGraph.addNode(2)
    myGraph.addNode(2)
    myGraph.addNode(3)
    myGraph.addNode(3)
    myGraph.addNode(3)

    const layoutCalculator = new VerticalLayoutCalculator();

    const nodeLayouts: Map<number, NodeLayoutData> = layoutCalculator.calculateLayout(myGraph);
    const edgeLayouts: EdgeLayoutData[] = layoutCalculator.generateEdges(myGraph, nodeLayouts);

    console.log("Calculated Node Layouts:", Array.from(nodeLayouts.values()));
    console.log("Calculated Edge Layouts:", edgeLayouts);
    console.log("Graph processing complete.");
    console.log("\n--- Generating SVG Output ---");

    const svgWidth = 800;
    const svgHeight = 800;
    const nodeRadius = 10;
    const scaleFactor = 1;

    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="${-svgWidth/2} ${-svgHeight/2} ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

    edgeLayouts.forEach(edge => {
        const source = nodeLayouts.get(edge.sourceID);
        const target = nodeLayouts.get(edge.targetID);
        if (source && target) {
            svgContent += `<line x1="${source.x * scaleFactor}" y1="${source.y * scaleFactor}" x2="${target.x * scaleFactor}" y2="${target.y * scaleFactor}" stroke="gray" stroke-width="3" />`;
        }
    });

    nodeLayouts.forEach(node => {
        svgContent += `<circle cx="${node.x * scaleFactor}" cy="${node.y * scaleFactor}" r="${nodeRadius}" fill="blue" stroke="black" stroke-width="0.5" />`;
        svgContent += `<text x="${node.x * scaleFactor}" y="${node.y * scaleFactor + nodeRadius/3}" dominant-baseline="middle"
          text-anchor="middle" font-size="15" fill="white">${node.id}</text>`;
    });

    svgContent += `</svg>`;

    // Save to file
    const outputSvgPath = './graph_output.svg';
    fs.writeFileSync(outputSvgPath, svgContent);
    console.log(`SVG output saved to: ${outputSvgPath}`);
    console.log("Open this file in a web browser or SVG viewer to see the visualization.");
}

initializeAndRenderGraph();