// @ts-ignore
import { Relation } from "./Chart.ts";

export default class ERDiagram {
    entities: {};
    relationships: Relation[];

    constructor(entities: {}, relationships: Relation[]) {
        this.entities = entities;
        this.relationships = relationships;
         console.log(`Parsed entity relationship diagram with ${relationships.length} relations.`)   
    }

    getEntities(): {} {
        return this.entities;
    }

    getRelationships(): Relation[] {
        return this.relationships;
    }
}