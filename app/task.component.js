System.register(['@angular/core', '@angular/router', './task.service'], function(exports_1, context_1) {
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
    var core_1, router_1, task_service_1;
    var TaskComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (task_service_1_1) {
                task_service_1 = task_service_1_1;
            }],
        execute: function() {
            TaskComponent = (function () {
                function TaskComponent(route, taskService) {
                    this.route = route;
                    this.taskService = taskService;
                    this.task = {};
                    this.clear = new core_1.EventEmitter();
                    this.save = new core_1.EventEmitter();
                }
                TaskComponent.prototype.onClear = function () {
                    this.clear.emit(null);
                };
                TaskComponent.prototype.onSave = function () {
                    this.save.emit(this.task);
                };
                TaskComponent.prototype.ngOnInit = function () {
                    var self = this;
                    this.paramsSubscription = this.route.params.subscribe(function (params) {
                        progress_start("");
                        var taskRef = firebase.database().ref('/sprint/mSmxxvKkt4ei6nL80Krmt9R0m983/' + params['tasktId']);
                        taskRef.off();
                        taskRef.on('value', function (snapshot) {
                            self.task = snapshot.val();
                            progress_end();
                        });
                        //this.task = snapshot.val();
                        //console.log("task ", this.task);
                    });
                    $(document).ready(function () {
                        $('[data-toggle="popover"]').popover();
                    });
                };
                TaskComponent.prototype.ngOnDestroy = function () {
                    this.paramsSubscription.unsubscribe();
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaskComponent.prototype, "clear", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TaskComponent.prototype, "save", void 0);
                TaskComponent = __decorate([
                    core_1.Component({
                        selector: 'task-panel',
                        template: "\n    <div class=\"panel panel-primary\">\n      <div class=\"panel-body\">\n        <div style=\"float:right;\">\n            <a [routerLink]=\"['/']\" class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-chevron-left\"></span>\n              <span class=\"hidden-xs\">Back</span>\n            </a>\n            <button (click)=\"onEdit(bookmark)\" class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-pencil\"></span>\n              <span class=\"hidden-xs\">Edit</span>\n            </button>\n        </div>\n        <div class=\"panel-body\">\n                <a href=\"javascript:void(0);\" data-toggle=\"popover\" title=\"Help!!!\" data-trigger=\"hover\" data-content=\"You can edit the task title. Click the Edit button\"><span class=\"glyphicon glyphicon-question-sign\"></span></a>\n                <label>{{task.name}}</label>            \n        </div>\n        <div class=\"panel-body\">\n            <div>\n              <label>Estimate</label>\n              {{task.estimate}}h\n            </div>\n            <div>\n                <label>Project</label>\n                <button class=\"btn btn-default btn-xs\" disabled=\"true\">{{task.project}}</button>\n            </div> \n            <div>\n              <label>Status</label>\n              <button class=\"btn btn-xs\" \n                  [class.btn-primary]=\"task.status==='in progress'\" \n                  [class.btn-success]=\"task.status==='resolved'\" \n                  disabled=\"true\">\n                    {{task.status}}\n              </button>\n            </div>  \n        </div>      \n        <div class=\"panel-body\">         \n          <div>\n            <label>Created</label>\n            {{task.created | date:'medium'}}\n          </div>\n          <div>\n            <label>Modified</label>\n            {{task.updated | date:'medium'}}\n          </div>\n        </div>\n        \n        <div class=\"panel-body\"><label>Description</label> {{task.description}}</div>\n\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-file\"></span>\n              <span class=\"hidden-xs\">Add files</span>\n            </button>\n          </div>\n          <div>\n            <label>Attachments</label>\n            There are no attachments\n          </div>\n        </div>\n        <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-comment\"></span>\n              <span class=\"hidden-xs\">Add comment</span>\n            </button>\n          </div>\n          <div>\n            <label>Comments</label>\n            There are no comments\n          </div>       \n      </div>\n      <div class=\"panel-body\">\n          <div style=\"float:right;\">\n            <button class=\"btn btn-default\">\n              <span class=\"glyphicon glyphicon-time\"></span>\n              <span class=\"hidden-xs\">Log work</span>\n            </button>\n          </div>\n          <div>\n            <label>Worklogs</label>\n            There are no worklogs\n          </div>       \n      </div>\n\n\n      <!--div class=\"panel-body\">\n        <input type=\"text\" [(ngModel)]=\"bookmark.title\"\n          placeholder=\"Title\" style=\"width: 25%;\">\n        <input type=\"text\" [(ngModel)]=\"bookmark.url\" \n          placeholder=\"URL\" style=\"width: 50%;\">\n        <button (click)=\"onSave()\" class=\"btn btn-primary\">\n          <span class=\"glyphicon glyphicon-ok\"></span>\n          <span class=\"hidden-xs\">Save</span>\n        </button>\n        <button (click)=\"onClear()\" class=\"btn btn-warning\">\n          <span class=\"glyphicon glyphicon-remove\"></span>\n          <span class=\"hidden-xs\">Clear</span>\n        </button>\n      </div-->\n    </div>\n  ",
                    }), 
                    __metadata('design:paramtypes', [router_1.ActivatedRoute, task_service_1.TaskService])
                ], TaskComponent);
                return TaskComponent;
            }());
            exports_1("TaskComponent", TaskComponent);
        }
    }
});
