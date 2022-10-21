export default class Chart {
      
    nodes: [];
    relations: any[];
  
    constructor(nodes: [], relations: any[]) {
        this.nodes = nodes;
        this.relations = relations;
    }
  
    getNodes(): [] {
        return this.nodes;
    }
  
    getRelations(): any[] {
        return this.relations;
    }
  
}