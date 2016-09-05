import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from './task.service';
import { ProjectsService } from './projects.service';
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
            <button (click)="onEdit(bookmark)" class="btn btn-default">
              <span class="glyphicon glyphicon-pencil"></span>
              <span class="hidden-xs">Edit</span>
            </button>
        </div>
        <div class="panel-body">
                <a href="javascript:void(0);" data-toggle="popover" title="Help!!!" data-trigger="hover" data-content="You can edit the task title. Click the Edit button"><span class="glyphicon glyphicon-question-sign"></span></a>
                <label>{{task.name}}</label>            
        </div>
        <div class="panel-body">
            <div>
              <label>Estimate</label>
              {{task.estimate}}h / 0h
            </div>
            <div>
                <label>Project</label>
                <button class="btn btn-{{task.project_color}} btn-xs" disabled="true">{{task.project_sname}}</button>
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
          <div>
            <label>Created</label>
            {{task.created | date:'medium'}}
          </div>
          <div>
            <label>Modified</label>
            {{task.updated | date:'medium'}}
          </div>
        </div>
        
        <div class="panel-body"><label>Description</label> {{task.description}}</div>

        <div class="panel-body">
          <div style="float:right;">
            <button class="btn btn-default">
              <span class="glyphicon glyphicon-file"></span>
              <span class="hidden-xs">Add files</span>
            </button>
          </div>
          <div>
            <label>Attachments</label>
            There are no attachments
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
            There are no comments
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
            There are no worklogs
          </div>       
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
export class TaskComponent implements OnInit, OnDestroy {

  task;
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

  ngOnInit() {
    let self = this;

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        progress_start ("");
        this.taskService.getTask("mSmxxvKkt4ei6nL80Krmt9R0m983", params['tasktId'])
        .then ( () => {
              this.task = this.taskService.task;
              this.task.project_color = this.projectsService.getColor(this.task.project);
              this.task.project_sname = this.projectsService.getSName(this.task.project);
              console.info("task loaded", this.task);
            }
        )
        .catch((error)=>console.error("Task component error:", error))
        .then (() => {
          //finally
          progress_end();
        });

        // var taskRef = firebase.database().ref('/sprint/mSmxxvKkt4ei6nL80Krmt9R0m983/' + params['tasktId']);
        // taskRef.off();
        // taskRef.on('value', function(snapshot) {
        //     self.task = snapshot.val();
        //     progress_end ();
        // });
        // //this.task = snapshot.val();
        // //console.log("task ", this.task);
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
