System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'scrum-app',
                        template: "\n    <div id=\"jquery-script-menu\">\n    <div class=\"jquery-script-center\">\n      <div class=\"row\">\n        <div class=\"col-xs-3\">\n          <h1>Scrum Board</h1>\n          <h2 class=\"hidden-xs\">Backlog</h2>\n        </div>\n        <div class=\"col-xs-1\">\n            <div class=\"row progress\">\n                <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\"\n                aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n          </div>\n        </div>\n        <div class=\"col-xs-8\">\n            <a [routerLink]=\"['/tasks/edit/', -1]\" class=\"btn btn-primary\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-plus\"></span>\n              <span class=\"hidden-xs\">Create task</span>\n            </a>\n            <a [routerLink]=\"['/']\" class=\"btn btn-primary\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-th-list\"></span>\n              <span class=\"hidden-xs\">Show Tasks</span>\n            </a>\n            <a [routerLink]=\"['/projects/']\" class=\"btn btn-primary\" style=\"float: right;margin:5px;\">\n              <span class=\"glyphicon glyphicon-tags\"></span>\n              <span class=\"hidden-xs\">Manage Projects</span>\n            </a>\n        </div>\n      </div>\n    </div>\n    </div>\n    <div class=\"container\" style=\"margin-top:90px;\">\n      <router-outlet></router-outlet>\n    </div>\n  ",
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
