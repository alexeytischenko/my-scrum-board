import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
// import { Task } from './task.class';

@Injectable()
export class TasksListService {

  errorHandler = error => console.error('TaskService error', error);

  tasks = [];
  sprintLength : number = 0;
  backLogLength : number = 0;
  
  constructor(private projectsService : ProjectsService) {
      //this.getBackLog("mSmxxvKkt4ei6nL80Krmt9R0m983");
  }

  getBackLog(url) {
    let self = this;
    //progress_start("");
    return new Promise((resolve) => {
      var tasksRef = firebase.database().ref(`${url}/backlog/`);
      tasksRef.off(); 
      tasksRef.on('value', function(snapshot) {
        self.tasks = self.convert(snapshot.val());
        self.calculateSize();
        console.log("tasks", self.tasks);
        console.log("resolve", resolve);
        //progress_end();
      });
    });

    //setTimeout(() => this.rebuildSortable(), 1000);
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
