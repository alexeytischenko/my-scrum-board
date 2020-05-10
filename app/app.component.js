System.register(["@angular/core"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, AppComponent;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            }
        ],
        execute: function () {
            AppComponent = (function () {
                function AppComponent() {
                }
                return AppComponent;
            }());
            AppComponent = __decorate([
                core_1.Component({
                    selector: 'scrum-app',
                    template: "\n    <div class=\"progress\">\n      <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n    </div>\n    <div id=\"topmenu-menu\">\n    <div class=\"topmenu-center\">\n      <div class=\"row\">\n        <div class=\"col-xs-3\">\n          <h4>Scrum Board</h4>\n          <h5 class=\"hidden-xs\">Backlog</h5>\n        </div>\n\n        <div class=\"col-xs-7\">\n            <a [routerLink]=\"['/tasks/edit/', -1]\" class=\"btn btn-primary\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-plus\"></span>\n              <span class=\"hidden-xs\">Create task</span>\n            </a>\n            <a [routerLink]=\"['/']\" class=\"btn btn-default\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-tasks\"></span>\n              <span class=\"hidden-xs\">Show Tasks</span>\n            </a>\n            <a [routerLink]=\"['/projects/']\" class=\"btn btn-default\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-tags\"></span>\n              <span class=\"hidden-xs\">&nbsp;Manage Projects</span>\n            </a>\n        </div>\n        <div class=\"col-xs-2\">\n            User\n        </div>\n      </div>\n    </div>\n    </div>\n    <div class=\"container\" style=\"padding-top:90px;\">\n      <router-outlet></router-outlet>\n    </div>\n  ",
                })
            ], AppComponent);
            exports_1("AppComponent", AppComponent);
        }
    };
});
