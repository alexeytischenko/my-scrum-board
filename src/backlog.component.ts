import { Component } from '@angular/core';
// import { Task } from './task.class';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'scrum-board',
  template: `
    <section>
          <ul class="list-group list-group-sortable connected" id="sprnt">
              <li class="list-group-item disabled upbar">Active tasks ( {{sprintLength}} issues )
                <span class="dropdown nodrug" style="float:right;">
                  <a class="dropdown-toggle nodrug" type="button" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-align-justify accord nodrug"></span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-right nodrug">
                    <li class="nodrug"><a href="#">Remove resolved items from Active tasks</a></li>
                  </ul>
                </span>
              </li>
              <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='s'" class="list-group-item" id="{{taskElement.id}}">
                  <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}} - {{taskElement.code}}</span> 
                  <span class="badge">{{taskElement.estimate ? taskElement.estimate : '0'}}h / 0h</span>
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
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}} - {{taskElement.code}}</span> 
                  <span class="badge">{{taskElement.estimate ? taskElement.estimate : '0'}}h / 0h</span>
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
  `]
})
export class BackLogComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  sprintLength : number;
  backLogLength : number;
  backLog = [];

  constructor(private tasksListService: TasksListService,
              private projectsService :ProjectsService) {

      console.info ("BackLogComponent:constructor");
    
      this.tasksListService.errorHandler = error => {
        console.error('Backlog component (tasksListService) error! ' + error);
        window.alert('An error occurred while processing this page! Try again later.');
      }

      //load projects into property of the ProjectsService then loads list of tasks into tasksListService tasks property 
      progress_start("");
      this.projectsService.loadProjects(this.userId)
        .then ( () => this.tasksListService.getBackLog(this.userId)) //, error => console.error("Getting projects list error:", error)
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
            this.countDomSizes("s");
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
            this.countDomSizes("b");
          });  
      });   

      this.countDomSizes("s");  
      this.countDomSizes("b");
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

  private countDomSizes(tp: string) {
    //updates current values   
    console.info ("BackLogComponent:countDomSizes(tp: string)",tp);

    if (tp === "s") {
      let sl = 0;
      $('#sprnt li').each(function( index ) {
        if (index > 0) sl++;  
      });
      this.sprintLength = sl;
    }
    else {
      let bll = 0;
      $('#bklg li').each(function( index ) {
        if (index > 0) bll++;  
      });
      this.backLogLength = bll;
    }
  }

}
