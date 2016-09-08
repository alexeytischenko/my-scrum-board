import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from './task.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
// import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-body">
        <div style="float:right;">
            <a [routerLink]="['/tasks/'+ taskId]" class="btn btn-warning">
              <span class="glyphicon glyphicon-remove"></span>
              <span class="hidden-xs">Cancel</span>
            </a> 
            <button  (click)="onSave()" class="btn btn-primary">
              <span class="glyphicon glyphicon-ok"></span>
              <span class="hidden-xs">Save</span>
            </button>            
            
        </div>
        <div class="panel-body form-inline">               
                <input type="text" ng-required="true" [value]="task.name" class="form-control input-sm" style="width:50%" /> 
                <button class="btn btn-{{project.color}} btn-xs hidden-xs" disabled="true">{{project.sname}} - {{task.id}}</button>           
        </div>
        <div class="panel-body">
            <div class="form-inline">
              <label>Estimate</label>
              <input type="number" style="width:60px;" class="form-control input-sm" [value]="task.estimate" /> h / 0h
            </div>
            <div>
                <label>Project</label>
                {{project.name}}
            </div> 
            <div>
              <label>Status</label>

              <button class="btn btn-xs" 
                  [class.btn-primary]="task.status==='in progress'" 
                  [class.btn-success]="task.status==='resolved'" 
                  disabled="true">
                    {{task.status}}
              </button>
            </div>  
        </div>      
        
        <div class="panel-body">
          <label>Description</label> 
          <textarea class="form-control input-sm" [value]="task.description" rows="4"></textarea>
        </div>




      <!--div class="panel-body">
        <input type="text" [(ngModel)]="bookmark.title"
          placeholder="Title" style="width: 25%;">
        <input type="text" [(ngModel)]="bookmark.url" 
          placeholder="URL" style="width: 50%;">
        <button (click)="onSave()" class="btn btn-primary">
          <span class="glyphicon glyphicon-ok"></span>
          <span class="hidden-xs">Save</span>
        </button>
        <button (click)="onClear()" class="btn btn-warning">
          <span class="glyphicon glyphicon-remove"></span>
          <span class="hidden-xs">Clear</span>
        </button>
      </div-->
    </div>
  `,
})
export class TaskEditComponent implements OnInit, OnDestroy {

  task;
  taskId;
  project : Project;
  editorMode : boolean;
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
      this.project = new Project();
      this.editorMode = false;
      this.taskStatuses = this.taskService.taskSatuses;

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('projects already loaded');
      }
      else
        this.projectsService.loadProjects(this.userId);
  }


  onClear() {
    this.clear.emit(null);
  }

  onSave() {
    this.save.emit(this.task);
  }

  onEdit() {
    this.editorMode = true;
  }

  ngOnInit() {
    let self = this;

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        progress_start ("");
        this.taskId = params['tasktId'];
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
    );

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover();
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
