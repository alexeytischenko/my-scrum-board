import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { Task } from './task.class';
import { AttachmentsService } from './attachments.service';

@Injectable()
export class TaskService {

  errorHandler = error => console.error('TaskService error', error);
  
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  task;
  taskSatuses = ['idle', 'in progress', 'review', 'resolved'];
  openComments = [];
  openLogs = [];
  
  constructor(private attachmentsService : AttachmentsService) { }

  getTask(url: string, id:string) {
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`).child(id);
    taskRef.off(); 

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {

            if (snapshot.exists()) {
              self.task = snapshot.val();
              self.task.id = id;
              self.task.attachments = self.attachmentsService.getAttachmentsArray(self.task.attachments);
              resolve(true);
            }
            else reject("Couldn't get task data");
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
              type: "b",
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
                  console.log("new task", postData);
                  console.log("newtaskRef", newtaskRef.key.toString());
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
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/${taskId}`);
    let wlRef = firebase.database().ref(`${url}/worklog/${taskId}`);
    let comRef = firebase.database().ref(`${url}/comments/${taskId}`);
    console.log("taskRef", `${url}/backlog/${taskId}`);

    //removing task
    return new Promise(function(resolve, reject) {
        taskRef.remove(function(error) {
            if (error) reject(error);
            resolve(true);
          })
        .then(wlRef.remove())
        .then(comRef.remove())
        .catch((error)=>reject(error));
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
