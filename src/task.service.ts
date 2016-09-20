import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { Task } from './task.class';

@Injectable()
export class TaskService {

  errorHandler = error => console.error('TaskService error', error);
  
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  task;
  taskSatuses = ['idle', 'in progress', 'review', 'resolved'];
  
  constructor() { }

  getTask(url: string, id:string) {
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`).child(id);
    taskRef.off(); 

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {
            //console.log(snapshot.val());
            self.task = snapshot.val();
            self.task.id = id;

            if (self.task.name.length > 0) {
              console.log("task", self.task);
              resolve(true);
            }
            else reject("Couldn't get task data");
          }); 
      }
    );
  }

  saveTask(url: string, task) {
    let postData; 
    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`);

    if (task.id == -1) {
      //new task properties
      return new Promise(function(resolve, reject) {
        self.getMaxCodeNum(url)
          .catch((error)=>reject(error))
          .then((maxnum : any)=> { 
            console.error("maxnum", maxnum);
            const newmaxnum = maxnum.code + 1;
            postData = {
              name: task.name,
              estimate: task.estimate,
              sortnum : Date.now(),
              status: task.status,
              type: "b",
              code: newmaxnum,
              description: task.description,
              project: task.project,
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
          name: task.name,
          estimate: task.estimate,
          status: task.status,
          description: task.description,
          project: task.project,
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

}
