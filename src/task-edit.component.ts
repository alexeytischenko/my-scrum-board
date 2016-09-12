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
    <form (ngSubmit)="onSave()" #editForm="ngForm" novalidate>
      <div class="panel-body">
        <div style="float:right;">
            <a [routerLink]="['/tasks/'+ taskUrl]" class="btn btn-warning">
              <span class="glyphicon glyphicon-remove"></span>
              <span class="hidden-xs">Cancel</span>
            </a> 
            <button class="btn btn-primary" type="submit" [disabled]="!editForm.form.valid">
              <span class="glyphicon glyphicon-ok"></span>
              <span class="hidden-xs">Save</span>
            </button>            
        </div>

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
            {{project.name}}
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
  </form>  
  </div>
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

  onSave() {
    console.log("Submit fired");
    this.save.emit(this.task);
  }

  saveTask(uid, username, picture, title, body) {
    //////////////////////////////////////////////////      FOR UPDATE     ///////////////////////////
    var postData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: picture
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
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
