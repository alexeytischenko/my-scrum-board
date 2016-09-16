import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'newproject',
  template: `{{diagnostic}}
    <button *ngIf="!setNewProject" class="btn btn-default btn-sm" (click)="showNewProjectForm()">
        <span class="glyphicon glyphicon-plus"></span>
        New project
    </button>
    <div *ngIf="setNewProject" class="form-group new_project_form">
       <a href="javascript:void(0);" data-toggle="popover" title="Add new project" data-trigger="hover" data-content="To add new project type name, choose color and click Add button"><span class="glyphicon glyphicon-question-sign"></span></a>
       <input type="text" id="newproject" name="newproject" [(ngModel)]="newproject" class="form-control input-sm" placeholder="type new name here" />
       <select name="color" id="color" [(ngModel)]="newcolor" class="form-control input-sm">
           <option *ngFor="let color of colors" [value]="color | i18nSelect: colorsMap">{{color}}</option>
       </select> 
       <button class="btn btn-warning btn-sm" (click)="clear()">
           <span class="glyphicon glyphicon-remove"></span>
           <span class="hidden-xs">Close</span>
       </button>
       <button class="btn btn-primary btn-sm" [disabled]="newproject==''" (click)="addProject()">
           <span class="glyphicon glyphicon-ok"></span>
           <span class="hidden-xs">Add</span>
       </button>
    </div>
  `,
  styles : [`
    .new_project_form {float:right;}
  `]
})
export class NewProject implements OnInit {  

    newproject : string;
    newcolor : string;
    setNewProject : boolean;
    colors = ['white', 'orange', 'dark blue', 'blue', 'red', 'green'];
    colorsMap: any = {'white': 'default', 'orange': 'warning', 'dark blue': 'primary', 'blue': 'info', 'red': 'danger','green': 'success'};


    constructor() {
        this.clear();
    }

    addProject() {
        
    }

    showNewProjectForm() {
        this.setNewProject = true;
        setTimeout(() => $('[data-toggle="popover"]').popover(), 2000);
    }

    clear() {
        this.setNewProject = false;
        this.newproject = "";
        this.newcolor = "";
    }

    ngOnInit() {

    }

    get diagnostic() {
        return this.newcolor;
    }
}            