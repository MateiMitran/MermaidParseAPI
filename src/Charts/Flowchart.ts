export default class FlowChart {
    vertices: {};
    edges: any[];

    constructor(vertices: {}, edges: any[]) {
        this.vertices = vertices;
        this.edges = edges;
        console.log(`Parsed flowchart with ${edges.length} edges.`)
    }
   
    getVertices(): {} {
        return this.vertices;
    }

    getEdges(): any[] {
        return this.edges;
    }
   
}
