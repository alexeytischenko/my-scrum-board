
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
 }
