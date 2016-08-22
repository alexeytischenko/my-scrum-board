System.register(['@angular/core', './bookmark.service'], function(exports_1, context_1) {
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
    var core_1, bookmark_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (bookmark_service_1_1) {
                bookmark_service_1 = bookmark_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(bookmarkService) {
                    this.bookmarkService = bookmarkService;
                    this.bookmarks = [];
                    this.editableBookmark = {};
                    this.bookmarkService.errorHandler = function (error) {
                        return window.alert('Oops! The server request failed.');
                    };
                    this.reload();
                }
                AppComponent.prototype.clear = function () {
                    this.editableBookmark = {};
                };
                AppComponent.prototype.edit = function (bookmark) {
                    this.editableBookmark = Object.assign({}, bookmark);
                };
                AppComponent.prototype.remove = function (bookmark) {
                    var _this = this;
                    this.bookmarkService.removeBookmark(bookmark)
                        .then(function () { return _this.reload(); });
                };
                AppComponent.prototype.save = function (bookmark) {
                    var _this = this;
                    if (bookmark.id) {
                        this.bookmarkService.updateBookmark(bookmark)
                            .then(function () { return _this.reload(); });
                    }
                    else {
                        this.bookmarkService.addBookmark(bookmark)
                            .then(function () { return _this.reload(); });
                    }
                    this.clear();
                };
                AppComponent.prototype.reload = function () {
                    var _this = this;
                    return this.bookmarkService.getBookmarks()
                        .then(function (bookmarks) { return _this.bookmarks = bookmarks; });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'bookmark-app',
                        template: "\n    <bookmark-edit [bookmark]=\"editableBookmark\"\n      (save)=\"save($event)\" (clear)=\"clear()\"></bookmark-edit>\n    <bookmark-list [bookmarks]=\"bookmarks\"\n      (edit)=\"edit($event)\" (remove)=\"remove($event)\"></bookmark-list>\n  ",
                    }), 
                    __metadata('design:paramtypes', [bookmark_service_1.BookmarkService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
