import { Injectable } from '@angular/core';
import { Project } from './project.class';

@Injectable()
export class ProjectsService {
   
  projects = [];
  colors = ['grey', 'orange', 'dark blue', 'blue', 'red', 'green'];
  colorsMap: any = {'grey': 'default', 'orange': 'warning', 'dark blue': 'primary', 'blue': 'info', 'red': 'danger','green': 'success'};
  
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
    //console.info ("ProjectsService:getProject(project)", project)  -- too many logs in console

    let projectData = new Project();
    this.projects.forEach(element => {
        if (element.id == project)  projectData.fill(element.name, element.sname, element.color, element.id);
    });

    return projectData;
  }

  saveProject(url: string, project : Project) {
    console.info ("ProjectsService:saveProject(url: string, project : Project)", url, project);
    
    let self = this;
    let projectsRef = firebase.database().ref(`${url}/projects/`);

    // generate sname if missing
    if(project.sname.length == 0) project.sname = project.generateShortName(project.name);
    if(project.color.length == 0) project.color = this.colorsMap.white;
    // data to post
    let postData = {
      name: project.name,
      sname: project.sname,
      color: project.color
    };

    if (project.id.length > 0) {

      return new Promise(function(resolve, reject) {
        
        projectsRef.child(project.id).update(postData, function(error) {
          if (error) {
            console.log('Synchronization failed');
            reject(error);
          } else {
              for (let i = 0; i < self.projects.length; i++) {
                if (self.projects[i].id == project.id) {
                    self.projects[i].name = project.name;
                    self.projects[i].sname = project.sname;
                    self.projects[i].color = project.color;

                }
              }
              resolve(project.id);
          }
        }); 
      });

    } else {

      return new Promise(function(resolve, reject) {
        let newprojectsRef = projectsRef.push();
        newprojectsRef.set(postData, function(error) {
        if (error) {
          console.log('Synchronization failed');
          reject(error);
        } else {
            self.projects.push({
              name: project.name,
              sname: project.sname,
              color: project.color,
              id: newprojectsRef.key.toString()
            });

            resolve(newprojectsRef.key.toString());
        }
        }); 
      });
    }

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
