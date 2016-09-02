import { Component, OnInit } from '@angular/core';
// import { Task } from './task.class';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';


@Component({
  selector: 'scrum-board',
  template: `
    <section>
      <div class="row">
          <ul class="list-group list-group-sortable-connected-exclude">
              <li class="list-group-item disabled">Active sprint ( {{sprintLength}} issues )</li>
              <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='s'" class="list-group-item">
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
          <ul class="list-group list-group-sortable-connected-exclude">
              <li class="list-group-item disabled">Backlog ( {{backLogLength}} issues )</li>
               <template ngFor let-taskElement [ngForOf]="backLog">
                <li *ngIf="taskElement.type=='b'" class="list-group-item">
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

  sprintLength : number;
  backLogLength : number;
  backLog = [];

  bookmarks = [];
  editableBookmark = {};

  constructor(private tasksListService: TasksListService) {
    this.tasksListService.errorHandler = error =>
      window.alert('Oops! The server request failed.');

    //this.reload();

    this.tasksListService.getBackLog("mSmxxvKkt4ei6nL80Krmt9R0m983")
      .then(//this.backLog = this.tasksListService.tasks
        () => {console.log("ffff")}, console.log
      )
      .catch(()=>console.log("error") );
    this.sprintLength = this.tasksListService.sprintLength;
    this.backLogLength = this.tasksListService.backLogLength;
 
  }


  // private reload() {

  //   let self = this;
  //   progress_start("");
  //   var backLogRef = firebase.database().ref('mSmxxvKkt4ei6nL80Krmt9R0m983/backlog/');
  //   backLogRef.off();
  //   backLogRef.on('value', function(snapshot) {
  //     self.backLog = self.convert(snapshot.val());
  //     self.calculateSize();
  //     progress_end();
  //   });

  //   setTimeout(() => this.rebuildSortable(), 1000);
  // }

  ngOnInit() {
     //this.reload();
  }

  rebuildSortable() {
      console.log('rebuildSortable called!');
      $('.list-group-sortable-connected-exclude').sortable({
          placeholderClass: 'list-group-item',
          connectWith: '.connected',
          items: ':not(.disabled)',      
      })
      .bind('sortupdate', (e, ui) => {
        //ui.item contains the current dragged element.
        //Triggered when the user stopped sorting and the DOM position has changed.
        progress_start("red");
        console.log('element1: ' + ui.item.val());
      })
  }

  // private convert(objectedResponse) {
  //   return Object.keys(objectedResponse)
  //     .map(id => ({
  //       id : id,
  //       name: objectedResponse[id].name,
  //       project: this.projectsService.getSName(objectedResponse[id].project),
  //       project_color : this.projectsService.getColor(objectedResponse[id].project),
  //       sortnum: objectedResponse[id].sortnum,
  //       estimate: objectedResponse[id].estimate,
  //       status: objectedResponse[id].status,
  //       type: objectedResponse[id].type
  //     }));
  //    // .sort((a, b) => a.name.localeCompare(b.name));
  // }

  // private calculateSize() {
  //   this.sprintLength = 0;
  //   this.backLogLength = 0;

  //   if (this.backLog && this.backLog.length > 0) {
  //       this.backLog.forEach(element => {
  //         if (element.type=="s") this.sprintLength++;
  //         else this.backLogLength++;
  //       });
  //   }
  // }
}
