import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'task-panel',
  template: `
    <div class="panel panel-primary">
      <div class="panel-body">
        <label>Title</label> 
        <div>
          Test task!!!!
          <button (click)="onEdit(bookmark)" class="btn btn-default">
            <span class="glyphicon glyphicon-pencil"></span>
          </button>
        </div>

      </div>
      <div class="panel-body">
        <input type="text" [(ngModel)]="bookmark.title"
          placeholder="Title" style="width: 25%;">
        <input type="text" [(ngModel)]="bookmark.url" 
          placeholder="URL" style="width: 50%;">
        <button (click)="onSave()" class="btn btn-primary">
          <span class="glyphicon glyphicon-ok"></span>
          <span class="hidden-xs">Save</span>
        </button>
        <button (click)="onClear()" class="btn btn-warning">
          <span class="glyphicon glyphicon-remove"></span>
          <span class="hidden-xs">Clear</span>
        </button>
      </div>
    </div>
  `,
})
export class TaskComponent {

  @Input() bookmark = {};
  @Output() clear = new EventEmitter();
  @Output() save = new EventEmitter();

  onClear() {
    this.clear.emit(null);
  }

  onSave() {
    this.save.emit(this.bookmark);
  }

}
