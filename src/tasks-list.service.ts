import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';

@Injectable()
export class TasksListService {

  errorHandler = error => console.error('TaskService error', error);
  tasks = [];
  
  constructor(private projectsService : ProjectsService) {}

  getBackLog(url) {
    let self = this;
    let taskscount = 0;
    let tasksRef = firebase.database().ref(`${url}/backlog/`);
    tasksRef.off(); 

    //retrun Promise to get the backLog
    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("sortnum").once('value', function(snapshot) {

              snapshot.forEach(function(child) {
                  self.tasks[taskscount] = self.convertObject(child.val(), child.getKey());
                  taskscount++;
              });

              if (taskscount > 0) resolve(true);
              else reject("No tasks yet");
          }); 
    });
  }

  resortBackLog(url, jsonData) {
    
    let self = this;
    let resolveCounter = jsonData.length;

    //return Promise to record new tasks order
    return new Promise(function(resolve, reject) {
      for (let child of jsonData) {
        //proceed if element is not empty
        if (child.id && 0 !== child.id.length) {
          //update FIREBASE
          let ref = firebase.database().ref(`${url}/backlog/${child.id}/`);
          ref.update({
            "sortnum": child.sortnum,
            "type": child.type
          })
          .then(function() {
            //update tasks
            //self.updateTaskSorting(child.id, child.type, child.sortnum);

            //checking if it's time to call resolve : resolve only after last success callback
            resolveCounter--;
            if (resolveCounter <= 0)  resolve(true); 
          })
          .catch((error) => reject("Backlog sorting failed: {"+error+"}"));
        }
        else {
          resolveCounter--;
          if (jsonData.length == 1) resolve(true); //if the only element is disable-section_header or just empty, then resolving immidiately
        }       
      }
    });

  }

  private updateTaskSorting(id : string, type : string, sortnum : number) {
    //updating stored tasklist object
    for (let task of this.tasks) {
        if (task.id == id)
        {
          task.type = type;
          task.sortnum = sortnum;
        }
    }
  }

  private convertObject(objectedResponse, id) {
    //creating/inflating Project object
    let project = new Project();
    project = this.projectsService.getProject(objectedResponse.project);

    return {
        id : id,
        name: objectedResponse.name,
        id_in_project : objectedResponse.id_in_project,
        project: project.sname,
        project_color : project.color,
        sortnum: objectedResponse.sortnum,
        estimate: objectedResponse.estimate,
        status: objectedResponse.status,
        type: objectedResponse.type
    };
  }

}
