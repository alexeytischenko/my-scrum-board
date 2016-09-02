
export class Task {

    constructor (
        private name: string, 
        private project : string, 
        private sortnum : number, 
        private estimate : number, 
        private created : number, 
        private updated : number, 
        private status : string, 
        private description : string, 
        private attachments : any[], 
        private comments : any[], 
        private worklog : any[]) {
    }


    // private convertToTask(taskJson) : Task {
    //   return new Task(taskJson.name, taskJson.project, taskJson.sortnum, taskJson.estimate, taskJson.created, taskJson.updated,taskJson.status, taskJson.description, [], [], []);
    // }
 }
