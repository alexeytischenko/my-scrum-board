import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from './task.service';
import { CommentsListComponent } from './comments-list.component';
import { WorkLogComponent } from './work-log.component';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
// import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `
  <div class="panel panel-default">
  <div class="panel-heading">
          <div style="float:right;">
            <a [routerLink]="['/']" class="btn btn-default btn-sm">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <span class="hidden-xs">Back</span>
            </a>
            <span class="dropdown">
              <button class="btn btn-default dropdown-toggle btn-sm" type="button" data-toggle="dropdown">...</button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li *ngIf="taskCurrentStatus!='resolved'"><a href="javascript:void(0);" (click)="resolveTask()">Resolve</a></li>
                <li *ngIf="taskCurrentStatus=='resolved'"><a href="javascript:void(0);" (click)="reopenTask()">Reopen task</a></li>
                <li><a href="javascript:void(0);" onClick="$('#delModal').modal();">Delete task</a></li>
                <li class="divider"></li>
                <li><a href="javascript:void(0);" (click)="clc.setEditorField(-1)">Add comment</a></li>
                <li><a href="javascript:void(0);">Add attachment</a></li>
                <li><a href="javascript:void(0);" (click)="wlc.setEditorField(-1)">Log work</a></li>
              </ul>
            </span>
            <a [routerLink]="['/tasks/edit/'+ taskId]" class="btn btn-default btn-sm">
              <span class="glyphicon glyphicon-pencil"></span>
              <span class="hidden-xs">Edit</span>
            </a>      
        </div>
        <div class="form-inline">               
                <label>{{task.name}}</label> 
                <button class="btn btn-{{project.color}} btn-xs hidden-xs" disabled="true">{{project.sname}} - {{task.code}}</button>           
        </div>
  </div>
    <div class="panel-body">

        <div class="panel-body">
            <div>
              <label>Estimate</label>
              <span>{{task.estimate ? task.estimate : '0'}}</span>h / worked: {{task.worked ? task.worked : '0'}}h
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
              <span class="hidden-xs">Add file</span>
            </button>
          </div>
          <div>
            <label>Attachments</label>
            <span *ngIf="task.attachments && task.attachments.length > 0" class="commentsToggle">
                ({{task.attachments.length}}) 
            </span> 
            <p *ngIf="!task.attachments || task.attachments.length == 0" class="norecords">There are no attachments</p>
            <attachments (setCount) = "updateTaskAttachmentCounts($event)" [taskId]="taskId"></attachments>
          </div>
        </div>
        <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default" (click)="clc.setEditorField(-1)">
              <span class="glyphicon glyphicon-comment"></span>
              <span class="hidden-xs">Add comment</span>
            </button>
          </div>
          <div>
            <label>Comments</label> 
            <span *ngIf="task.commentsNum > 0" class="commentsToggle">
                ({{task.commentsNum}}) 
                <div (click)="toggleComments()" [class]="openComments ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'"></div>
                <div *ngIf="openComments" (click)="clc.loadComments()" class="glyphicon glyphicon-repeat" alt="reload" title="reload"></div>
            </span> 
            <p *ngIf="!task.commentsNum || task.commentsNum == 0" class="norecords">There are no comments</p>
            <comments (setCount) = "updateTaskCommentsCounts($event)" [openComments]="openComments" [taskId]="taskId"></comments>
          </div>       
      </div>
      <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default" (click)="wlc.setEditorField(-1)">
              <span class="glyphicon glyphicon-time"></span>
              <span class="hidden-xs">Log work</span>
            </button>
          </div>
          <div>
            <label>Worklogs</label>
            <span *ngIf="task.worked > 0" class="commentsToggle">
                <div (click)="toggleLogs()" [class]="openLog ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'"></div>
                <div *ngIf="openLog" (click)="wlc.loadRecords()" class="glyphicon glyphicon-repeat" alt="reload" title="reload"></div>
            </span> 
            <p *ngIf="!task.worked || task.worked == 0" class="norecords">There are no worklogs</p>
            <worklog (setCount) = "updateTaskLogsCounts($event)" [openLog]="openLog" [taskId]="taskId"></worklog>
          </div>       
      </div>
  
    </div>
