import { Component, OnInit } from '@angular/core';
import { Task } from './task.class';
import { TaskService } from './task.service';


@Component({
  selector: 'scrum-board',
  template: `
    <section>
      <div class="row">
          <ul class="list-group list-group-sortable-connected-exclude">
              <li class="list-group-item disabled">Active sprint ({{sprint.length}} issues)</li>
              <li *ngFor="let taskElement of sprint" class="list-group-item">
                <a [routerLink]="['/tasks', taskElement.id]" [style.text-decoration]="taskElement.status==='resolved' ? 'line-through' : 'none'">{{taskElement.name}}</a> 
                <span class="label label-default">{{taskElement.project}}</span> 
                <span class="badge">{{taskElement.estimate}}h</span>
              </li>
          </ul>
      </div>
    </section>
    <section>
      <div class="row">
          <ul class="list-group list-group-sortable-connected-exclude">
              <li class="list-group-item disabled">Backlog ({{backLog.length}} issues)</li>
              <li class="list-group-item" *ngFor="let taskElement of backLog">
                {{taskElement.name}} 
                <span class="label label-default">{{taskElement.project}}</span> 
                <span class="badge">{{taskElement.estimate}}h</span>
              </li>
          </ul>
      </div>
    </section>
  `,
})
export class ScrumBoard implements OnInit {

  sprint = [];
  backLog = [];

  bookmarks = [];
  editableBookmark = {};

  constructor(private taskService: TaskService) {
    this.taskService.errorHandler = error =>
      window.alert('Oops! The server request failed.');

    this.reload();
 
  }

  clear() {
    this.editableBookmark = {};
  }

  edit(bookmark) {
    this.editableBookmark = Object.assign({}, bookmark);
  }

  remove(bookmark) {
    // this.bookmarkService.removeBookmark(bookmark)
    //   .then(() => this.reload());
  }

  save(bookmark) {
    // if (bookmark.id) {
    //   this.bookmarkService.updateBookmark(bookmark)
    //     .then(() => this.reload());      
    // } else {
    //   this.bookmarkService.addBookmark(bookmark)
    //     .then(() => this.reload());
    // }
    // this.clear();
  }

  private reload() {
    let self = this;
    progress_start("");
    var backLogRef = firebase.database().ref('/backlog/mSmxxvKkt4ei6nL80Krmt9R0m983');
    backLogRef.off();
    backLogRef.on('value', snapshot => this.backLog = this.convert(snapshot.val()));

    var sprintRef = firebase.database().ref('/sprint/mSmxxvKkt4ei6nL80Krmt9R0m983');
    sprintRef.off();
    sprintRef.on('value', function(snapshot) {
       self.sprint = self.convert(snapshot.val());
       progress_end();
    });

    setTimeout(() => this.rebuildSortable(), 1000);

    
    // this.taskService.getBackLog()
    //    .then(function(tasks) { 
    //       self.backLog = tasks;
    //       setTimeout(() => self.rebuildSortable(), 1000);
    // });
    // this.taskService.getSprint()
    //    .then(function(tasks) { 
    //       self.sprint = tasks;
    //       setTimeout(() => self.rebuildSortable(), 1000);
    // });
  }

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

  private convert(objectedResponse) {
    return Object.keys(objectedResponse)
      .map(id => ({
        id : id,
        name: objectedResponse[id].name,
        project: objectedResponse[id].project,
        sortnum: objectedResponse[id].sortnum,
        estimate: objectedResponse[id].estimate,
        status: objectedResponse[id].status
      }));
     // .sort((a, b) => a.name.localeCompare(b.name));
  }
}
