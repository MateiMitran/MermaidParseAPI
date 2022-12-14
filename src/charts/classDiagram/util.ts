import { Relation } from "./ClassDiagram";

export function getDesignPatternArray(debug: any[]): Relation[] {
  let structuredRelations: Relation[] = [];
  let i: number = 1;
  debug.forEach((rel) => {
    structuredRelations.push({
      id: i,
      first_class:
        rel.relation.type2 === "none" && rel.relation.type1 !== "none"
          ? rel.id2
          : rel.id1,
      relation: getRelationType(
        rel.relation.type1,
        rel.relation.type2,
        rel.relation.lineType
      ),
      second_class:
        rel.relation.type2 === "none" && rel.relation.type1 !== "none"
          ? rel.id1
          : rel.id2,
    });
    i++;
  });
  return structuredRelations;
}

function getRelationType(
  type1: number,
  type2: number,
  lineType: number
): string {
  if (type1.toString() === "none" && type2.toString() === "none") {
    switch (lineType.toString()) {
      case "0":
        return "solid link";
      case "1":
        return "dashed link";
    }
  } else if (type1.toString() === "none" && type2.toString() !== "none") {
    return conversion(type2.toString(), lineType.toString());
  } else if (type1.toString() !== "none" && type2.toString() === "none") {
    return conversion(type1.toString(), lineType.toString());
  } else {
    return "";
  }
}

function conversion(relationCode: string, lineType: string): string {
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

export function getAccessibility(member: string): string {
  let char: string = member.charAt(0);

  switch (char) {
    case "+":
      return "public";
    case "-":
      return "private";
    case "#":
      return "protected";
    case "~":
      return "package";
    default:
      return "none";
  }
}

export function getClassifierMember(member: string): string {
  let char: string = member.charAt(member.length - 1);
  switch (char) {
    case "$":
      return "static";
    case "*":
      return "abstract";
    default:
      return "none";
  }
}

export function getClassifierMethod(method: string): string {
  let char: string = method
    .substring(method.indexOf(")") + 1)
    .trim()
    .charAt(0);
  switch (char) {
    case "$":
      return "static";
    case "*":
      return "abstract";
    default:
      return "none";
  }
}

export function getMemberReturnType(member: string): string {
  member = member.replace(/\s+/g, " ");
  if (getAccessibility(member) === "none") {
    return member.substring(0, member.indexOf(" "));
  } else {
    if (member.charAt(1) === " ") {
      return member.substring(2).substring(0, member.substring(2).indexOf(" "));
    } else {
      return member.substring(1, member.indexOf(" "));
    }
  }
}

export function getMemberName(member: string) {
  member = member.replace(/\s+/g, " ");
  if (getClassifierMember(member) !== "none") {
    if (getAccessibility(member) !== "none") {
      return member
        .substring(1)
        .substring(member.substring(1).indexOf(" "))
        .slice(0, -1)
        .trim();
    } else {
      return member
        .substring(member.indexOf(" ") + 1)
        .slice(0, -1)
        .trim();
    }
  } else {
    if (getAccessibility(member) !== "none") {
      return member
        .substring(1)
        .trim()
        .substring(member.substring(1).trim().indexOf(" ") + 1);
    } else {
      return member.substring(member.indexOf(" ") + 1).trim();
    }
  }
}

export function getMethodReturnType(method: string): string {
  if (getClassifierMethod(method) !== "none") {
    return method
      .substring(method.indexOf(")") + 1)
      .substring(1)
      .trim();
  } else {
    return method.substring(method.indexOf(")") + 1).trim();
  }
}

export function getMethodName(method: string): string {
  if (getAccessibility(method) === "none") {
    return method.substring(0, method.indexOf("(")).trim();
  } else {
    return method.substring(1, method.indexOf("(")).trim();
  }
}
