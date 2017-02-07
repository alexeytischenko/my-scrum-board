import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { Task } from './task.class';
import { AttachmentsService } from './attachments.service';
import { CommonService } from './common.service';

@Injectable()
export class TaskService {

  errorHandler = error => console.error('TaskService error', error);
  
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  task;
  taskSatuses = ['idle', 'in progress', 'review', 'resolved'];
  openComments = [];
  openLogs = [];
  
  constructor(private attachmentsService : AttachmentsService,
              private commonService : CommonService) { }

  getTask(url: string, id:string) {
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`).child(id);
    taskRef.off(); 

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {

            if (snapshot.exists()) {
              self.task = snapshot.val();
              self.task.id = id;
              self.task.subtasks = self.commonService.getArrayFromObject(self.task.subtasks);
              self.task.attachments = self.commonService.getArrayFromObject(self.task.attachments);
              self.attachmentsService.getDownloadURLs(url, id, self.task.attachments)
                .then((attach) => {
                  self.task.attachments = attach;
                  resolve(true);
                });
            }
            else reject("Couldn't get task data");
          }); 
      }
    );
  }

  getAnyTask(url: string, id:string) {
    // get parentTask for taskEdit component
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`).child(id);
    taskRef.off(); 

    var tmpTask;

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {
            if (snapshot.exists()) {
              tmpTask = snapshot.val();
              tmpTask.id = id;
              resolve(tmpTask);
            }
            else reject("Couldn't get task name");
          }); 
      }
    );
  }  

  saveTask(url: string, task) {
    console.debug("TaskService:saveTask(url: string, task)", url, task);

    let postData; 
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`);

    if (task.id == -1) {
      //new task properties
      return new Promise(function(resolve, reject) {
        self.getMaxCodeNum(url)
          .catch((error)=>reject(error))
          .then((maxnum : any)=> { 
            const newmaxnum = maxnum.code + 1;
            postData = {
              name: task.name ? task.name : "",
              estimate: task.estimate ? task.estimate : 0,
              worked: 0,
              commentsNum: 0,
              sortnum : 0,
              status: task.status ? task.status : "idle",
              parent: (task.parent) ? task.parent : "",
              type: (task.parent) ? "i" : "b",
              code: newmaxnum,
              description: task.description ? task.description : "",
              project: task.project ? task.project : "",
              updated: Date.now(),
              created: Date.now()
            }
            let newtaskRef = taskRef.push();
            newtaskRef.set(postData, function(error) {
              if (error) {
                reject(error);
              } else {
                  if (task.parent) {
                    self.savePropery(url, task.parent + "/subtasks", {
                        [newtaskRef.key.toString()] : {
                            name: task.name, 
                            estimate: task.estimate,
                            project: task.project,
                            status: task.status,
                            worked: 0
                        }
                    });
                  }
                  resolve(newtaskRef.key.toString());
              }
            }); 
          });
      });
    } else {      
        //existing task properties
        postData = {
          name: task.name ? task.name : "",
          estimate: task.estimate ? task.estimate : 0,
          status: task.status ? task.status : "idle",
          description: task.description ? task.description : "",
          project: task.project ? task.project : "",
          updated: Date.now()
        }

        return new Promise(function(resolve, reject) {
            taskRef.child(task.id).update(postData, function(error) {
                if (error) {
                  console.error('Update failed');
                  reject(error);
                } else {
                  if (task.parent) {
                    self.savePropery(url, task.parent + "/subtasks", {
                        [task.id] : {
                            name: task.name, 
                            estimate: task.estimate,
                            project: task.project,
                            status: task.status
                        }
                    });
                  }
                  resolve(true);
                }
            }); 
        });
    }
  }

  savePropery(url: string, taskid: string, postData : any) {
    console.debug("TaskService:savePropery(url: string, taskid: string, postData : any)", url, taskid, postData);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`);

    return new Promise(function(resolve, reject) {
        taskRef.child(taskid).update(postData, function(error) {
            if (error) {
              console.error('Update failed');
              reject(error);
            } else {
              resolve(true);
            }
        }); 
    });
  }

  removeTask(url: string, taskId: string) {
    // remove task
    console.debug ("TaskService:removeTask(url, taskId)", url, taskId);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/${taskId}`);
    let wlRef = firebase.database().ref(`${url}/worklog/${taskId}`);
    let comRef = firebase.database().ref(`${url}/comments/${taskId}`);
    
    //removing task
    return new Promise(function(resolve, reject) {
        taskRef.remove()
        .then(() => wlRef.remove())                       // remove worklogs
        .then(() => comRef.remove())                      // remove comments
        .then(() => self.attachmentsService.removeAllAttachments(url, taskId, self.task.attachments))      // remove attachments
        .then(() => self.removeSubTasks(url, self.task))   
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  private getMaxCodeNum (url) {
    let tasksRef = firebase.database().ref(`${url}/backlog/`);
    
    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("code").limitToLast(1).once('value', function(snapshot) {           
            let maxnum = 0;
            snapshot.forEach(function(child) {
             maxnum = child.val();
            });
            resolve(maxnum);
          });        
    });
  }

  private removeSubTasks(url, task) {
    // remove subtasks OR parent subtask pointer
    console.debug ("TaskService:removeSubTasks(url, task)", url, task);

    let tasksRef = firebase.database().ref(`${url}/backlog/`);
    let self = this;

    return new Promise(function(resolve, reject) {

      if (task.type == "i") {
        //it is a subtask - update parent
        tasksRef.child(`${task.parent}/subtasks/${task.id}`).remove()
        .then(() => resolve(true))
        .catch((error) => reject(error));
      }
      else {
        //it is not a subtask - check if this task has subtasks - delete them
        if (task.subtasks && task.subtasks.length > 0) {
        
          let resolveCounter = task.subtasks.length;

          task.subtasks.forEach(element => {
              let taskRef = firebase.database().ref(`${url}/backlog/${element.id}`);
              let wlRef = firebase.database().ref(`${url}/worklog/${element.id}`);
              let comRef = firebase.database().ref(`${url}/comments/${element.id}`);

              self.attachmentsService.getAttachments(url, element.id)
              .then((attachments) => self.attachmentsService.removeAllAttachments(url, element.id, attachments))      // remove attachments
              .then(() => taskRef.remove())
              .then(() => wlRef.remove())                       // remove worklogs
              .then(() => comRef.remove())                      // remove comments
              .then(() => {
                resolveCounter--;
                //console.log("resolveCounter", resolveCounter);
                if (resolveCounter <= 0)  {
                  resolve(true); 
                }
              })
              .catch((error) => reject("Subtask delete failed: {"+error+"}"));
          });
        } else resolve(true);
      }
    });
  }

  ifOpenComments(taskId) : boolean {
    //check if show comments in curnet task
    if (this.openComments.indexOf(taskId) !== -1) return true;
    else return false;

  }

  removeFromOpenComments(taskId) {
    //removes element from check array
    const i = this.openComments.indexOf(taskId);
    if (i > -1) this.openComments.splice(i, 1);
    console.log("this.openComments remove", this.openComments);
  }

  addToOpenComments(taskId) {
    //adds task to check array
    if (this.openComments.indexOf(taskId) == -1) this.openComments.push(taskId);
    console.log("this.openComments add", this.openComments);
  }

  ifOpenLogs(taskId) : boolean {
    //check if show logs in curnet task
    if (this.openLogs.indexOf(taskId) !== -1) return true;
    else return false;
  }

  removeFromOpenLogs(taskId) {
    //removes element from check array
    const i = this.openLogs.indexOf(taskId);
    if (i > -1) this.openLogs.splice(i, 1);
    console.log("this.openLogs remove", this.openLogs);
  }

  addToOpenLogs(taskId) {
    //adds task to check array
    if (this.openLogs.indexOf(taskId) == -1) this.openLogs.push(taskId);
    console.log("this.openLogs add", this.openLogs);
  }

}
