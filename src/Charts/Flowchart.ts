// @ts-ignore
import { Relation } from "./Chart.ts";

export default class FlowChart {
    vertices: {};
    edges: Relation[];

    constructor(vertices: {}, edges: Relation[]) {
        this.vertices = vertices;
        this.edges = edges;
        console.log(`Parsed flowchart with ${edges.length} edges.`)
    }
   
    getVertices(): {} {
        return this.vertices;
    }

    getEdges(): Relation[] {
        return this.edges;
    }
   
}
