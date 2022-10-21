export default class StateDiagram {
    classes: {};
    relations: any[];

    constructor(classes: {}, relations: any[]) {
        this.classes = classes;
        this.relations =relations;
         console.log(`Parsed state diagram with ${relations.length} relations.`)   
    }

    getClasses(): {} {
        return this.classes;
    }

    getEdges(): any[] {
        return this.relations;
    }
}