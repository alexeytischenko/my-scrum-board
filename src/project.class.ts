
export class Project {

    id : string;
    name: string;
    sname: string;
    color: string;

    fill (name: string, sname: string, color: string, id: string) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.sname = sname;
    }

    newProject(name: string, color: string) {
        this.name = name;
        this.color = color;
        this.sname = "LLL";
    }

 }
