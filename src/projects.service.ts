import { Injectable } from '@angular/core';
import { Project } from './project.class';

@Injectable()
export class ProjectsService {
   
  projects = [];
  colors = ['white', 'orange', 'dark blue', 'blue', 'red', 'green'];
  colorsMap: any = {'white': 'default', 'orange': 'warning', 'dark blue': 'primary', 'blue': 'info', 'red': 'danger','green': 'success'};
  
  errorHandler = error => console.error('ProjectsService error', error);
  
  constructor() {
    console.info ("ProjectsService:constructor");
  }

  loadProjects(url) {
    console.info ("ProjectsService:loadProjects(url)", url);

    let self = this;
    var projectsRef = firebase.database().ref(`${url}/projects/`);
    projectsRef.off(); 

    return new Promise(function(resolve, reject) {
          projectsRef.once('value', function(snapshot) {
            self.projects = self.convert(snapshot.val());

            if (self.projects.length > 0) {
              resolve(true);
            }
            else reject("Couldn't retrive projects list");
          }); 
      }
    );
  }

  getProject(project : string) : Project {
    console.info ("ProjectsService:getProject(project)", project);

    let projectData = new Project();
    this.projects.forEach(element => {
        if (element.id == project)  projectData.fill(element.name, element.sname, element.color, element.id);
    });

    return projectData;
  }

  addProject(url: string, newProject : Project) {
    console.info ("ProjectsService:addProject(url: string, newProject : Project)", url, newProject);
    
    let self = this;
    let projectsRef = firebase.database().ref(`${url}/projects/`);

    let postData = {
      name: newProject.name,
      sname: newProject.sname,
      color: newProject.color
    };

    return new Promise(function(resolve, reject) {
      let newprojectsRef = projectsRef.push();
      newprojectsRef.set(postData, function(error) {
      if (error) {
        console.log('Synchronization failed');
        reject(error);
      } else {
          self.projects.push({
            name: newProject.name,
            sname: newProject.sname,
            color: newProject.color,
            id: newprojectsRef.key.toString()
          });

          resolve(newprojectsRef.key.toString());
      }
      }); 
    });

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
}
