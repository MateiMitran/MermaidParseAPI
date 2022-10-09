// @ts-ignore
import { Relation } from "./Chart.ts";

export default class ClassDiagram {
    classes: {};
    relations: Relation[];

    constructor(classes: {}, relations: Relation[]) {
        this.classes = classes;
        this.relations = relations;
         console.log(`Parsed class diagram with ${relations.length} relations.`)   
    }

    getClasses(): {} {
        return this.classes;
    }

    getEdges(): Relation[] {
        return this.relations;
    }
}