import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'editproject',
  template: `
  <div class="projecteditForm">
    <button *ngIf="!showForm" class="btn btn-default btn-sm" (click)="newProject()">
        <span class="glyphicon glyphicon-plus"></span>
        New project
    </button>
    <div *ngIf="showForm" class="form-inline">
       <input type="text" id="newproject" name="newproject" [(ngModel)]="prj.name" class="form-control" placeholder="type name here" />
       <input type="text" id="newsname" name="newsname" [(ngModel)]="prj.sname" class="form-control" placeholder="type short name here" />
       <select name="color" id="color" [(ngModel)]="prj.color" class="form-control">
           <option *ngFor="let color of colors" [value]="color | i18nSelect: colorsMap">{{color}}</option>
       </select> 
       <button class="btn btn-warning" (click)="clear()">
           <span class="glyphicon glyphicon-remove"></span>
           <span class="hidden-xs">Close</span>
       </button>
       <button class="btn btn-primary" [disabled]="newproject==''" (click)="saveProject()">
           <span class="glyphicon glyphicon-ok"></span>
           <span class="hidden-xs">Save</span>
       </button>
    </div>
  </div>
  `,
  styles : [` 
  .projecteditForm {height:40px;}  
  `]
})
export class EditProject {  

    prj : Project;
    showForm: boolean = false;

    userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
    colors = [];
    colorsMap: any;


    constructor(private projectsService: ProjectsService) {
        this.clear();
        this.projectsService.errorHandler = error => {
            window.alert('Could not create a new project.');
        }
        this.colors = this.projectsService.colors;
        this.colorsMap = this.projectsService.colorsMap;
    }

    saveProject() {
        //save project

        progress_start("red");
        this.projectsService.saveProject(this.userId, this.prj)
            .catch((error)=>this.projectsService.errorHandler(error))
            .then((newId)=> {    
                this.clear();
                progress_end();
            });
        return false;
    }

    editProject(project) {
        this.showForm = true;
        this.prj.fill(project.name, project.sname, project.color, project.id);
    }

    newProject() {
        this.showForm = true;
        this.prj = new Project();
    }

    clear() {
        //clearing new project form
        this.showForm = false;
        this.prj = new Project();
    }

}            