import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'editproject',
  template: `
  
  <div class="projecteditForm form-group">
    <button *ngIf="!showForm" class="btn btn-default btn-sm" (click)="newProject()">
        <span class="glyphicon glyphicon-plus" alt="New project" title="New project"></span>
        <span class="hidden-xs">New project</span>
    </button>
    <div *ngIf="showForm" class="form-inline">
    <form (ngSubmit)="saveProject()" [formGroup]="projeditForm" novalidate>
       <input type="text" id="newproject" formControlName="newproject" required maxlength="255" class="form-control" placeholder="type name here" />
       <input type="text" id="newsname" formControlName="newsname" maxlength="10" class="form-control" placeholder="type short name here" />
       <select formControlName="color" id="color" [(ngModel)]="prj.color" class="form-control">
           <option *ngFor="let color of colors" [value]="color | i18nSelect: colorsMap">{{color}}</option>
       </select> 
       <span style="margin:20px;" class="hidden-xs">&nbsp;</span>
       <a class="btn btn-warning" (click)="clear()">
           <span class="glyphicon glyphicon-remove" alt="Close" title="Close"></span>
           <span class="hidden-xs">Close</span>
       </a>
       <button class="btn btn-primary" type="submit" [disabled]="!projeditForm.valid">
           <span class="glyphicon glyphicon-ok" alt="Save" title="Save"></span>
           <span class="hidden-xs">Save</span>
       </button>
    </form>
    </div>
    <div class="alert alert-danger" *ngIf="formErrors.newproject">{{ formErrors.newproject }}</div>
    <div class="alert alert-danger" *ngIf="formErrors.newsname">{{ formErrors.newsname }}</div>
  </div>
  `,
  styles : [` 
    .ng-valid[required], .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
    .ng-invalid:not(form)  {border-left: 5px solid #a94442; /* red */}
  `]
})
export class EditProject {  

    prj : Project;
    showForm: boolean = false;

    userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
    colors = [];
    colorsMap: any;

    projeditForm: FormGroup;
    formErrors = {'newproject': '', 'newsname': ''};  // properties to display validation error messages
    validationMessages = {
        'newproject': {
            'required': 'Name is required.', 
            'maxLength' : 'Name maxlength is 255'},
        'newsname' : {'maxLength' : 'Short name maxlength is 10', }
    }; 

    constructor(private projectsService: ProjectsService,
                private fb: FormBuilder) {
        this.clear();
        this.projectsService.errorHandler = error => {
            window.alert('Could not create a new project.');
        }
        this.colors = this.projectsService.colors;
        this.colorsMap = this.projectsService.colorsMap;

        this.projeditForm = new FormGroup({
            newproject: new FormControl(),
            newsname: new FormControl(),
            color: new FormControl()
        });
    }

    saveProject() {
        //save project

        this.prj.name = this.projeditForm.value.newproject; // renew model with form.value
        this.prj.sname = this.projeditForm.value.newsname;
        this.prj.color = this.projeditForm.value.color;


        progress_start("red");
        this.projectsService.saveProject(this.userId, this.prj)
            .catch((error)=>this.projectsService.errorHandler(error))
            .then((newId)=> {    
                this.clear();
                progress_end();
            });
        return false;
    }

    buildForm(): void {
        //build form,controls and validators for them
        console.info("TaskEditComponent:buildForm()");

        this.projeditForm = this.fb.group({
        'newproject': [this.prj.name, [
            Validators.required,
            Validators.maxLength(255),
            ]
        ],
        'newsname': [this.prj.sname, Validators.maxLength(10)],
        'color' : [this.prj.color]
        });
        this.projeditForm.valueChanges.subscribe(data => this.onValueChanged(data));  //calls onValueChanged every time form has changed
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        //build form,controls and validators for them
        console.info("TaskEditComponent:onValueChanged(data?: any)", data);
    
        if (!this.projeditForm) return; 

        const form = this.projeditForm;
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

    editProject(project) {
        this.showForm = true;
        this.prj.fill(project.name, project.sname, project.color, project.id);
        this.buildForm();
    }

    newProject() {
        this.showForm = true;
        this.prj = new Project();
        this.buildForm();
    }

    clear() {
        //clearing new project form
        this.showForm = false;
        this.prj = new Project();
        this.buildForm();
    }

}            