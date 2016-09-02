import { Component } from '@angular/core';

@Component({
  selector: 'scrum-app',
  template: `
    <div class="container" style="margin-top:90px;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
