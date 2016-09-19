import { Injectable } from '@angular/core';
import { Project } from './project.class';

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

            if (self.projects.length > 0) {
              console.log("projects", self.projects);
              resolve(true);
            }
            else reject("Couldn't retrive projects list");
          }); 
      }
    );
  }

  getProject(project : string) : Project {

    let projectData = new Project();
    this.projects.forEach(element => {
        if (element.id == project)  projectData.fill(element.name, element.sname, element.color, element.id);
    });

    return projectData;
  }

  addProject(url: string, newProject : Project) {
    let self = this;
    var projectsRef = firebase.database().ref(`${url}/projects/`);
    projectsRef.off();  

    let postData = {
      name: newProject.name,
      sname: newProject.sname,
      color: newProject.color
    };

    console.log("project add data", postData);

/////////////////// ассинхорнно получить new key до или после основного insert
    return new Promise(function(resolve, reject) {
            // // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('posts').push().key;
        taskRef.update(postData, function(snapshot) {
            console.log(snapshot);
            resolve(true);
          }); 
      }
    );

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