</div>

  <!-- Modal Delete Popup -->
  <div class="modal fade" id="delModal" role="dialog">
    <div class="modal-dialog modal-sm">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="padding:25px 50px;">
          <h4 style="text-align: center;"><span class="glyphicon glyphicon-fire"></span> Delete the task?</h4>
        </div>
        <div class="modal-body" style="padding:40px 50px;">
              <button class="btn btn-danger btn-block" (click)="deleteTask()"><span class="glyphicon glyphicon-trash"></span> Delete</button>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
        </div>
      </div>
      
    </div>
  </div> 

  `,
  styles : [`
    .norecords {color: #999; font-style: italic}
    .dropdown {padding-bottom: 10px;}
    .modal-dialog {margin: 100px auto!important;}
    .commentsToggle div {cursor: pointer; color: #999;}
    .commentsToggle div:first-child {margin-left: 10px;}
  `]
})
export class TaskComponent implements OnInit, OnDestroy {

  task;
  taskId;
  project : Project;
  taskStatuses : string[];
  openComments: boolean;
  openLog: boolean;
  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";

  @ViewChild(CommentsListComponent) private clc : CommentsListComponent;
  @ViewChild(WorkLogComponent) private wlc : WorkLogComponent;

  paramsSubscription: Subscription;

  constructor(private route : ActivatedRoute,
              private taskService : TaskService,
              private projectsService : ProjectsService,
              private router: Router) {
      
      // loads task data
      console.info ("TaskComponent:constructor");

      this.taskService.errorHandler = error => {
        console.error('Task component error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      this.task = {};
      this.project = new Project();
      this.taskStatuses = this.taskService.taskSatuses;
      this.openComments = false;
      this.openLog = false;

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('TaskComponent->projectsService -- projects already loaded');
      }
      else
        this.projectsService.loadProjects(this.userId);

      this.paramsSubscription = this.route.params.subscribe(
        params => {
          progress_start ("");
          this.taskId = params['tasktId'];
          this.taskService.getTask(this.userId, this.taskId)
          .then ( () => {
                this.task = this.taskService.task;
                this.project = this.projectsService.getProject(this.task.project);
                console.info("task loaded", this.task);
              }
          )
          .catch((error)=>this.taskService.errorHandler(error))
          .then (() => progress_end());
        }
      );
  }

  resolveTask() : void {
    //task resolve from drop-down menu
    console.info ("TaskComponent:resolveTask()");

    progress_start("red");
    this.task.status = 'resolved';
    this.task.updated = Date.now();
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> progress_end());
  }
  
  reopenTask() : void {
    //task reopen from drop-down menu
    console.info ("TaskComponent:reopenTask()");

    progress_start("red");
    this.task.status = 'in progress';
    this.task.updated = Date.now();
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> progress_end());
  }

  updateTaskCommentsCounts (val : number) {
    // updates comments count if ness
    console.info ("TaskComponent:updateTaskCommentsCounts($event)", val);

    if (this.task.commentsNum == val) return false;  // no need to update

    this.task.commentsNum = val;
    this.taskService.savePropery(this.userId, this.task.id, {"commentsNum" : val}) 
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> {    
        this.openComments = true; //open comments list  
      });
  }

  updateTaskLogsCounts (val : number) {
    // updates recoreds count if ness
    console.info ("TaskComponent:updateTaskLogsCounts($event)", val);

    if (this.task.worked == val) return false;  // no need to update

    this.task.worked = val;
    this.taskService.savePropery(this.userId, this.task.id, {"worked" : val}) 
      .catch((error) => this.taskService.errorHandler(error))
      .then(() => {    
        this.openLog = true; //open worklog list  
      });
  }

  deleteTask() {
    //delete task from drop-down menu
    console.info ("TaskComponent:deleteTask()");

    $('#delModal').modal("hide");   //dismiss alert window
    progress_start("red");          //start red progress

    this.taskService.removeTask(this.userId, this.task.id)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> {    
        progress_end();
        setTimeout(() => document.location.href= "/tasks", 1000);
      });
  }

  toggleComments() {
    // open/close comments list 
    console.info ("TaskComponent:toggleComments()");

    this.openComments = (this.openComments) ? false : true;
    if (this.openComments) {
      this.clc.loadComments();
    }
  }

  toggleLogs() {
    // open/close logs list 
    console.info ("TaskComponent:toggleLogs()");

    this.openLog = (this.openLog) ? false : true;
    if (this.openLog) {
      this.wlc.loadRecords();
    }
  }

  // get diagnostic() {
  //   return JSON.stringify(this.task);
  // }

  get taskCurrentStatus() : string {
    return this.task.status ? this.task.status : '';
  }

  ngOnInit() {
    console.info ("TaskComponent:ngOnInit");
  }

  ngOnDestroy() {
    console.info ("TaskComponent:ngOnDestroy()");

    this.paramsSubscription.unsubscribe();
  }

}
