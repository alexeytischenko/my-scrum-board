import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from './task.service';
import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'task-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-body">

        <div class="panel-body">
            <div style="float:right;">
                <button (click)="onEdit(bookmark)" class="btn btn-default">
                  <span class="glyphicon glyphicon-pencil"></span>
                  <span class="hidden-xs">Edit</span>
                </button>
            </div>
            <div>
                <a href="javascript:void(0);" data-toggle="popover" title="Help!!!" data-trigger="hover" data-content="You can edit the task title. Click the Edit button"><span class="glyphicon glyphicon-question-sign"></span></a>
                <label>{{task.name}}</label>
            </div> 
            <div>
                <label>Project</label>
                <button class="btn btn-primary btn-xs" text="Afghan partisan series" disabled="true">APS</button>
            </div>             
        </div>
        <div class="panel-body">
            <div>
              <label>Estimate</label>
              20h
            </div>
            <div>
              <label>Status</label>
              <button class="btn btn-primary btn-xs" disabled="true">in progress</button>
              <button class="btn btn-success btn-xs" disabled="true">resolved</button>
            </div>  
        </div>      
        <div class="panel-body">         
          <div>
            <label>Created</label>
            08-Aug-2015 23:00
          </div>
          <div>
            <label>Modified</label>
            18-Aug-2016 21:10
          </div>
        </div>
        <div class="panel-body">
        The history of modern Afghanistan is a history of partisan politics. A myriad of individuals, political parties, and ideological causes have competed not only for temporal power, but also mindshare among ordinary Afghans since the early 20th century. However, while governments and causes have come and gone, one force has remained constant: The Afghan press. Over a century old, the press is one of the few surviving mediums bearing testament to Afghanistan’s tumultuous political history, as well as its rich and varied intellectual and social history.
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
  @Output() clear = new EventEmitter();
  @Output() save = new EventEmitter();

  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService) { }


  onClear() {
    this.clear.emit(null);
  }

  onSave() {
    this.save.emit(this.task);
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(
      params => {
        this.task = this.taskService.getSprintTask(params['tasktId']);
        console.log("task " + this.task.name);
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
