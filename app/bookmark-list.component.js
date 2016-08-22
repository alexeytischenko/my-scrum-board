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
    var BookmarkListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BookmarkListComponent = (function () {
                function BookmarkListComponent() {
                    this.bookmarks = [];
                    this.edit = new core_1.EventEmitter();
                    this.remove = new core_1.EventEmitter();
                }
                BookmarkListComponent.prototype.onEdit = function (bookmark) {
                    this.edit.emit(bookmark);
                };
                BookmarkListComponent.prototype.onRemove = function (bookmark) {
                    this.remove.emit(bookmark);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BookmarkListComponent.prototype, "bookmarks", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], BookmarkListComponent.prototype, "edit", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], BookmarkListComponent.prototype, "remove", void 0);
                BookmarkListComponent = __decorate([
                    core_1.Component({
                        selector: 'bookmark-list',
                        template: "\n    <div class=\"panel panel-default\">\n      <table class=\"table table-striped\">\n        <tr *ngFor=\"let bookmark of bookmarks\">\n          <td>\n            <a [href]=\"bookmark.url\" target=\"_blank\">{{bookmark.title}}</a>\n          </td>\n          <td class=\"hidden-xs hidden-sm\">{{bookmark.url}}</td>\n          <td>\n            <button (click)=\"onEdit(bookmark)\" class=\"btn btn-primary\">\n              <span class=\"glyphicon glyphicon-pencil\"></span>\n              <span class=\"hidden-xs\">Edit</span>\n            </button>\n            <button (click)=\"onRemove(bookmark)\" class=\"btn btn-danger\">\n              <span class=\"glyphicon glyphicon-trash\"></span>\n              <span class=\"hidden-xs\">Delete</span>\n            </button>\n          </td>\n        </tr>\n      </table>\n    </div>\n  ",
                    }), 
                    __metadata('design:paramtypes', [])
                ], BookmarkListComponent);
                return BookmarkListComponent;
            }());
            exports_1("BookmarkListComponent", BookmarkListComponent);
        }
    }
});
