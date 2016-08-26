System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Task;
    return {
        setters:[],
        execute: function() {
            Task = (function () {
                function Task(name, project, sortnum, estimate, created, updated, status, description, attachments, comments, worklog) {
                    this.name = name;
                    this.project = project;
                    this.sortnum = sortnum;
                    this.estimate = estimate;
                    this.created = created;
                    this.updated = updated;
                    this.status = status;
                    this.description = description;
                    this.attachments = attachments;
                    this.comments = comments;
                    this.worklog = worklog;
                }
                return Task;
            }());
            exports_1("Task", Task);
        }
    }
});
