import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'editproject',
  template: `
  <div class="panel panel-primary">
    <button *ngIf="!editProject" class="btn btn-default" (click)="showNewProjectForm()">
        <span class="glyphicon glyphicon-plus"></span>
        New project
    </button>
    <div *ngIf="editProject" class="form-inline">
       <a href="javascript:void(0);" style="float:right;" data-toggle="popover" title="Add new project" data-trigger="hover" data-content="To add new project type name, choose color and click Add button"><span class="glyphicon glyphicon-question-sign"></span></a>
       <input type="text" id="newproject" name="newproject" [(ngModel)]="projectToEdit.name" class="form-control" placeholder="type name here" />
       <input type="text" id="newsname" name="newsname" [(ngModel)]="projectToEdit.sname" class="form-control" placeholder="type short name here" />
       <select name="color" id="color" [(ngModel)]="projectToEdit.color" class="form-control">
           <option *ngFor="let color of colors" [value]="color | i18nSelect: colorsMap">{{color}}</option>
       </select> 
       <button class="btn btn-default" (click)="clear()">
           <span class="glyphicon glyphicon-remove"></span>
           <span class="hidden-xs">Close</span>
       </button>
       <button class="btn btn-primary" [disabled]="newproject==''" (click)="addProject()">
           <span class="glyphicon glyphicon-ok"></span>
           <span class="hidden-xs">Add</span>
       </button>
    </div>
  </div>  
  `,
  styles : [`   
    .panel {padding:20px;}
  `]
})
export class EditProject implements OnInit {  

    editProject : boolean;
    @Input() project : Project;
    @Output() save = new EventEmitter();

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

    addProject() {
        //creating new Project object
        let projectToAdd = new Project();
        //projectToAdd.newProject(this.newproject, this.newcolor == '' ? 'default' : this.newcolor);
        
        //add new Project 
        progress_start("red");
        this.projectsService.addProject(this.userId, projectToAdd)
            .catch((error)=>this.projectsService.errorHandler(error))
            .then((newId)=> {    
                //finally / default    
                //clean newProject form, emit output event with new node ID, close progressbar
                this.clear();
                this.save.emit(newId);
                progress_end();
            });
        return false;
    }

    showNewProjectForm() {
        this.clear();
        this.editProject = true;
        setTimeout(() => $('[data-toggle="popover"]').popover(), 1000);
    }

    clear() {
        //clearing new project form
        this.editProject = false;
        this.project = new Project();
    }

    ngOnInit() {
    }

    get projectToEdit() {
        console.log("project request");
        return this.project;
    }
}            