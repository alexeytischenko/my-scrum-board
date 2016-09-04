System.register(['@angular/core', '@angular/platform-browser', '@angular/forms', '@angular/router', '@angular/http', './tasks-list.service', './task.service', './projects.service', './app.component', './task.component', './scrum-board.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_1, forms_1, router_1, http_1, tasks_list_service_1, task_service_1, projects_service_1, app_component_1, task_component_1, scrum_board_component_1;
    var routerModule, AppModule;
    return {
        setters:[
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
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (tasks_list_service_1_1) {
                tasks_list_service_1 = tasks_list_service_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            },
            function (projects_service_1_1) {
                projects_service_1 = projects_service_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (task_component_1_1) {
                task_component_1 = task_component_1_1;
            },
            function (scrum_board_component_1_1) {
                scrum_board_component_1 = scrum_board_component_1_1;
            }],
        execute: function() {
            routerModule = router_1.RouterModule.forRoot([
                {
                    path: 'login',
                    component: scrum_board_component_1.ScrumBoard
                },
                {
                    path: 'tasks',
                    component: scrum_board_component_1.ScrumBoard
                },
                {
                    path: 'tasks/:tasktId',
                    component: task_component_1.TaskComponent
                },
                {
                    path: '',
                    component: scrum_board_component_1.ScrumBoard,
                }
            ]);
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, routerModule],
                        declarations: [app_component_1.AppComponent, scrum_board_component_1.ScrumBoard, task_component_1.TaskComponent],
                        providers: [tasks_list_service_1.TasksListService, task_service_1.TaskService, projects_service_1.ProjectsService],
                        bootstrap: [app_component_1.AppComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            exports_1("AppModule", AppModule);
        }
    }
});
