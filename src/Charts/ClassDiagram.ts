export type Relation = {
  id: number,
  first_class: string,
  relation: string,
  second_class: string
}

export type _Class = {
  id: string,
  type: string,
  members: string[],
  methods: string[],
}

export type Member = {
  id: number,
  type: string,
  name: string,
  accessibility: string,
  classifier: string 
}

export type Method = {
  id: number,
  returnType: string,
  name: string,
  keyword: string,
  accessibility: string,
  classifier: string 
}



export default class ClassDiagram {
  classes: _Class[];
  relations: Relation[];
  debug: any[];

  constructor(classes: {}, debug: any[]) {

    this.classes = Object.values(classes);
    this.classes.forEach(_class=> {
      //@ts-ignore
      delete(_class.annotations);delete(_class.cssClasses);delete(_class.domId);
    })
    this.debug = debug;
    this.relations = this.getDesignPatternArray();
    console.log(`Parsed class diagram with ${this.relations.length} relations`);
  }

  getClasses(): _Class[] {
    return this.classes;
  }

  getDebug(): any[] {
    return this.debug;
  }

  getRelations(): Relation[] {
    return this.relations;
  }

  getMembers(_class: _Class): Member[] {
    this.classes.forEach(__class => {
      if (JSON.stringify(__class) === JSON.stringify(_class)) {
        return __class.members;
      }
    });
    return undefined;
  }

  getMethods(_class: _Class): Method[] {
    this.classes.forEach(__class => {
      if (JSON.stringify(__class) === JSON.stringify(_class)) {
        return __class.methods;
      }
    });
    return undefined;
  }

 
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
