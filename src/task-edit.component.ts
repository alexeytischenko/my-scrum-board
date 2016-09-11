import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from './task.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
// import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `{{diagnostic}}
    <div class="panel panel-primary">
    <form (ngSubmit)="onSave()" #editForm="ngForm">
      <div class="panel-body">
        <div style="float:right;">
            <a [routerLink]="['/tasks/'+ taskUrl]" class="btn btn-warning">
              <span class="glyphicon glyphicon-remove"></span>
              <span class="hidden-xs">Cancel</span>
            </a> 
            <button class="btn btn-primary" type="submit" [disabled]="!editForm.form.valid">
              <span class="glyphicon glyphicon-ok"></span>
              <span class="hidden-xs">Save</span>
              <!-- (click)="onSave()"-->
            </button>            
      
        </div>
        <div class="panel-body form-inline">               
                <input type="text" name="name" required [(ngModel)]="task.name" class="form-control input-sm" style="width:50%" #nameValidation="ngModel" /> 
                <button *ngIf="!newTask" class="btn btn-{{project.color}} btn-xs hidden-xs" disabled="true">{{project.sname}} - {{task.id}}</button>    
                <div class="alert alert-danger" style="width:50%" [hidden]="nameValidation.valid || nameValidation.pristine">Name is required</div>       
        </div>
        <div class="panel-body">
            <div class="form-inline">
              <label for="estimate">Estimate</label>
              <input type="number" id="estimate" name="estimate" style="width:60px;" class="form-control input-sm" [(ngModel)]="task.estimate" /> h / 0h
            </div>
            <div>
                <label for="project">Project</label>

                {{project.name}}
            </div> 
            <div class="form-group">
              <label for="status">Status</label>
              <div class="form-inline">
                <select name="status" id="status" [(ngModel)]="task.status" class="form-control input-sm" style="width:50%">
                  <option *ngFor="let status of taskStatuses" [value]="status">{{status}}</option>
                </select>
                <button class="btn btn-xs" 
                    [class.btn-primary]="task.status==='in progress'" 
                    [class.btn-success]="task.status==='resolved'" 
                    [class.btn-info]="task.status==='review'"
                    disabled="true">
                      {{task.status}}
                </button>
              </div>
            </div>  
        </div>      
        
        <div class="panel-body">
          <label for="description">Description</label> 
          <textarea name="description" id="description" class="form-control input-sm" [(ngModel)]="task.description" rows="4"></textarea>
        </div>

    </div>
  </form>  
  </div>
  `,
})
export class TaskEditComponent implements OnInit, OnDestroy {

  task;
  taskUrl;
  taskId;
  project : Project;
  newTask : boolean;
  taskStatuses : string[];
  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  @Output() clear = new EventEmitter();
  @Output() save = new EventEmitter();

  paramsSubscription: Subscription;

  constructor(private route : ActivatedRoute,
              private taskService : TaskService,
              private projectsService : ProjectsService) {

      this.taskService.errorHandler = error => {
        console.error('Task component error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      this.task = {};
      this.newTask = false;
      this.project = new Project();
      this.taskStatuses = this.taskService.taskSatuses;

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('projects already loaded');
      }
      else
        this.projectsService.loadProjects(this.userId);
  }

  onSave() {
    console.log("Submit fired");
    this.save.emit(this.task);
  }

  ngOnInit() {
    let self = this;

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        if (params['tasktId'] > 0) {
          progress_start ("");
          this.taskId = params['tasktId'];
          this.taskUrl = this.taskId;
          this.taskService.getTask("mSmxxvKkt4ei6nL80Krmt9R0m983", this.taskId)
          .then ( () => {
                this.task = this.taskService.task;
                this.project = this.projectsService.getProject(this.task.project);
                console.info("task loaded", this.task);
              }
          )
          .catch((error)=>console.error("Task component error:", error))
          .then (() => {
            //finally
            progress_end();
          });
        }
          else {
            this.newTask = true;
            this.taskUrl = "";
            this.task.estimate = 0;
            this.task.status = "idle";
          }
      }
    );

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();
    });
  }

  get diagnostic() {
    return JSON.stringify(this.task);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
