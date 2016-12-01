import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from './task.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
// import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `
  <form (ngSubmit)="saveTask()" #editForm="ngForm" novalidate>
  <div class="panel panel-default">
      <div class="panel-heading">
          <label>{{taskLabel}}</label> 
          <div style="float:right;">
              <a [routerLink]="['/tasks/'+ taskUrl]" class="btn btn-warning btn-sm">
                <span class="glyphicon glyphicon-remove"></span>
                <span class="hidden-xs">Cancel</span>
              </a> 
              <button class="btn btn-primary btn-sm" type="submit" [disabled]="!editForm.form.valid">
                <span class="glyphicon glyphicon-ok"></span>
                <span class="hidden-xs">Save</span>
              </button>            
          </div>
      </div>
      <div class="panel-body">

        <div class="form-group w50">   
           <label for="name">Title</label>            
            <input type="text" id="name" name="name" required [(ngModel)]="task.name" class="form-control" #nameValidation="ngModel" />  
            <div class="alert alert-danger" [hidden]="nameValidation.valid || nameValidation.pristine">Name is required</div>       
        </div>

        <div class="form-group">
          <label for="estimate">Estimate</label>
          <div class="input-group" style="width:125px;">
            <input type="number" id="estimate" name="estimate" class="form-control" [(ngModel)]="task.estimate" />
            <div class="input-group-addon">h / 0h</div>
          </div>
        </div>

        <div class="form-group">
            <label for="project">Project</label>
            <div class="form-inline">
              <select name="project" id="project" required [(ngModel)]="task.project" class="form-control input-sm w50" #projectValidation="ngModel">
                <option *ngFor="let pr of projects" [value]="pr.id">{{pr.name}}</option>
              </select>
              <newproject (save)="updateProjectsSelect($event)"></newproject>              
            </div>
            <div class="alert alert-danger w50" [hidden]="projectValidation.valid || projectValidation.untouched">Project is required</div> 
        </div> 

        <div class="form-group w50">
            <label for="status">Status</label>
            <select name="status" id="status" [(ngModel)]="task.status" class="form-control input-sm">
              <option *ngFor="let status of taskStatuses" [value]="status">{{status}}</option>
            </select> 
        </div>    
        
        <div class="form-group">
          <label for="description">Description</label> 
          <textarea name="description" id="description" class="form-control input-sm" [(ngModel)]="task.description" rows="4"></textarea>
        </div>

    </div>
</div>
</form>  
  `,
  styles : [`
    .ng-valid[required], .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
    .ng-invalid:not(form)  {border-left: 5px solid #a94442; /* red */}
  `]
})
export class TaskEditComponent implements OnInit, OnDestroy {

  task;
  taskUrl;
  taskId;
  //project : Project;
  projects;
  taskStatuses : string[];
  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";


  paramsSubscription: Subscription;

  constructor(private route : ActivatedRoute,
              private taskService : TaskService,
              private projectsService : ProjectsService,
              private router: Router) {

      this.taskService.errorHandler = error => {
        console.error('Task component error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      this.task = {};
      this.projects = [];
      //this.project = new Project();
      this.taskStatuses = this.taskService.taskSatuses;

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('projects already loaded');
        this.projects = this.projectsService.projects;
      }
      else
        this.projectsService.loadProjects(this.userId)
          .then ( () => this.projects = this.projectsService.projects);
  }

  get taskLabel() : string {
    return this.task.name ? this.task.name : 'Creating new task...'; 
  }

  updateProjectsSelect(newId) {
      this.task.project = newId;
  }

  saveTask() {
    progress_start("red");
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then((newurl)=> {    
        //finally / default  
        if (this.taskUrl == ""){
          this.taskUrl = newurl;
          this.taskId = newurl;
        }

        progress_end();
        setTimeout(() => this.router.navigateByUrl('/tasks/'+ this.taskUrl), 1000);
      });
  }


  ngOnInit() {
    let self = this;

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        if (params['tasktId'] == -1) {
          this.taskUrl = "";
          //Task defasult values
          this.task.estimate = 0;
          this.task.status = "idle";
          this.task.id = -1;
        }
        else {
          progress_start ("");
          this.taskId = params['tasktId'];
          this.taskUrl = this.taskId;
          this.taskService.getTask("mSmxxvKkt4ei6nL80Krmt9R0m983", this.taskId)
          .then ( () => {
                this.task = this.taskService.task;
                //this.project = this.projectsService.getProject(this.task.project);
                console.info("task loaded", this.task);
              }
          )
          .catch((error)=>this.taskService.errorHandler(error))
          .then (() => {
            //finally
            progress_end();
          });
        }
      }
    );

    // $(document).ready(function(){
    //     $('[data-toggle="popover"]').popover();
    // });
  }

  get diagnostic() {
    return JSON.stringify(this.projects);
  }


  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
