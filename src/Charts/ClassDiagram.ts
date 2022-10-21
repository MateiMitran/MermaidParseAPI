type Relation = {
  id: number,
  first_class: string,
  relation: string,
  second_class: string
}

export default class ClassDiagram {
  classes: {};
  relations: Relation[];
  debug: any[];

  constructor(classes: {}, debug: any[]) {
    this.classes = classes;
    this.debug = debug;
    this.relations = this.getDesignPatternArray();
  }

  getClasses(): {} {
    return this.classes;
  }

  getDebug(): any[] {
    return this.debug;
  }

  getRelations(): Relation[] {
    return this.relations;
  }

  // getDesignPatterns structure
 
  getDesignPatternArray(): Relation[] {
    let structuredRelations: Relation[] = [];
    let i: number = 1;
    this.debug.forEach((rel) => {
      structuredRelations.push({
        id: i,
        first_class:
          (rel.relation.type2 === "none" && rel.relation.type1 !== "none")
             ? rel.id2
             : rel.id1,
        relation: this.getRelationType(
          rel.relation.type1,
          rel.relation.type2,
          rel.relation.lineType
        ),
        second_class:
          (rel.relation.type2 === "none" && rel.relation.type1 !== "none")
          ? rel.id1
          : rel.id2,
      });
      i++;
    });
    return structuredRelations;
  }

  getRelationType(type1: number, type2: number, lineType: number): string {
    if (type1.toString() === "none" && type2.toString() === "none") {
      switch (lineType.toString()) {
        case "0":
          return "solid link";
        case "1":
          return "dashed link";
      }
    } else if (type1.toString() === "none" && type2.toString() !== "none") {
      return this.conversion(type2.toString(),lineType.toString());
    } else if (type1.toString() !== "none" && type2.toString() === "none") {
      return this.conversion(type1.toString(),lineType.toString());
    } else {
      return "";
    }
  }


  private conversion(relationCode: string, lineType: string): string {
    switch (relationCode) {
      case "0":
        return "aggregation";
      case "1":
        if (lineType === "0") {
          return "inheritance";
        } else {
          return "realization";
        }
      case "2":
        return "composition";
      case "3":
        if (lineType === "0") {
          return "association";
        } else {
          return "dependency";
        }
    }
  }
}
