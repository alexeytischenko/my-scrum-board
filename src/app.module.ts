import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { TasksListService } from './tasks-list.service';
import { TaskService } from './task.service';
import { Project } from './project.class';
import { ProjectsService } from './projects.service';
import { CommentsListService } from './comments-list.service';
import { CommentsListComponent } from './comments-list.component';
import { AppComponent } from './app.component';
import { TaskComponent } from './task.component';
import { TaskEditComponent } from './task-edit.component';
import { BackLogComponent } from './backlog.component';
import { NewProject } from './new-project.component';
import { EditProject } from './edit-project.component';
import { ProjectsListComponent } from './projects-list.component';


const routerModule = RouterModule.forRoot([
  {
    path: 'login',
    component: BackLogComponent
  },
  {
    path: 'projects',
    component: ProjectsListComponent
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
  declarations: [AppComponent, BackLogComponent, TaskComponent, TaskEditComponent, NewProject, EditProject, ProjectsListComponent, CommentsListComponent],
  providers: [TasksListService, TaskService, ProjectsService, Project, CommentsListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
