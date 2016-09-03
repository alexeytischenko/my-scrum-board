import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
// import { Task } from './task.class';

@Injectable()
export class TasksListService {

  errorHandler = error => console.error('TaskService error', error);

  tasks = [];
  sprintLength : number = 0;
  backLogLength : number = 0;
  
  constructor(private projectsService : ProjectsService) {}

  getBackLog(url) {
    let self = this;
    var tasksRef = firebase.database().ref(`${url}/backlog/`);
    tasksRef.off(); 

    return new Promise(function(resolve, reject) {
          tasksRef.once('value', function(snapshot) {
            self.tasks = self.convert(snapshot.val());
            self.calculateSize();
            console.log("tasks", self.tasks);
            resolve(true);
          }); 
      }
    );
  }

  private convert(objectedResponse) {
    return Object.keys(objectedResponse)
      .map(id => ({
        id : id,
        name: objectedResponse[id].name,
        project: this.projectsService.getSName(objectedResponse[id].project),
        project_color : this.projectsService.getColor(objectedResponse[id].project),
        sortnum: objectedResponse[id].sortnum,
        estimate: objectedResponse[id].estimate,
        status: objectedResponse[id].status,
        type: objectedResponse[id].type
      }));
     // .sort((a, b) => a.name.localeCompare(b.name));
  }

  private calculateSize() {
    if (this.tasks && this.tasks.length > 0) {
        this.tasks.forEach(element => {
          if (element.type=="s") this.sprintLength++;
          else this.backLogLength++;
        });
    }
  }

}
