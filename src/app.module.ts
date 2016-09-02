import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { TasksListService } from './tasks-list.service';
import { ProjectsService } from './projects.service';
import { AppComponent } from './app.component';
import { TaskComponent } from './task.component';
import { ScrumBoard } from './scrum-board.component';

const routerModule = RouterModule.forRoot([
  {
    path: 'login',
    component: ScrumBoard
  },
  {
    path: 'tasks',
    component: ScrumBoard
  },
  {
    path: 'tasks/:tasktId',
    component: TaskComponent
  },
  {
    path: '',
    component: ScrumBoard,
    // redirectTo: '/tasks',
    // pathMatch: 'full'
  }
]);

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, routerModule],
  declarations: [AppComponent, ScrumBoard, TaskComponent],
  providers: [TasksListService, ProjectsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
