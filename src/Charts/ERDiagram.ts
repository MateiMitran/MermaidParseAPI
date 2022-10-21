export default class ERDiagram {
    entities: {};
    relationships: any[];

    constructor(entities: {}, relationships: any[]) {
        this.entities = entities;
        this.relationships = relationships;
         console.log(`Parsed entity relationship diagram with ${relationships.length} relations.`)   
    }

    getEntities(): {} {
        return this.entities;
    }

    getRelationships(): any[] {
        return this.relationships;
    }
}