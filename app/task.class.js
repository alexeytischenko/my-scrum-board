System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Task;
    return {
        setters:[],
        execute: function() {
            Task = (function () {
                function Task(id, name, project, estimate, description, status, sortnum, created, updated, attachments, comments, worklog) {
                    this.id = id;
                    this.name = name;
                    this.project = project;
                    this.estimate = estimate;
                    this.description = description;
                    this.status = status;
                    this.sortnum = sortnum;
                    this.created = created;
                    this.updated = updated;
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
