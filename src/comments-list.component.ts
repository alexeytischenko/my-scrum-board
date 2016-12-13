import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
// import { Task } from './task.class';
import { CommentsListService } from './comments-list.service';


@Component({
  selector: 'add-edit-comment',
  template: `
    <section>
          <div *ngIf="loading" class="loader"></div>
          <div class="edit_div" [hidden]="!showEditField">
            <textarea name="commentBody" id="commentBody" class="form-control input-sm" style="margin-bottom:10px;" [(ngModel)]="commentBody" rows="2"></textarea>
            <button class="btn btn-warning btn-sm" (click)="editComment = ''">
              <span class="glyphicon glyphicon-remove"></span>
              <span class="hidden-xs">Cancel</span>
            </button>
            <button class="btn btn-primary btn-sm" (click)="saveComment()">
              <span class="glyphicon glyphicon-ok"></span>
              <span class="hidden-xs">Save</span>
            </button>
          </div>
          <ul [hidden]="!openComments || loading">
               <template ngFor let-comment [ngForOf]="comments">
                <li id="{{comment.id}}" 
                      onmouseOver="$(this).find('span.comment_context_menu').show();"
                      onmouseOut="$(this).find('span.comment_context_menu').hide();"
                >
                  <span class="glyphicon glyphicon-user"></span>
                  <span class="commentslist_username">{{comment.user}}</span>
                  <span class="commentslist_text">{{comment.text}}</span> 
                  <span class="comment_context_menu">
                    <span (click)="setEditorField(comment.id)" class="glyphicon glyphicon-pencil"></span>
                    <span (click)="openDeleteModal(comment.id)" class="glyphicon glyphicon-trash"></span>
                  </span>
                  <div class="commentslist_date">{{comment.created | date:'medium'}}</div>
                </li>
              </template>  
          </ul>
    </section>

    <!-- Modal Delete Comment Popup -->
    <div class="modal fade" id="delCommentModal" role="dialog">
      <div class="modal-dialog modal-sm">
      
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 style="text-align: center;"><span class="glyphicon glyphicon-fire"></span> Delete the comment?</h4>
          </div>
          <div class="modal-body">
                <button class="btn btn-danger btn-block" (click)="deleteComment()"><span class="glyphicon glyphicon-trash"></span> Delete</button>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles : [`
  .loader {margin: 0 auto;} 
  ul {list-style: none;}
  li {margin-bottom: 10px;}
  .commentslist_username {color:#284289; margin: 0 10px;}
  li .glyphicon-user{border: 1px solid #F2F2F2; padding: 5px 5px 3px 5px;}
  .commentslist_date { color: #999; font-style: italic;}
  .edit_div {width: 80%; padding: 20px 0px 20px 40px;}
  .comment_context_menu {display:none; margin-left: 10px;}
  .comment_context_menu span {cursor: pointer; color: #999;}
  .modal-dialog {margin: 100px auto!important;}
  .modal-header {padding:25px 30px;}
  .modal-body {padding:40px 50px;}
  `]
})
export class CommentsListComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  comments = [];
  @Input() taskId : string;
  @Input() openComments: boolean;
  @Input() editComment: string;
  @Output() setCount = new EventEmitter();
  deleteId: string;
  loading: boolean;
  commentBody: string;


  constructor(private commentsListService: CommentsListService) {
    console.info("CommentsListComponent:constructor");

    this.commentsListService.errorHandler = error => {
      console.error('Comments component (CommentsListService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }
    this.loading = false;
    this.editComment = '';
    this.deleteId = '';
    this.commentBody = '';
  }

  loadComments() {
    //load list of comments into commentsListService commetns property 
    console.info("CommentsListComponent:loadComments()");
    
    this.loading = true;
    this.commentsListService.getComments(this.userId, this.taskId)
      .then ( () => this.comments = this.commentsListService.comments)
      .catch((error)=>this.commentsListService.errorHandler(error))
      .then(()=> {    
        //finally / default     
        this.loading = false;
       });
  }

  setEditorField(val: any) {
    console.info("CommentsListComponent:setEditorField(val: any)", val);

    this.commentBody = this.commentsListService.getText(val); 
    this.editComment = val;
  }


  saveComment() {
    console.info("CommentsListComponent:saveComment()");

    progress_start("red");
    this.commentsListService.saveComment(this.userId, this.taskId, this.editComment, this.commentBody)
      .catch((error)=>this.commentsListService.errorHandler(error))
      .then((newurl)=> {    
        
        progress_end();
        //empty editor field
        this.editComment = '';
        //set count in outer component in case of new comment
        if (newurl.toString().length > 0)
          this.setCount.emit(this.comments.length + 1);
        setTimeout(() => this.loadComments(), 1000);
      });

  }


  openDeleteModal(val: any) {
    console.info("CommentsListComponent:openDeleteModal(val: any)", val);

    this.deleteId = val;
    $('#delCommentModal').modal();
  }

  deleteComment() {
    console.info("CommentsListComponent:deleteComment()");

    //set count in outer component
    this.setCount.emit(this.comments.length - 1);

    //dismiss alert window
    $('#delCommentModal').modal("hide");
    //start red progress
    progress_start("red");

    //service requesdt
    this.commentsListService.removeComment(this.userId, this.taskId, this.deleteId)
      .catch((error)=>this.commentsListService.errorHandler(error))
      .then(()=> {    
        //finally / default  
        progress_end();
        setTimeout(() => this.loadComments(), 1000);
      });
  }

  get showEditField() {
    if (!this.editComment || this.editComment.length ==  0) return false;
    return true;
  }

}
