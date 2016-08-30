import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'scrum-app',
  template: `
    <div class="container" style="margin-top:90px;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {

  constructor(private projectsService : ProjectsService) {
  }



}
