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
                <li><a href="javascript:void(0);">Add comment</a></li>
                <li><a href="javascript:void(0);">Add attachment</a></li>
                <li><a href="javascript:void(0);">Log work</a></li>
              </ul>
            </span>
            <a [routerLink]="['/tasks/edit/'+ taskId]" class="btn btn-default btn-sm">
              <span class="glyphicon glyphicon-pencil"></span>
              <span class="hidden-xs">Edit</span>
            </a>      
            <!--a href="javascript:void(0);" data-toggle="popover" title="Help" data-trigger="hover" data-content="To edit the task click the Edit button"><span class="glyphicon glyphicon-question-sign"></span></a-->
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
              <span>{{task.estimate ? task.estimate : '0'}}</span>h / 0h
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
</div>

  <!-- Modal Delete Popup -->
  <div class="modal fade" id="delModal" role="dialog">
    <div class="modal-dialog modal-sm">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header" style="padding:35px 50px;">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4><span class="glyphicon glyphicon-fire"></span> Delete the task?</h4>
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
              private projectsService : ProjectsService,
              private router: Router) {

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

  get taskCurrentStatus() : string {
    return this.task.status ? this.task.status : '';
  }

  ngOnInit() {

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


    // $(document).ready(function(){
    //     $('[data-toggle="popover"]').popover();
    // });
  }

  resolveTask() : void {
    //task resolve from drop-down menu
    progress_start("red");
    this.task.status = 'resolved';
    this.task.updated = Date.now();
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> {    
        //finally / default  
        progress_end();
      });
    
  }
  reopenTask() : void {
    //task reopen from drop-down menu
    progress_start("red");
    this.task.status = 'in progress';
    this.task.updated = Date.now();
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then(()=> {    
        //finally / default  
        progress_end();
      });
  }

  deleteTask() {

    // progress_start("red");
    // this.taskService.saveTask(this.userId, this.task)
    //   .catch((error)=>this.taskService.errorHandler(error))
    //   .then((newurl)=> {    
    //     //finally / default  
    //     progress_end();
    //     //$('#delModal').modal("hide");
    //     setTimeout(() => this.router.navigateByUrl('/tasks/'), 1000);
    //   });
  }


  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
