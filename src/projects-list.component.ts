import { Component } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
import { EditProject } from './edit-project.component';


@Component({
  selector: 'project-list',
  template: `
    <section>
      <div>
          <editproject></editproject>
          <ul class="list-group" id="projects">
              <li class="list-group-item disabled">Projects</li>
              <template ngFor let-prElement [ngForOf]="projects">
                <li class="list-group-item" id="{{prElement.id}}">
                  <button class="btn btn-link" (click)="epc.editProject(prElement)">{{prElement.name}}</button>
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
  projects = [];
  //projectToEdit : Project = new Project();
  @ViewChild(EditProject) private epc : EditProject;

  constructor(private projectsService :ProjectsService) {

    this.projectsService.errorHandler = error => {
      console.error('ProjectsList Component component (ProjectsService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }
    this.getList();

  }

  private getList() {
    //load projects into property of the ProjectsService then loads list of tasks into tasksListService tasks property 
    console.info("ProjectsListComponent:getList()");
    progress_start("");
    this.projectsService.loadProjects(this.userId)
      .then ( () => this.projects = this.projectsService.projects)
      .catch((error)=>this.projectsService.errorHandler(error))
      .then(()=> {    
        //finally / default     
        progress_end();
      });

  }

  // edit(project) {
  //     console.log ("edit fired", project);
  //     this.projectToEdit.fill (project.name, project.sname, project.color, project.id);
  // }


}
