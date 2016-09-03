import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Task } from './task.class';

@Injectable()
export class TaskService {

  errorHandler = error => console.error('TaskService error', error);
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';

  tasks = [];
  sprintLength : number = 0;
  backLogLength : number = 0;
  
  constructor(private http: Http) {
  }

  addBookmark(bookmark) {
    const json = JSON.stringify(bookmark);
    return this.http.post(`${this.baseUrl}/tasks.json`, json)
      .toPromise()
      .catch(this.errorHandler);
  }


  getBackLogTask(id: string) {
      //var articleRef = ref.child('blogposts').child(id);
      return this.http.get(`${this.baseUrl}/backlog/mSmxxvKkt4ei6nL80Krmt9R0m983/${id}.json`)
      .toPromise()
      .then(response => this.convert(response.json()))
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

  private convert(parsedResponse) {
    return Object.keys(parsedResponse)
      .map(id => ({
        id : id,
        name: parsedResponse[id].name,
        project: parsedResponse[id].project,
        sortnum: parsedResponse[id].sortnum,
        estimate: parsedResponse[id].estimate
      }));
     // .sort((a, b) => a.name.localeCompare(b.name));
  }

}
