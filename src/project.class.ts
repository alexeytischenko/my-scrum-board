
export class Project {

    id : string;
    name: string;
    sname: string;
    color: string;

    constructor() {
        this.id = "";
        this.name = "";
        this.color = "";
        this.sname = ""; 
    }

    fill (name: string, sname: string, color: string, id: string) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.sname = sname;
    }

    newProject(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.sname = this.generateShortName(name);
    }

    private generateShortName (name: string) : string {
        //creating short name. Only Latin characters
        // JS5 doesn't understand 'u' - modifier in regexp
        // JS6 does, but need special transpiler to. Maybe later 
        let sname = name.replace(/(\w)\w*\W*/g, function (_, i) {
            return i.toUpperCase();
        });
        return sname;
    }

 }
