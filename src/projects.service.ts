import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ProjectsService {
   
  projects = [];

  errorHandler = error => console.error('ProjectsService error', error);
 // private baseUrl = 'https://a2-test-39d02.firebaseio.com';
  private baseUrl = 'https://myscrum-f606c.firebaseio.com';
  
  constructor(private http: Http) {
      this.loadProjects("mSmxxvKkt4ei6nL80Krmt9R0m983");
   }

  loadProjects(url) {
    var projectsRef = firebase.database().ref(`${url}/projects/`);
    projectsRef.off();
    projectsRef.on('value', snapshot => this.projects = this.convert(snapshot.val())); 
  }

  convert(objectedResponse) {
    return Object.keys(objectedResponse)
      .map(id => ({
        id : id,
        name: objectedResponse[id].name,
        sname: objectedResponse[id].sname,
        color: objectedResponse[id].color
      }));
  }

  getColor(project : string) {
      let color;
      this.projects.forEach(element => {
            if (element.id == project)  color = element.color; 
      });
      return color;
  }
  getSName(project : string) {
      let sname = "";
      console.log("pr", project);
      this.projects.forEach(element => {
          if (element.id == project)  sname = element.sname; 
          else console.log("n", element);
      });
      return sname;
  }
}
