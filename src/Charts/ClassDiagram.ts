// @ts-ignore
import { Relation } from "./Chart.ts";

export default class ClassDiagram {
    classes: {};
    relations: Relation[];

    constructor(classes: {}, relations: Relation[]) {
        this.classes = classes;
        this.relations = relations;
    }

    getClasses(): {} {
        return this.classes;
    }

    getRelations(): Relation[] {
        return this.relations;
    }


    // getDesignPatterns structure 
    getDesignPattern() : string[] {
        let structuredRelations: string[] = [];
        let i: number = 1;
        this.relations.forEach((rel)=> {
            structuredRelations.push(`ID: ${i} first_class: ${rel.id1} relation: ${this.getLineType(rel.relation.type1)} second_class: ${rel.id2}`);
            i++;
        })
        return structuredRelations;
    }

    getDesignPatternArray() : {}[] {
        let structuredRelations: {}[] = [];
        let i: number = 1;
        this.relations.forEach((rel)=> {
            structuredRelations.push({id: i, first_class: rel.id1, relation: this.getLineType(rel.relation.type1),second_class: rel.id2});
            i++;
        })
        return structuredRelations;
    }

    getLineType(type:number): string {

        console.log(type);
        switch (type.toString()) {
            case "0":
                return "aggregation"
            case "1":
                return "inheritance"
            case "2":
                return "composition"
            case "3":
                return "dependency"
            default:
                //console.log("Unknown line type");
                break;
        }
    } 
}