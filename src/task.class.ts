
export class Task {

    constructor (
        public id: number,
        public name: string, 
        public project : string,  
        public estimate : number,   
        public description : string,
        public status? : string,
        public sortnum? : number,
        public created? : number, 
        public updated? : number,         
        public attachments? : any[], 
        public comments? : any[], 
        public worklog? : any[]) {
    }

    
    // private convertToTask(taskJson) : Task {
    //   return new Task(taskJson.name, taskJson.project, taskJson.sortnum, taskJson.estimate, taskJson.created, taskJson.updated,taskJson.status, taskJson.description, [], [], []);
    // }
 }
