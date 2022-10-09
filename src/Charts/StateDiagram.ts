// @ts-ignore
import { Relation } from "./Chart.ts";

export default class StateDiagram {
    classes: {};
    relations: Relation[];

    constructor(classes: {}, relations: Relation[]) {
        this.classes = classes;
        this.relations =relations;
         console.log(`Parsed state diagram with ${relations.length} relations.`)   
    }

    getClasses(): {} {
        return this.classes;
    }

    getEdges(): Relation[] {
        return this.relations;
    }
}