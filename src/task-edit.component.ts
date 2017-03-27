import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from './task.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';
// import { Task } from './task.class';
import { Subscription } from 'rxjs/Subscription';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'task-panel',
  template: `
  <form (ngSubmit)="saveTask()" [formGroup]="taskeditForm" novalidate>
  <div class="panel panel-default">
      <div class="panel-heading">
          <label>{{taskLabel}}</label> 
          <div style="float:right;">
              <a [routerLink]="['/tasks/'+ taskUrl]" class="btn btn-warning btn-sm">
                <span class="glyphicon glyphicon-remove"></span>
                <span class="hidden-xs">Cancel</span>
              </a> 
              <button class="btn btn-primary btn-sm" type="submit" [disabled]="!taskeditForm.valid">
                <span class="glyphicon glyphicon-ok"></span>
                <span class="hidden-xs">Save</span>
              </button>            
          </div>
      </div>
      <div class="panel-body">

        <div *ngIf = "parentTask.id && parentTask.id.length > 0" class="panel pull-right panel-default panel-sm" style="max-width:50%">
          <div class="panel-body">
            <label>Parent task:</label>
            {{parentTask.name}}
          </div>
        </div> 

        <div class="form-group w50">   
           <label for="name">Title</label>            
            <input type="text" id="name" formControlName="name" required class="form-control" />  
            <div class="alert alert-danger" *ngIf="formErrors.name">{{ formErrors.name }}</div>       
        </div>

        <div class="form-group">
          <label for="estimate">Estimate</label>
          <div class="input-group" style="width:200px;">
            <input type="number" id="estimate" formControlName="estimate" class="form-control" required />
            <div class="input-group-addon">h / worked: {{task.worked || 0}}h</div>
          </div>
          <div class="alert alert-danger w50" *ngIf="formErrors.estimate">{{ formErrors.estimate }}</div>  
        </div>

        <div class="form-group">
            <label for="project">Project</label>
            <div class="form-inline">
              <select formControlName="project" id="project" required  class="form-control input-sm w50" [ngModel]="task.project">
                <option></option>
                <option *ngFor="let pr of projects" [value]="pr.id">{{pr.name}}</option>
              </select>
              <newproject (save)="updateProjectsSelect($event)"></newproject>              
            </div>
            <div class="alert alert-danger w50" *ngIf="formErrors.project">{{ formErrors.project }}</div>

        </div> 

        <div class="form-group w50">
            <label for="status">Status</label>
            <select formControlName="status" id="status" class="form-control input-sm">
              <option *ngFor="let status of taskStatuses" [value]="status">{{status}}</option>
            </select>
        </div>    
        
        <div class="form-group">
          <label for="description">Description</label> 
          <textarea formControlName="description" id="description" class="form-control input-sm" rows="4"></textarea>
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
  parentTask;
  taskUrl;
  taskId;
  projects;
  taskStatuses : string[];
  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";

  paramsSubscription: Subscription;
  taskeditForm: FormGroup;
  formErrors = {'name': '', 'estimate': '', 'project' : ''};  // properties to display validation error messages
  validationMessages = {
    'name': {'required': 'Name is required.', },
    'estimate': {
      'required': 'Estimate is required.',
      'pattern' : 'Estimate is a number between 0 and 999 and one digit after the decimal' 
    },
    'project' : {'required': 'Project is required.', }
  };                                                          // validation error messages


  constructor(private route : ActivatedRoute,
              private taskService : TaskService,
              private projectsService : ProjectsService,
              private router: Router,
              private fb: FormBuilder) {

      console.info("TaskEditComponent:constructor");


      this.taskService.errorHandler = error => {
        console.error('Task component error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      this.task = {};
      this.parentTask = {};
      this.projects = [];
      this.taskStatuses = this.taskService.taskSatuses;

      this.taskeditForm = new FormGroup({
        name: new FormControl(),
        estimate: new FormControl(),
        project: new FormControl(),
        status : new FormControl(),
        description: new FormControl()
      });

      //load projects if ness
      if (this.projectsService.projects && this.projectsService.projects.length > 0) {
        console.info('projects already loaded');
        this.projects = this.projectsService.projects;
      }
      else
        this.projectsService.loadProjects(this.userId)
          .then ( () => this.projects = this.projectsService.projects);
  }


  saveTask() {
    //save task data
    console.info("TaskEditComponent:saveTask()");

    this.task.description = this.taskeditForm.value.description; // renew model with form.value
    this.task.estimate = this.taskeditForm.value.estimate;
    this.task.name = this.taskeditForm.value.name;
    this.task.project = this.taskeditForm.value.project;
    this.task.status = this.taskeditForm.value.status;

    progress_start("red");
    this.taskService.saveTask(this.userId, this.task)
      .catch((error)=>this.taskService.errorHandler(error))
      .then((newurl)=> {    
        if (this.taskUrl == ""){
          this.taskUrl = newurl;
          this.taskId = newurl;
        }
        progress_end();
        setTimeout(() => this.router.navigateByUrl('/tasks/'+ this.taskUrl), 1000);
      });
  }

  buildForm(): void {
    //build form,controls and validators for them
    console.info("TaskEditComponent:buildForm()");

    this.taskeditForm = this.fb.group({
      'name': [this.task.name, [
          Validators.required,
        ]
      ],
      'estimate': [this.task.estimate, [
        Validators.required,
        Validators.pattern("^(([0-9]{0,3})|([0-9]{1,3}\\.[0-9]{1}))$"),
      ]],
      'project':    [this.task.project, Validators.required],
      'description' : [this.task.description],
      'status' : [this.task.status]
    });
    this.taskeditForm.valueChanges.subscribe(data => this.onValueChanged(data));  //calls onValueChanged every time form has changed
    this.onValueChanged(); // (re)set validation messages now
  }

 onValueChanged(data?: any) {
    //build form,controls and validators for them
    ///console.info("TaskEditComponent:onValueChanged(data?: any)", data); --too much garbage
  
    if (!this.taskeditForm) return; 

    const form = this.taskeditForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';  // clear previous error message (if any)
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  ngOnInit() {
    // ngOnInit lifecycle hook method
    console.info("TaskEditComponent:ngOnInit");
    
    let self = this;

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        if (params['tasktId'] == -1) {
          this.taskUrl = "";
          //Task default values
          this.task.estimate = 0;
          this.task.status = "idle";
          this.task.id = -1;

          // if this is a sub task
          if (params['parentId'] && params['parentId'].length > 0) {
            this.taskService.getAnyTask(this.userId, params['parentId'])
            .then ( (parent : any) => {
              console.log("parent", parent);
              if (parent.type != "i") {
                this.parentTask = parent;
                this.task.project = parent.project;
                this.task.parent = parent.id;
              }
              this.buildForm();
            })
          }
          else
            this.buildForm();
        }
        else {
          progress_start ("");
          this.taskId = params['tasktId'];
          this.taskUrl = this.taskId;
          this.taskService.getTask(this.userId, this.taskId)          
          .then ( () => {
            this.task = this.taskService.task;
            this.buildForm();

            if (this.task.parent && this.task.parent.length > 0) {
              // get parent task
              this.taskService.getAnyTask(this.userId, this.task.parent)
              .then ( (parent : any) => {
                console.log("parent", parent);
                if (parent.type != "i") {
                  this.parentTask = parent;
                }
              })
            }
          })
          .catch((error)=>this.taskService.errorHandler(error))
          .then (() => progress_end());
        }
      }
    );

  }

  updateProjectsSelect(newId) {
      this.task.project = newId;
  }

  get diagnostic() {
    return JSON.stringify(this.projects);
  }

  get taskLabel() : string {
    return this.task.name ? this.task.name : 'Creating new task...'; 
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
