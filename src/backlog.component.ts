import { Component, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
// import { Task } from './task.class';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'scrum-board',
  template: `
    <div class="form-inline filters">
        <span class="dropdown">
          <button class="btn btn-default dropdown-toggle btn-sm" type="button" data-toggle="dropdown">
            <span class="glyphicon glyphicon-plus"></span>
            <span class="hidden-xs">Add filter by project</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-left">
            <li *ngFor="let prj of projectsService.projects">
              <a href="javascript:void(0);" *ngIf="!ifInFilter(prj.id)" (click)="addToFilter(prj.id, prj.sname)">{{prj.sname}}</a>
              <span *ngIf="ifInFilter(prj.id)" class="cant_choose">{{prj.sname}}</span>
            </li>
          </ul>
        </span>

        <template ngFor let-prj [ngForOf]="projectsService.projects">
          <button class="btn btn-link btn-xs" (click)="removeFromFilter(prj.id)" *ngIf="ifInFilter(prj.id)" alt="Remove from filter" title="Remove from filter">
                <span class="glyphicon glyphicon-minus-sign"></span>
                {{prj.sname}}
          </button>
        </template>
    </div>
    <section>
          <ul class="list-group list-group-sortable connected" id="sprnt">
              <li class="list-group-item disabled upbar">Active tasks ( {{sprintLength}} issues )
                <span class="dropdown nodrug" style="float:right;">
                  <a class="dropdown-toggle nodrug" type="button" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-align-justify accord nodrug"></span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-right nodrug">
                    <li class="nodrug"><a href="javascript:void(0);">Move resolved items to Backlog</a></li>
                    <li class="nodrug"><span class="cant_choose">Move resolved items to Archive</span></li>
                    <li class="nodrug"><span class="cant_choose">Delete resolved items</span></li>
                    
                  </ul>
                </span>
              </li>
              <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='s'" class="list-group-item" id="{{taskElement.id}}">
                  <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}} - {{taskElement.code ? taskElement.code : 0}}</span> 
                  <span class="badge">{{taskElement.worked ? taskElement.worked : '0'}}h / {{taskElement.estimate ? taskElement.estimate : '0'}}h</span>
                </li>
              </template>
  
          </ul>
    </section>
    <section>
          <ul class="list-group list-group-sortable connected" id="bklg">
              <li style="margin-top:20px;" class="list-group-item disabled upbar">Backlog ( {{backLogLength}} issues )</li>
               <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='b'" class="list-group-item" id="{{taskElement.id}}">
                  <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}} - {{taskElement.code ? taskElement.code : 0}}</span> 
                  <span class="badge">{{taskElement.worked ? taskElement.worked : '0'}}h / {{taskElement.estimate ? taskElement.estimate : '0'}}h</span>
                </li>
              </template>  
          </ul>
    </section>
  `,
  styles : [`
    .upbar {cursor: default!important;}
    .accord {color: #777;cursor:pointer;margin-right: 5px;}
    .list-group-item {cursor: move;}
    .list-group-item:hover {background: #e9e9e9;}
    .filters {margin-bottom: 10px;}
    .cant_choose {margin-left: 20px;color: #ccc;}
  `]
})
export class BackLogComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  sprintLength : number;
  backLogLength : number;
  backLog = [];
  filter = {};

  constructor(private tasksListService: TasksListService,
              private projectsService :ProjectsService,
              private ref: ChangeDetectorRef) {

      console.info ("BackLogComponent:constructor");
    
      this.tasksListService.errorHandler = error => {
        console.error('Backlog component (tasksListService) error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      // load projects if ness
      if (this.projectsService.projects.length == 0)
        this.projectsService.loadProjects(this.userId);

      // load tasks  
      this.getTaskList();
  }

  private getTaskList() {
      console.info ("BackLogComponent:getTaskList()");
      //load projects into property of the ProjectsService then loads list of tasks into tasksListService tasks property 

      progress_start("");
      this.tasksListService.getBackLog(this.userId, this.filter)
        .then ( () => this.backLog = this.tasksListService.tasks)
        .catch((error)=>this.tasksListService.errorHandler(error))
        .then(()=> {    
          //finally / default     
          setTimeout(() => this.rebuildSortable(), 1000);
          progress_end();
        });
  }

  rebuildSortable() {
      console.info ("BackLogComponent:rebuildSortable()");

      $('.list-group-sortable').sortable({
          placeholderClass: 'list-group-item',
          cursor: "move",
          //cancel: ".disabled",
          connectWith: '.connected',
          items: ':not(a, .disabled, .label, .badge, .nodrug)',    
            
      })
      .disableSelection();

      //sprint block events listner
      $('#sprnt')
      .on('sortupdate', (e, ui) => {
        //triggered if sprint section is updated
        progress_start("red");
        //call resortBackLog method to update tasks list
        this.tasksListService.resortBackLog(this.userId, this.prepareJSON("s", 'sprnt'))
          .catch((error)=>this.tasksListService.errorHandler(error))
          .then(() => {
            progress_end();
            this.countListsLength();
          });        
      });

      //backlog block events listner
      $('#bklg')
      .on('sortupdate', (e, ui) => {
        //triggered if backlog section is updated
        progress_start("red");
        //call resortBackLog method to update tasks list
        this.tasksListService.resortBackLog(this.userId, this.prepareJSON("b", 'bklg'))
          .catch((error)=>this.tasksListService.errorHandler(error))
          .then(() => {
            progress_end();
            this.countListsLength();
          });  
      });   

      this.countListsLength();
  }

  private prepareJSON(recordType : string, domNode : string) {
    //prepare JSON for UPDATE sortnum and type (active sprint / backlog) after resort of the elements
    console.info ("BackLogComponent:prepareJSON(recordType : string, domNode : string)",recordType ,domNode);

    let updatedData = [];
    $('#' + domNode + ' li').each(function( index ) {
          updatedData[index] = {
            "id" : this.id,
            "sortnum": index,
            "type": recordType
          };    
    });

    return updatedData;
  }

  private countListsLength() {
      //updates current values   
      console.info ("BackLogComponent:countListsLength()");   

      if (this.backLog && this.backLog.length > 0) {

        let blLength  = 0;
        let asLength = 0;

        this.backLog.forEach((element) => {
          if(element.type == "b") blLength++; 
          else asLength++;
        });

        this.backLogLength = blLength;
        this.sprintLength = asLength;

        // forcing Angular to detect changes in model, otherwise it takes much time to update them
        this.ref.detectChanges();
      }
  }

  private addToFilter(key : string, value: string) {
    //prepare JSON for UPDATE sortnum and type (active sprint / backlog) after resort of the elements
    console.info ("BackLogComponent:addToFilter(key : string, value: string)", key, value);

    if( !this.filter.hasOwnProperty(key) ){
      this.filter[key] = value;
      console.info("this.filter", this.filter);
    }
    
    this.getTaskList();
  }

    private removeFromFilter(key : string) {
    //prepare JSON for UPDATE sortnum and type (active sprint / backlog) after resort of the elements
    console.info ("BackLogComponent:removeFromFilter(key : string)",key);

    if( this.filter.hasOwnProperty(key) ){
      delete this.filter[key];
      console.info("this.filter", this.filter);
    }
    
    this.getTaskList();
  }

  private ifInFilter(id) {
    // checks if added to filter
    //console.info ("BackLogComponent:ifFilter(id)", id);   

    if(id in this.filter) return true;
    else return false;

  }


}
