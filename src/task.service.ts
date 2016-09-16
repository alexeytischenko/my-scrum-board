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
    
    let postData = {
      name: task.name,
      estimate: task.estimate,
      status: task.status,
      description: task.description,
      project: task.project,
      updated: Date.now()
    };

    console.log("update data", postData);
    console.log("update data id", task.id);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/`).child(task.id);

    return new Promise(function(resolve, reject) {
        taskRef.update(postData, function(snapshot) {
            console.log(snapshot);
            resolve(true);
          }); 
      }
    );
    // // Get a key for a new Post.
    // var newPostKey = firebase.database().ref().child('posts').push().key;

    // // Write the new post's data simultaneously in the posts list and the user's post list.
    // var updates = {};
    // updates['/posts/' + newPostKey] = postData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    // return firebase.database().ref().update(updates);
  }

  // private convertToTask(taskJson) : Task {
  //   return new Task(taskJson.name, taskJson.project, taskJson.sortnum, taskJson.estimate, taskJson.created, taskJson.updated,taskJson.status, taskJson.description, [], [], []);

  // }

  // private convert(parsedResponse) {
  //   return Object.keys(parsedResponse)
  //     .map(id => ({
  //       id : id,
  //       name: parsedResponse[id].name,
  //       project: parsedResponse[id].project,
  //       sortnum: parsedResponse[id].sortnum,
  //       estimate: parsedResponse[id].estimate
  //     }));
  //    // .sort((a, b) => a.name.localeCompare(b.name));
  // }

}
