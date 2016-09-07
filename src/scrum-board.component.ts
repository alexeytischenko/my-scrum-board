import { Component } from '@angular/core';
// import { Task } from './task.class';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';
import { Project } from './project.class';


@Component({
  selector: 'scrum-board',
  template: `
    <section>
      <div class="row">
          <ul class="list-group list-group-sortable connected" id="sprnt">
              <li class="list-group-item disabled">Active sprint ( {{sprintLength}} issues )</li>
              <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='s'" class="list-group-item" id="{{taskElement.id}}">
                  <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}}</span> 
                  <span class="badge">{{taskElement.estimate}}h / 0h</span>
                </li>
              </template>
   
          </ul>
      </div>
    </section>
    <section>
      <div class="row">
          <ul class="list-group list-group-sortable connected" id="bklg">
              <li style="margin-top:20px;" class="list-group-item disabled">Backlog ( {{backLogLength}} issues )</li>
               <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='b'" class="list-group-item" id="{{taskElement.id}}">
                  <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                  <span class="label label-{{taskElement.project_color}}">{{taskElement.project}}</span> 
                  <span class="badge">{{taskElement.estimate}}h / 0h</span>
                </li>
              </template>  
          </ul>
      </div>
    </section>
  `,
})
export class ScrumBoard {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  sprintLength : number;
  backLogLength : number;
  backLog = [];

  bookmarks = [];
  editableBookmark = {};

  constructor(private tasksListService: TasksListService,
              private projectsService :ProjectsService) {

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
      console.log('rebuildSortable called!');
      $('.list-group-sortable').sortable({
          placeholderClass: 'list-group-item',
          cursor: "move",
          //cancel: ".disabled",
          connectWith: '.connected',
          items: ':not(a, .disabled, .label, .badge)',    
            
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
            console.log("s");
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
            console.log("b");
            this.countDomSizes("b");  //!!!! no need to run it here, it already fired 10 lines above
          });  
      });   

      this.countDomSizes("s");  
      this.countDomSizes("b");
  }

  private prepareJSON(recordType : string, domNode : string) {
    //prepare JSON for UPDATE sortnum and type (active sprint / backlog) after resort of the elements
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
      console.info("backLogLength", bll);
      this.backLogLength = bll;
    }
  }
    

  //  private setBackLogSizes() {
  //   //updates current values
  //   this.sprintLength = 0;
  //   this.backLogLength = 0;

  //   for (let task of this.backLog) {
  //       if (task.type == "s") this.sprintLength++;
  //       else this.backLogLength++;
  //   }  
  // }

}
