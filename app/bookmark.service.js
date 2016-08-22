System.register(['@angular/core', '@angular/http'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var BookmarkService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            BookmarkService = (function () {
                function BookmarkService(http) {
                    this.http = http;
                    this.errorHandler = function (error) { return console.error('BookmarkService error', error); };
                    // private baseUrl = 'https://a2-test-39d02.firebaseio.com';
                    this.baseUrl = 'https://myscrum-f606c.firebaseio.com';
                }
                BookmarkService.prototype.addBookmark = function (bookmark) {
                    var json = JSON.stringify(bookmark);
                    return this.http.post(this.baseUrl + "/tasks.json", json)
                        .toPromise()
                        .catch(this.errorHandler);
                };
                BookmarkService.prototype.getBookmarks = function () {
                    var _this = this;
                    return this.http.get(this.baseUrl + "/tasks.json")
                        .toPromise()
                        .then(function (response) { return _this.convert(response.json()); })
                        .catch(this.errorHandler);
                };
                BookmarkService.prototype.removeBookmark = function (bookmark) {
                    return this.http.delete(this.baseUrl + "/tasks/" + bookmark.id + ".json")
                        .toPromise()
                        .catch(this.errorHandler);
                };
                BookmarkService.prototype.updateBookmark = function (bookmark) {
                    var json = JSON.stringify({
                        title: bookmark.title,
                        url: bookmark.url
                    });
                    return this.http.patch(this.baseUrl + "/tasks/" + bookmark.id + ".json", json)
                        .toPromise()
                        .catch(this.errorHandler);
                };
                BookmarkService.prototype.convert = function (parsedResponse) {
                    return Object.keys(parsedResponse)
                        .map(function (id) { return ({
                        id: id,
                        title: parsedResponse[id].title,
                        url: parsedResponse[id].url
                    }); })
                        .sort(function (a, b) { return a.title.localeCompare(b.title); });
                };
                BookmarkService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], BookmarkService);
                return BookmarkService;
            }());
            exports_1("BookmarkService", BookmarkService);
        }
    }
});
