// @ts-ignore
import { Relation } from "./Chart.ts";

export default class ClassDiagram {
  classes: {};
  relations: Relation[];
  direction: string;

  constructor(classes: {}, relations: Relation[], direction) {
    this.classes = classes;
    this.relations = relations;
    this.direction = direction;
  }

  getClasses(): {} {
    return this.classes;
  }

  getRelations(): Relation[] {
    return this.relations;
  }

  getDirection(): string {
    return this.direction
  }

  // getDesignPatterns structure
  getDesignPattern(): string[] {
    let structuredRelations: string[] = [];
    let i: number = 1;
    this.relations.forEach((rel) => {
      structuredRelations.push(
        `ID: ${i} first_class: ${rel.id1} relation: ${this.getRelationType(
          rel.relation.type1,
          rel.relation.type2,
          rel.relation.lineType
        )} second_class: ${rel.id2}`
      );
      i++;
    });
    return structuredRelations;
  }

  getDesignPatternArray(): any[] {
    let structuredRelations: any[] = [];
    let i: number = 1;
    this.relations.forEach((rel) => {
      if (rel.relation.type2 === "none" && rel.relation.type1 !=="none") {
        console.log(rel.id2);
        structuredRelations.push({
            id: i,
            first_class: rel.relation.id2,
            relation: this.getRelationType(
              rel.relation.type1,
              rel.relation.type2,
              rel.relation.lineType
            ),
            second_class: rel.relation.id1,
          });
      }
        if (rel.relation.type1 === "none" && rel.relation.type2 !=="none") {
        console.log("b");
        structuredRelations.push({
            id: i,
            first_class: rel.id1,
            relation: this.getRelationType(
              rel.relation.type1,
              rel.relation.type2,
              rel.relation.lineType
            ),
            second_class: rel.id2,
          });
      }
      i++;
    });
    return structuredRelations;
  }

  getRelationType(type1, type2, lineType) {
    if (type1.toString() === "none" && type2.toString() === "none") {
      switch (lineType.toString()) {
        case "0":
          return "solid link";
        case "1":
          return "dashed link";
      }
    }
    else if (type1.toString() === "none" && type2.toString !== "none") {
      switch (type2.toString()) {
        case "0":
          return "aggregation";
        case "1":
          if (lineType.toString() === "0") {
            return "inheritance";
          } else {
            return "realization";
          }
        case "2":
          return "composition";
        case "3":
          if (lineType.toString() === "0") {
            return "association";
          } else {
            return "dependency";
          }
      }
    } else if (type1.toString() !== "none" && type2.toString() === "none") {
      switch (type1.toString()) {
        case "0":
          return "aggregation";
        case "1":
          if (lineType.toString() === "0") {
            return "inheritance";
          } else {
            return "realization";
          }
        case "2":
          return "composition";
        case "3":
          if (lineType.toString() === "0") {
            return "association";
          } else {
            return "dependency";
          }
      }
    } else {
      return "";
    }
  }
}
