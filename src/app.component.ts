import { Component } from '@angular/core';

@Component({
  selector: 'scrum-app',
  template: `
    <div id="jquery-script-menu">
    <div class="jquery-script-center">
      <div class="row">
        <div class="col-xs-3">
          <h1>Scrum Board</h1>
          <h2 class="hidden-xs">Backlog</h2>
        </div>
        <div class="col-xs-1">
            <div class="row progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar"
                aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        <div class="col-xs-8">
            <a [routerLink]="['/tasks/edit/', -1]" class="btn btn-primary" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-plus"></span>
              <span class="hidden-xs">Create task</span>
            </a>
            <a [routerLink]="['/']" class="btn btn-primary" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-th-list"></span>
              <span class="hidden-xs">Show Tasks</span>
            </a>
            <a [routerLink]="['/projects/']" class="btn btn-primary" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-tags"></span>
              <span class="hidden-xs">Manage Projects</span>
            </a>
        </div>
      </div>
    </div>
    </div>
    <div class="container" style="margin-top:90px;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
