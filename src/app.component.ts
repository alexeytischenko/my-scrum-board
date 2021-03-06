import { Component } from '@angular/core';

@Component({
  selector: 'scrum-app',
  template: `
    <div class="progress">
      <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div id="topmenu-menu">
    <div class="topmenu-center">
      <div class="row">
        <div class="col-xs-3">
          <h4>Scrum Board</h4>
          <h5 class="hidden-xs">Backlog</h5>
        </div>

        <div class="col-xs-7">
            <a [routerLink]="['/tasks/edit/', -1]" class="btn btn-primary" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-plus"></span>
              <span class="hidden-xs">Create task</span>
            </a>
            <a [routerLink]="['/']" class="btn btn-default" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-tasks"></span>
              <span class="hidden-xs">Show Tasks</span>
            </a>
            <a [routerLink]="['/projects/']" class="btn btn-default" style="float: right;margin:5px;">
              <span class="glyphicon glyphicon-tags"></span>
              <span class="hidden-xs">&nbsp;Manage Projects</span>
            </a>
        </div>
        <div class="col-xs-2">
            User
        </div>
      </div>
    </div>
    </div>
    <div class="container" style="padding-top:90px;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
