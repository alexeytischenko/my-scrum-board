import { Component, OnInit } from '@angular/core';
// import { Task } from './task.class';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';


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
export class ScrumBoard implements OnInit {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  sprintLength : number;
  backLogLength : number;
  backLog = [];

  bookmarks = [];
  editableBookmark = {};

  constructor(private tasksListService: TasksListService,
              private projectsService :ProjectsService) {

    this.tasksListService.errorHandler = error => {
      console.error('Backlog component error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }

    progress_start("");
    this.projectsService.loadProjects(this.userId)
    .then ( () => this.tasksListService.getBackLog(this.userId)) //, error => console.error("Getting projects list error:", error)
    .then ( () => {
          this.backLog = this.tasksListService.tasks;
          this.sprintLength = this.tasksListService.sprintLength;
          this.backLogLength = this.tasksListService.backLogLength;
          console.info("tasks loaded", this.backLog);
        }
    )
    .catch((error)=>this.tasksListService.errorHandler(error))
    .then(()=> {    
      //finally      
      setTimeout(() => this.rebuildSortable(), 1000);
      progress_end();
    });
  }

  ngOnInit() {
     //this.reload();
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

      $('#sprnt')
      .on('sortupdate', (e, ui) => {
        //ui.item contains the current dragged element.
        //Triggered when the user stopped sorting and the DOM position has changed.
        progress_start("red");
        console.log('element1: ', ui.item);
      });

      $('#bklg')
      .on('sortupdate', (e, ui) => {
        //ui.item contains the current dragged element.
        //Triggered when the user stopped sorting and the DOM position has changed.
        progress_start("red");
        console.log('element2: ', ui.item);
        $('#bklg li').each(function( index ) {
          console.log( index + ": " + this.id);
        });
      });      
  }

}
