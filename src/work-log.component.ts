import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkLogService } from './work-log.service';



@Component({
  selector: 'worklog',
  template: `
    <section>
          <div class="edit_div" [hidden]="!showEditField">
            <form (ngSubmit)="saveRecord()" [formGroup]="wleditForm" novalidate>
            <div class="form-inline" style="width:100%;">
                <div class="input-group" style="width:100px;">
                    <input type="number" id="hours" formControlName="hours" class="form-control input-sm" required [ngModel]="record.hours"/>
                    <div class="input-group-addon">h</div>
                </div>
                <div class="input-group date" data-provide="datepicker">
                    <input type="text" class="form-control input-sm datepicker" formControlName="dt" placeholder="Date mm/dd/yyyy" [ngModel]="record.dt">
                    <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th"></span>
                    </div>
                </div>
            </div>
            <div class="alert alert-danger w50" *ngIf="formErrors.dt">{{ formErrors.dt }}</div>
            <div class="alert alert-danger w50" *ngIf="formErrors.hours">{{ formErrors.hours }}</div>
            <textarea id="text" formControlName="text" class="form-control input-sm" style="margin:10px 0;" rows="2"  placeholder="Description" [ngModel]="record.text"></textarea>

            <a class="btn btn-warning btn-sm" (click)="editRecId = ''">
              <span class="glyphicon glyphicon-remove"></span>
              <span class="hidden-xs">Cancel</span>
            </a>
            <button class="btn btn-primary btn-sm" [disabled]="!wleditForm.valid">
              <span class="glyphicon glyphicon-ok"></span>
              <span class="hidden-xs">Save</span>
            </button>
            </form>
          </div>
          <div *ngIf="loading" class="loader"></div>
          <ul [hidden]="!openLog || loading">
               <template ngFor let-log [ngForOf]="logs">
                <li id="{{log.id}}" 
                      onmouseOver="$(this).find('span.comment_context_menu').show();"
                      onmouseOut="$(this).find('span.comment_context_menu').hide();"
                >
                  <span class="glyphicon glyphicon-user"></span>
                  <span class="commentslist_username">{{log.user}}</span>
                  <span class="commentslist_text">{{log.dt | date:'M/d/yyyy'}}</span>
                  <span class="comment_context_menu">
                    <span (click)="setEditorField(log.id)" class="glyphicon glyphicon-pencil"></span>
                    <span (click)="openDeleteModal(log.id)" class="glyphicon glyphicon-trash"></span>
                  </span>
                  <div class="commentslist_text">{{log.text}}</div>
                  <div class="commentslist_date">
                      Spent : {{log.hours}}h 
                      <span *ngIf="log.edited" style="margin-left:10px;">edited: {{log.edited | date:'medium'}}</span>
                  </div>
                </li>
              </template>  
          </ul>
    </section>

    <!-- Modal Delete Comment Popup -->
    <div class="modal fade" id="delRecModal" role="dialog">
      <div class="modal-dialog modal-sm">
      
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 style="text-align: center;"><span class="glyphicon glyphicon-fire"></span> Delete the worklog record?</h4>
          </div>
          <div class="modal-body">
                <button class="btn btn-danger btn-block" (click)="deleteRecord()"><span class="glyphicon glyphicon-trash"></span> Delete</button>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles : [`
  .loader {margin: 0 auto;} 
  ul {list-style: none;}
  li {margin-bottom: 10px;}
  .commentslist_username {color:#284289; margin: 0 10px;}
  li .glyphicon-user{border: 1px solid #F2F2F2; padding: 5px 5px 3px 5px;}
  .commentslist_date { color: #999; font-style: italic; font-size:11px;}
  .edit_div {width: 80%; padding: 20px 0px 20px 40px;}
  .comment_context_menu {display:none; margin-left: 10px;}
  .comment_context_menu span {cursor: pointer; color: #999;}
  .modal-dialog {margin: 100px auto!important;}
  .modal-header {padding:25px 30px;}
  .modal-body {padding:40px 50px;}

  .ng-valid[required], .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
  .ng-invalid:not(form)  {border-left: 5px solid #a94442; /* red */}
  div.alert-danger {height: 40px; padding: 8px 15px; font-size: 12px;}
  `]
})
export class WorkLogComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  logs = [];
  @Output() setCount = new EventEmitter();  // set records count value in outter component  
  @Input() taskId : string;
  @Input() openLog: boolean;               // records list status
  editRecId: string;                        // id of record to be edited
  deleteRecId: string;                      // id of record to be deleted
  record;                                   // object to edit
  loading: boolean;                         // loader status
  
  wleditForm: FormGroup;
  formErrors = {'dt': '', 'hours': ''};  // properties to display validation error messages
  validationMessages = {
    'dt': {
      'required': 'Date is required.', 
      'pattern' : 'Date format should be MM/DD/YYYY, ie 03/21/2016'
    },
    'hours': {
      'required': 'Log is required.',
      'pattern' : 'Log is a number between 0 and 999 and one digit after the decimal'
    },
  };


  constructor(private workLogService: WorkLogService,
              private fb: FormBuilder) {
    console.info("WorkLogComponent:constructor");

    this.workLogService.errorHandler = error => {
      console.error('Comments component (WorkLogService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }

    this.loading = false;
    this.editRecId = '';  
    this.deleteRecId = '';   
    this.record = {dt: '', text: '', hours: ''}; 

    this.wleditForm = new FormGroup({
      dt: new FormControl(),
      hours: new FormControl()
    });
  }

  loadRecords() {
    //load list of comments into commentsListService commetns property 
    console.info("WorkLogComponent:loadRecords()");
    
    this.loading = true;
    this.workLogService.getLog(this.userId, this.taskId)
      .then (() => this.logs = this.workLogService.logs)
      .then (() => this.setCount.emit(this.workLogService.getFullLog()))
      .then(() => {   
        setTimeout(() => {
          this.loading = false;
          this.editRecId = '';
        }, 1000);  
      })
      .catch((error) => this.workLogService.errorHandler(error));
  }

  setEditorField(val: any) {
    // sets editor field value, sets record to edit ID
    console.info("WorkLogComponent:setEditorField(val: any)", val);

    this.record = {dt: '', text: '', hours: ''};
    if (val != -1) 
      this.record = this.workLogService.getRecord(val); 
    this.editRecId = val;

  }

  saveRecord() {
    // saves new/update record
    console.info("WorkLogComponent:saveRecord()");

    this.record.dt = this.wleditForm.value.dt;        // renew model with form.value
    this.record.hours = this.wleditForm.value.hours;
    this.record.text = this.wleditForm.value.text;

    this.workLogService.saveRecord(this.userId, this.taskId, this.record, this.editRecId)
      .then(() => this.loadRecords())                 // reload updated records list
      .catch((error) => this.workLogService.errorHandler(error));
  }

  buildForm(): void {
    //build form,controls and validators for them
    console.info("WorkLogComponent:buildForm()");

    this.wleditForm = this.fb.group({
      'dt': [this.record.dt, [
          Validators.required,
          Validators.pattern("^[0-1][0-9]\\/[0-9]{2}\\/[0-9]{4}$"),
      ]],
      'hours': [this.record.hours, [
        Validators.required,
        Validators.pattern("^(([0-9]{0,3})|([0-9]{1,3}\\.[0-9]{1}))$"),
      ]],
      'text':  [this.record.text]
    });

    this.wleditForm.valueChanges.subscribe(data => this.onValueChanged(data));  // calls onValueChanged every time form has changed
    this.onValueChanged();                                                      // (re)set validation messages now

    // $('.datepicker').datepicker({
    //     format: 'mm/dd/yyyy',
    //     startDate: '-3y',
    //     autocimmediateUpdates: true,
    //     todayHighlight: true
    // })
    // .on("changeDate", function(e) {data-date-format="mm/dd/yyyy"
    //     console.log("ddd");
    //     this.onValueChanged(this.wleditForm.value);     // calls onValueChanged every time date changes in datepicker
    // });
  }

 onValueChanged(data?: any) {
    //build form,controls and validators for them
    console.info("WorkLogComponent:onValueChanged(data?: any)", data);
  
    if (!this.wleditForm) return; 

    const form = this.wleditForm;
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

  openDeleteModal(val: any) {
    // opens dialog window, sets record to delete ID 
    console.info("WorkLogComponent:openDeleteModal(val: any)", val);

    this.deleteRecId = val;
    $('#delRecModal').modal();
  }

  deleteRecord() {
    // closes dialog window, calls service to delete record
    console.info("WorkLogComponent:deleteRecord()");

    $('#delRecModal').modal("hide");    //dismiss alert window

    this.workLogService.removeRecord(this.userId, this.taskId, this.deleteRecId)
      .then(() => this.loadRecords())                        // reload updated records list
      .catch((error) => this.workLogService.errorHandler(error));
  }


  ngOnInit() {
    console.info ("WorkLogComponent:ngOnInit");

    this.buildForm();
  }

  get showEditField() {
    if (!this.editRecId || this.editRecId.length ==  0) return false;
    return true;
  }

}
