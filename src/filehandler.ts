import { Graph, RadialLayoutCalculator, VerticalLayoutCalculator, ClusterLayoutCalculator, NodeLayoutData, EdgeLayoutData } from './datahandler.ts';
import * as fs from 'fs';

// TODO: add functionality to open json files and csv files with table/tree data
// should return a Graph object
export function openFile(filename: string): Graph | null {
    return null
}

// TODO: add export functionality to export to svg and html canvas or whatever seems appropriate for the codebase
/**
 *  @param path this string allows user to select an output path
 *  @param format this string allows user to select an output format, ex: svg, html, png
 *  @param layout allowed values: radial, vertical, cluster, basically just chooses the layout calculator to use
 *  */
export function saveGraphToFile(path: string, format: string, layout: string): boolean {
    return false
}

// TODO: add string alternative which outputs the string text of the file to the output in the code instead of putting it on another file
export function saveGraph(format: string, layout: string): string | null {
    return null
}