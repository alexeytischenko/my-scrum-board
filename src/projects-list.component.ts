import { Component } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'project-list',
  template: `
    <section>
      <div class="row">
          <editproject [project]="projectToEdit" (save)="updateProjectsSelect($event)"></editproject>
          <ul class="list-group list-group-sortable" id="projects">
              <li class="list-group-item disabled">Projects</li>
              <template ngFor let-prElement [ngForOf]="projects">
                <li class="list-group-item" id="{{prElement.id}}">
                  <button class="btn btn-link" (click)="edit(prElement)">{{prElement.name}}</button>
                  <span class="label label-{{prElement.color}}">{{prElement.sname}}</span> 
                </li>
              </template>
          </ul>
      </div>
    </section>
  `,
  styles : [`
    .list-group-item:hover {background: #e9e9e9;}
  `]
})
export class ProjectsListComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  listLength : number;
  projects = [];
  projectToEdit : Project = new Project();

  constructor(private projectsService :ProjectsService) {

    this.projectsService.errorHandler = error => {
      console.error('ProjectsList Component component (ProjectsService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }

    //load projects into property of the ProjectsService then loads list of tasks into tasksListService tasks property 
    progress_start("");
    this.projectsService.loadProjects(this.userId)
      .then ( () => this.projects = this.projectsService.projects)
      .catch((error)=>this.projectsService.errorHandler(error))
      .then(()=> {    
        //finally / default     
        progress_end();
      });
  }

  edit(project) {
      console.log ("edit fired", project);
      this.projectToEdit.fill (project.name, project.sname, project.color, project.id);
      console.log ("projectToEdit", this.projectToEdit);
  }
}
