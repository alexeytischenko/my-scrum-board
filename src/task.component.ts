import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from './task.service';
import { CommentsListComponent } from './comments-list.component';
import { WorkLogComponent } from './work-log.component';
import { AttachmentsComponent } from './attachments.component';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `
  <div class="panel panel-default">
  <div class="panel-heading">
          <div class="pull-right">
            <a *ngIf = "parentTask.id && parentTask.id.length > 0" [routerLink]="['/tasks/'+ parentTask.id]" class="btn btn-default btn-sm">
                <span class="glyphicon glyphicon-link"></span>
                <span class="hidden-xs">Jump to parent</span>
            </a>
            <a [routerLink]="['/']" class="btn btn-default btn-sm">
              <span class="glyphicon glyphicon-chevron-left"></span>
              <span class="hidden-xs">Back</span>
            </a>
            <span class="dropdown">
              <button class="btn btn-default dropdown-toggle btn-sm" type="button" data-toggle="dropdown">...</button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li *ngIf="taskCurrentStatus=='idle'"><a href="javascript:void(0);" (click)="changeTaskStatus('in progress')">Start</a></li>
                <li *ngIf="taskCurrentStatus!='resolved'"><a href="javascript:void(0);" (click)="changeTaskStatus('resolved')">Resolve</a></li>
                <li *ngIf="taskCurrentStatus=='resolved'"><a href="javascript:void(0);" (click)="changeTaskStatus('in progress')">Reopen task</a></li>
                <li><a href="javascript:void(0);" onClick="$('#delModal').modal();">Delete task</a></li>
                
                <li class="divider"></li>
                <li><a href="javascript:void(0);" (click)="atc.setEditorField(-1)">Add attachment</a></li>
                <li><a href="javascript:void(0);" (click)="clc.setEditorField(-1)">Add comment</a></li>
                <li><a [routerLink]="['/tasks/edit/'+ taskId +'/-1']">Add subtask</a></li>
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
                <span class="label label-{{project.color}}">{{project.sname}} - {{task.code}}</span>          
        </div>
  </div>
    <div class="panel-body">

        <div *ngIf = "parentTask.id && parentTask.id.length > 0" class="panel pull-right panel-default panel-sm" style="max-width:50%">
          <div class="panel-body">
            <label>Parent task:</label>
            {{parentTask.name}}
          </div>
        </div> 

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
              <span class="label label-default" 
                  [class.label-primary]="task.status==='in progress'" 
                  [class.label-success]="task.status==='resolved'" 
                  [class.label-info]="task.status==='review'"
                  >
                    {{task.status}}
              </span>
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
          <div style="white-space: pre-line;">{{task.description}}</div>
        </div>

        <div class="panel-body">
          <div class="pull-right">
            <button class="btn btn-default" (click)="atc.setEditorField(-1)">
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
            <attachments *ngIf="task.attachments" (setAttachments) = "updateTaskAttachments($event)" [taskId]="taskId" [attachments]="task.attachments"></attachments>
          </div>
        </div>
        <div class="panel-body">
          <div class="pull-right">
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
                <div *ngIf="openComments" (click)="clc.loadComments(true)" class="glyphicon glyphicon-repeat" alt="reload" title="reload"></div>
            </span> 
            <p *ngIf="!task.commentsNum || task.commentsNum == 0" class="norecords">There are no comments</p>
            <comments (setCount) = "updateTaskCommentsCounts($event)" [openComments]="openComments" [taskId]="taskId"></comments>
          </div>       
      </div>
      <div class="panel-body" *ngIf="task.type != 'i'">
          <div class="pull-right">
            <a class="btn btn-default" [routerLink]="['/tasks/edit/'+ taskId +'/-1']">
              <span class="glyphicon glyphicon-list-alt"></span>
              <span class="hidden-xs">Add subtask</span>
            </a>
          </div>
          <div>
            <label>Subtasks</label> 
            <span *ngIf="task.subtasks && task.subtasks.length > 0" class="commentsToggle">
                ({{task.subtasks.length}}) 
            </span> 
            <p *ngIf="!task.subtasks || task.subtasks.length == 0" class="norecords">There are no subtasks</p>
            <ul>
              <li *ngFor = "let st of task.subtasks"><a [routerLink]="['/tasks/'+ st.id]">{{st.name}}</a> - {{st.estimate}}h</li>
            </ul>
          </div>       
      </div>
      <div class="panel-body">
          <div class="pull-right">
            <button class="btn btn-default" (click)="wlc.setEditorField(-1)">
              <span class="glyphicon glyphicon-time"></span>
              <span class="hidden-xs">Log work</span>
            </button>
          </div>
          <div>
            <label>Worklogs</label>
            <span *ngIf="task.worked > 0" class="commentsToggle">
                ({{task.worked}}h)
                <div (click)="toggleLogs()" [class]="openLog ? 'glyphicon glyphicon-menu-up' : 'glyphicon glyphicon-menu-down'"></div>
                <div *ngIf="openLog" (click)="wlc.loadRecords(true)" class="glyphicon glyphicon-repeat" alt="reload" title="reload"></div>
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
  parentTask;
  taskId;
  project : Project;
  taskStatuses : string[];
  openComments: boolean;
  openLog: boolean;
  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";

  @ViewChild(CommentsListComponent) private clc : CommentsListComponent;
  @ViewChild(WorkLogComponent) private wlc : WorkLogComponent;
  @ViewChild(AttachmentsComponent) private atc : AttachmentsComponent;

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
      this.parentTask = {};
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
                this.parentTask = {}; //have to place it here to reinit after 'jump to parent' clicked
                this.task = this.taskService.task;
                this.project = this.projectsService.getProject(this.task.project);

                //force open comments               
                if (this.taskService.ifOpenComments(this.taskId)) {
                  this.openComments = true;
                  this.clc.loadComments();
                }
                //force open logs               
                if (this.taskService.ifOpenLogs(this.taskId)) {
                  this.openLog = true;
                  this.wlc.loadRecords();
                }

                // load parent task info if ness
                if (this.task.type == "i" && this.task.parent && this.task.parent.length > 0) {
                  this.taskService.getAnyTask(this.userId, this.task.parent)
                  .then ( (parent) => {
                    this.parentTask = parent;
                  })
                  
                }
                console.info("task loaded", this.task);
              }
          )
         // .then (() => )
          .catch((error)=>this.taskService.errorHandler(error))
          .then (() => progress_end());
        }
      );
  }

  changeTaskStatus(status: string) : void {
    //task resolve from drop-down menu
    console.info ("TaskComponent:changeTaskStatus(status: string)", status);

    progress_start("red");
    this.task.status = status;
    this.task.updated = Date.now();
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> progress_end());
  }

  updateTaskAttachments (val : any) {
    // updates task attachments after attachment update
    console.info ("TaskComponent:updateTaskAttachments($event)", val);

    //update attachments array
    this.task.attachments = val;
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
        setTimeout(() => this.router.navigateByUrl('/tasks'), 1000); //document.location.href= "/tasks"
      });
  }

  toggleComments() {
    // open/close comments list 
    console.info ("TaskComponent:toggleComments()");

    this.openComments = (this.openComments) ? false : true;
    if (this.openComments) {
      this.taskService.addToOpenComments(this.taskId);
      this.clc.loadComments(true);
    }
    else this.taskService.removeFromOpenComments(this.taskId);
  }

  toggleLogs() {
    // open/close logs list 
    console.info ("TaskComponent:toggleLogs()");

    this.openLog = (this.openLog) ? false : true;
    if (this.openLog) {
      this.taskService.addToOpenLogs(this.taskId);
      this.wlc.loadRecords(true);
    }
    else this.taskService.removeFromOpenLogs(this.taskId);
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
