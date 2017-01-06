import { Injectable } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';

@Injectable()
export class TasksListService {

  errorHandler = error => console.error('TaskListService error', error);
  tasks = [];
  filter = {};
  
  constructor(private projectsService : ProjectsService) {
    console.info ("TasksListService:constructor");
  }

  getBackLog(url) {
    console.info ("TasksListService:getBackLog(url), filter", url, this.filter);

    const filter_length = Object.keys(this.filter).length;
    console.info ("filter_length", filter_length);
    let self = this;
    let taskscount = 0;
    let tasksRef = firebase.database().ref(`${url}/backlog/`);
    tasksRef.off(); 

    //retrun Promise to get the backLog
    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("sortnum").once('value')
          .then(function(snapshot) {

              self.tasks = [];  // empty the list
              snapshot.forEach(function(child) {
                // checking if there's a filter and if this task match the condition
                let tmpTask = self.convertObject(child.val(), child.getKey());
                if (filter_length == 0 || tmpTask.project_id in self.filter) {    //obj.hasOwnProperty(prop)
                  self.tasks[taskscount] = tmpTask;
                  taskscount++;
                }
              });
              resolve(taskscount);
          })
          .catch(function(error){
            reject(error);
          });
    });
  }

  resortBackLog(url, jsonData) {
    console.info ("TasksListService:resortBackLog(url, jsonData)", url, jsonData);
    
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
            //checking if it's time to call resolve : resolve only after last success callback
            resolveCounter--;
            self.updateTaskWJson(child);

            if (resolveCounter <= 0)  {
              // when sortnumbers assigned, tasks array should be resorted according the new sortnumbers
              self.tasks.sort((a, b) => {return a.sortnum == b.sortnum ? 0 : +(a.sortnum > b.sortnum) || -1});
              resolve(true); 
            }
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

  private convertObject(objectedResponse, id) {
    //creating/inflating Project object
    let project = new Project();
    project = this.projectsService.getProject(objectedResponse.project);

    return {
        id : id,
        name: objectedResponse.name,
        code : objectedResponse.code,
        project: project.sname,
        project_id : project.id,
        project_color : project.color,
        sortnum: objectedResponse.sortnum,
        estimate: objectedResponse.estimate,
        worked: objectedResponse.worked,
        status: objectedResponse.status,
        type: objectedResponse.type,
        commentsNum: objectedResponse.commentsNum
    };
  }

  private updateTaskWJson (js: any) {
    // updates service propetry tasks[] values
    console.debug("TasksListService:updateTaskWJson (js: any)", js);

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == js.id) {
        this.tasks[i].type = js.type;
        this.tasks[i].sortnum = js.sortnum;

        return;
      }
    }

  }

  addToFilter(key : string, value: string) {
    //add project ("id" : "short name") to filter object
    console.info ("TasksListService:addToFilter(key : string, value: string)", key, value);

    if(!this.filter.hasOwnProperty(key)) {
        this.filter[key] = value;
        console.info("this.filter", this.filter);
    }

  }

  removeFromFilter(key : string) {
    //remove project ("id" : "short name") from filter object
    console.info ("TasksListService:removeFromFilter(key : string)", key);

    if( this.filter.hasOwnProperty(key) ){
      delete this.filter[key];
      console.info("this.filter", this.filter);
    }

  }

}
