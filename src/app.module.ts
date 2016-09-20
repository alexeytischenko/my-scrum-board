import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { TasksListService } from './tasks-list.service';
import { TaskService } from './task.service';
import { Project } from './project.class';
import { ProjectsService } from './projects.service';
import { AppComponent } from './app.component';
import { TaskComponent } from './task.component';
import { TaskEditComponent } from './task-edit.component';
import { BackLogComponent } from './backlog.component';
import { NewProject } from './new-project.component';


const routerModule = RouterModule.forRoot([
  {
    path: 'login',
    component: BackLogComponent
  },
  {
    path: 'tasks',
    component: BackLogComponent
  },
  {
    path: 'tasks/:tasktId',
    component: TaskComponent
  },
  {
    path: 'tasks/edit/:tasktId',
    component: TaskEditComponent
  },
  {
    path: '',
    component: BackLogComponent,
    // redirectTo: '/tasks',
    // pathMatch: 'full'
  }
]);

@NgModule({
  imports: [BrowserModule, FormsModule, routerModule],
  declarations: [AppComponent, BackLogComponent, TaskComponent, TaskEditComponent, NewProject],
  providers: [TasksListService, TaskService, ProjectsService, Project],
  bootstrap: [AppComponent]
})
export class AppModule { }
