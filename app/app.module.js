System.register(["@angular/core", "@angular/platform-browser", "@angular/forms", "@angular/router", "./common.service", "./tasks-list.service", "./task.service", "./project.class", "./projects.service", "./comments-list.service", "./work-log.service", "./comments-list.component", "./work-log.component", "./attachments.service", "./attachments.component", "./app.component", "./task.component", "./task-edit.component", "./backlog.component", "./new-project.component", "./edit-project.component", "./projects-list.component"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, platform_browser_1, forms_1, router_1, common_service_1, tasks_list_service_1, task_service_1, project_class_1, projects_service_1, comments_list_service_1, work_log_service_1, comments_list_component_1, work_log_component_1, attachments_service_1, attachments_component_1, app_component_1, task_component_1, task_edit_component_1, backlog_component_1, new_project_component_1, edit_project_component_1, projects_list_component_1, routerModule, AppModule;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_service_1_1) {
                common_service_1 = common_service_1_1;
            },
            function (tasks_list_service_1_1) {
                tasks_list_service_1 = tasks_list_service_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (project_class_1_1) {
                project_class_1 = project_class_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (comments_list_service_1_1) {
                comments_list_service_1 = comments_list_service_1_1;
            },
            function (work_log_service_1_1) {
                work_log_service_1 = work_log_service_1_1;
            },
            function (comments_list_component_1_1) {
                comments_list_component_1 = comments_list_component_1_1;
            },
            function (work_log_component_1_1) {
                work_log_component_1 = work_log_component_1_1;
            },
            function (attachments_service_1_1) {
                attachments_service_1 = attachments_service_1_1;
            },
            function (attachments_component_1_1) {
                attachments_component_1 = attachments_component_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (task_component_1_1) {
                task_component_1 = task_component_1_1;
            },
            function (task_edit_component_1_1) {
                task_edit_component_1 = task_edit_component_1_1;
            },
            function (backlog_component_1_1) {
                backlog_component_1 = backlog_component_1_1;
            },
            function (new_project_component_1_1) {
                new_project_component_1 = new_project_component_1_1;
            },
            function (edit_project_component_1_1) {
                edit_project_component_1 = edit_project_component_1_1;
            },
            function (projects_list_component_1_1) {
                projects_list_component_1 = projects_list_component_1_1;
            }
        ],
        execute: function () {
            routerModule = router_1.RouterModule.forRoot([
                {
                    path: 'login',
                    component: backlog_component_1.BackLogComponent
                },
                {
                    path: 'projects',
                    component: projects_list_component_1.ProjectsListComponent
                },
                {
                    path: 'tasks',
                    component: backlog_component_1.BackLogComponent
                },
                {
                    path: 'tasks/:tasktId',
                    component: task_component_1.TaskComponent
                },
                {
                    path: 'tasks/edit/:tasktId',
                    component: task_edit_component_1.TaskEditComponent
                },
                {
                    path: 'tasks/edit/:parentId/:tasktId',
                    component: task_edit_component_1.TaskEditComponent
                },
                {
                    path: '',
                    component: backlog_component_1.BackLogComponent,
                }
            ]);
            AppModule = (function () {
                function AppModule() {
                }
                return AppModule;
            }());
            AppModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, routerModule],
                    declarations: [app_component_1.AppComponent, backlog_component_1.BackLogComponent, task_component_1.TaskComponent, task_edit_component_1.TaskEditComponent, new_project_component_1.NewProject, edit_project_component_1.EditProject, projects_list_component_1.ProjectsListComponent, comments_list_component_1.CommentsListComponent, work_log_component_1.WorkLogComponent, attachments_component_1.AttachmentsComponent],
                    providers: [common_service_1.CommonService, tasks_list_service_1.TasksListService, task_service_1.TaskService, projects_service_1.ProjectsService, project_class_1.Project, comments_list_service_1.CommentsListService, work_log_service_1.WorkLogService, attachments_service_1.AttachmentsService],
                    bootstrap: [app_component_1.AppComponent],
                })
            ], AppModule);
            exports_1("AppModule", AppModule);
        }
    };
});
