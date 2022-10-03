type Relation = {
    [key: string] : {}
    relSpec?: {
      [key: string] : string
    }
  }
  
  
  export default class Chart {
      
    nodes: {};
    relations: Relation[];
  
    constructor(nodes: {}, relations: Relation[]) {
        this.nodes = nodes;
        this.relations = relations;
    }
  
    getNodes(): {} {
        return this.nodes;
    }
  
    getRelations(): Relation[] {
        return this.relations;
    }
  
  }