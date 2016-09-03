import { Injectable } from '@angular/core';

@Injectable()
export class ProjectsService {
   
  projects = [];
  errorHandler = error => console.error('ProjectsService error', error);
  
  constructor() {}

  loadProjects(url) {
    let self = this;
    var projectsRef = firebase.database().ref(`${url}/projects/`);
    projectsRef.off(); 

    return new Promise(function(resolve, reject) {
          projectsRef.once('value', function(snapshot) {
            self.projects = self.convert(snapshot.val());
            console.log("projects", self.projects);
            resolve(true);
          }); 
      }
    );
  }

  // loadProjects(url) {
  //   var projectsRef = firebase.database().ref(`${url}/projects/`);
  //   projectsRef.off();
  //   projectsRef.on('value', snapshot => this.projects = this.convert(snapshot.val())); 
  // }

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
