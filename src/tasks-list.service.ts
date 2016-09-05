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
    let taskscount = 0;
    var tasksRef = firebase.database().ref(`${url}/backlog/`);
    tasksRef.off(); 

    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("sortnum").once('value', function(snapshot) {

              snapshot.forEach(function(child) {
                  console.log(child.getKey(), child.val());
                  self.tasks[taskscount] = self.convertObject(child.val(), child.getKey());
                  taskscount++;
              });

              if (taskscount > 0) {
                console.log("tasks", self.tasks);
                resolve(true);
              }
              else reject("No tasks yet");
          }); 
    });
  }

  private convertObject(objectedResponse, id) {
    //calculateSize
    if (objectedResponse.type == "s") this.sprintLength++;
    else this.backLogLength++;

    return {
        id : id,
        name: objectedResponse.name,
        project: this.projectsService.getSName(objectedResponse.project),
        project_color : this.projectsService.getColor(objectedResponse.project),
        sortnum: objectedResponse.sortnum,
        estimate: objectedResponse.estimate,
        status: objectedResponse.status,
        type: objectedResponse.type
    };
  }

  // private convert(objectedResponse) {
  //   return Object.keys(objectedResponse)
  //     .map(id => ({
  //       id : id,
  //       name: objectedResponse[id].name,
  //       project: this.projectsService.getSName(objectedResponse[id].project),
  //       project_color : this.projectsService.getColor(objectedResponse[id].project),
  //       sortnum: objectedResponse[id].sortnum,
  //       estimate: objectedResponse[id].estimate,
  //       status: objectedResponse[id].status,
  //       type: objectedResponse[id].type
  //     }));
  //    // .sort((a, b) => a.name.localeCompare(b.name));
  // }

  // private calculateSize() {
  //   if (this.tasks && this.tasks.length > 0) {
  //       this.tasks.forEach(element => {
  //         if (element.type=="s") this.sprintLength++;
  //         else this.backLogLength++;
  //       });
  //   }
  // }

}
