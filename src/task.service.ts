import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Task } from './task.class';

@Injectable()
export class TaskService {

  errorHandler = error => console.error('TaskService error', error);
  
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  task;
  
  constructor(private http: Http) { }

  addBookmark(bookmark) {
    const json = JSON.stringify(bookmark);
    return this.http.post(`${this.baseUrl}/tasks.json`, json)
      .toPromise()
      .catch(this.errorHandler);
  }

  getTask(url: string, id:string) {
    let self = this;
    var taskRef = firebase.database().ref(`${url}/backlog/`).child(id);
    taskRef.off(); 

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {
            //console.log(snapshot.val());
            self.task = snapshot.val();

            if (self.task.name.length > 0) {
              console.log("task", self.task);
              resolve(true);
            }
            else reject("Couldn't get task data");
          }); 
      }
    );
  }

  getBackLogTask(id: string) {

      return this.http.get(`${this.baseUrl}/backlog/mSmxxvKkt4ei6nL80Krmt9R0m983/${id}.json`)
      .toPromise()
      .then(response => response.json())
      .catch(this.errorHandler);
  }

  removeBookmark(bookmark) {
    return this.http.delete(`${this.baseUrl}/tasks/${bookmark.id}.json`)
      .toPromise()
      .catch(this.errorHandler);
  }

  updateBookmark(bookmark) {
    const json = JSON.stringify({
      title: bookmark.title,
      url: bookmark.url
    });
    return this.http.patch(`${this.baseUrl}/tasks/${bookmark.id}.json`, json)
      .toPromise()
      .catch(this.errorHandler);
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
