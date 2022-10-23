//@ts-ignore
import ClassDiagram,{_Class} from "./Charts/ClassDiagram.ts";



export function checkSingleton(classDiagram: ClassDiagram, id: string): boolean {

    var singletonClass: _Class;
    var classes: _Class[];

    classes = classDiagram.getClasses();
    if (!classes) {return false;}

    classes.forEach(_class => {
        if (_class.id === id) {
            singletonClass = _class;
        }
    });

    if (!singletonClass) {return false;}

    let ok: number = 0;

    //Step1: Check if a variable of singleton class is static private class instance
    singletonClass.members.forEach(member=> {
        if (member.includes(`-${singletonClass.id}`) && member.charAt(member.length-1)==="$") {
            ok=1;
        }
    });

    if (ok==0) {return false;}


    //Step2: Singleton Class has Private Constructor && Step3: Singleton class has a Public method that returns instance of class
    singletonClass.methods.forEach(method=> {
        if (method.includes(`-${singletonClass.id}()`)) {
            ok=1;
        } else {
            ok=0;
        }

        if (method.charAt(0)==="+" && method.includes("$") && method.substring(method.indexOf('$') + 1).includes(`${singletonClass.id}`)) {
            ok=1;
        } else {
            ok=0;
        }
    });

    if (ok==0) {return false;}

   //Step4: Make sure the there is no instance of Singleton class, rather the static method is called
   classes.forEach(_class => {
    if (_class.id !== id) {
        _class.members.forEach(member=> {
            if (member.includes(`-${singletonClass.id}`)) {
                ok=0;
            }
        });
    }
   });


   if (ok==0) {return false;}

   return true;

}

/** dummy diagram
 ```mermaid 
classDiagram
class Singleton{
-Singleton singletoninstance$
-Singleton()
+getInstance()$ Singleton
}
class Lol{
-Singleton lol
+Lol()
+getLol() Lol
}
```
 */