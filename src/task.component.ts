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
            <a [routerLink]="['/']" class="btn btn-default">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <span class="hidden-xs">Back</span>
            </a>
            <span class="dropdown">
              <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">...</button>
              <ul class="dropdown-menu">
                <li><a href="#">Resolve / Reopen task</a></li>
                <li><a href="#">Move task to archive</a></li>
                <li><a href="#">Delete task</a></li>
                <li class="divider"></li>
                <li><a href="#">Add comment</a></li>
                <li><a href="#">Add attachment</a></li>
                <li><a href="#">Log work</a></li>
              </ul>
            </span>
            <a [routerLink]="['/tasks/edit/'+ taskId]" class="btn btn-default">
              <span class="glyphicon glyphicon-pencil"></span>
              <span class="hidden-xs">Edit</span>
            </a>      
            <a href="javascript:void(0);" data-toggle="popover" title="Help" data-trigger="hover" data-content="To edit the task click the Edit button"><span class="glyphicon glyphicon-question-sign"></span></a>
        </div>
        <div class="panel-body form-inline">               
                <label>{{task.name}}</label> 
                <button class="btn btn-{{project.color}} btn-xs hidden-xs" disabled="true">{{project.sname}} - {{task.code}}</button>           
        </div>
        <div class="panel-body">
            <div>
              <label>Estimate</label>
              <span>{{task.estimate}}</span> h / 0h
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
                  [class.btn-info]="task.status==='review'" 
                  disabled="true">
                    {{task.status}}
              </button>
            </div>  
        </div>      
        <div class="panel-body">         
          <div>
            <label>Created</label>
            {{task.created | date:'medium'}}
          </div>
          <div>
            <label>Modified</label>
            {{task.updated | date:'medium'}}
          </div>
        </div>
        
        <div class="panel-body">
          <label>Description</label> 
          <span>{{task.description}}</span>
        </div>

        <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default">
              <span class="glyphicon glyphicon-file"></span>
              <span class="hidden-xs">Add files</span>
            </button>
          </div>
          <div>
            <label>Attachments</label>
            <p class="norecords">There are no attachments</p>
          </div>
        </div>
        <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default">
              <span class="glyphicon glyphicon-comment"></span>
              <span class="hidden-xs">Add comment</span>
            </button>
          </div>
          <div>
            <label>Comments</label>
            <p class="norecords">There are no comments</p>
          </div>       
      </div>
      <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default">
              <span class="glyphicon glyphicon-time"></span>
              <span class="hidden-xs">Log work</span>
            </button>
          </div>
          <div>
            <label>Worklogs</label>
            <p class="norecords">There are no worklogs</p>
          </div>       
      </div>

    </div>
  `,
  styles : [`
    .norecords {color: #999; font-style: italic}
    .dropdown {padding-bottom: 10px;}
  `]
})
export class TaskComponent implements OnInit, OnDestroy {

  task;
  taskId;
  project : Project;
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
      this.taskStatuses = this.taskService.taskSatuses;

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('projects already loaded');
      }
      else
        this.projectsService.loadProjects(this.userId);
  }

  get diagnostic() {
    return JSON.stringify(this.task);
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
        .catch((error)=>this.taskService.errorHandler(error))
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
