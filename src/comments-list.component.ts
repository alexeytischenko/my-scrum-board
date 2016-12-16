import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommentsListService } from './comments-list.service';


@Component({
  selector: 'comments',
  template: `
    <section>
          <div class="edit_div" [hidden]="!showEditField">
            <form (ngSubmit)="saveComment()" #editForm="ngForm" novalidate>
              <textarea name="commentBody" id="commentBody" class="form-control input-sm" required #commentValidation="ngModel" [(ngModel)]="commentBody" placeholder="Comment" rows="2"></textarea>
              <div class="alert alert-danger" [hidden]="commentValidation.valid || commentValidation.pristine">Comment is required</div>
              <div class="buttons-block">
                <a class="btn btn-warning btn-sm" (click)="editCommentId = ''">
                  <span class="glyphicon glyphicon-remove"></span>
                  <span class="hidden-xs">Cancel</span>
                </a>
                <button class="btn btn-primary btn-sm" type="submit" [disabled]="!editForm.form.valid">
                  <span class="glyphicon glyphicon-ok"></span>
                  <span class="hidden-xs">Save</span>
                </button>
              </div>
            </form>
          </div>
          <div *ngIf="loading" class="loader"></div>
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
                  <div class="commentslist_date">{{comment.created | date:'medium'}} <span *ngIf="comment.edited" style="margin-left:10px;">edited: {{comment.edited | date:'medium'}}</span></div>
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
  .commentslist_date { color: #999; font-style: italic; font-size:11px;}
  .edit_div {width: 80%; padding: 20px 0px 20px 40px;}
  .comment_context_menu {display:none; margin-left: 10px;}
  .comment_context_menu span {cursor: pointer; color: #999;}
  .modal-dialog {margin: 100px auto!important;}
  .modal-header {padding:25px 30px;}
  .modal-body {padding:40px 50px;}
  .buttons-block {margin-top:10px;}
  
  .ng-valid[required], .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
  .ng-invalid:not(form)  {border-left: 5px solid #a94442; /* red */}
  div.alert-danger {height: 40px; padding: 8px 15px; font-size: 12px;}
  `]
})
export class CommentsListComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  comments = [];
  @Output() setCount = new EventEmitter();    // set comment count value in outter component  
  @Input() taskId : string;
  @Input() openComments: boolean;             // comments list status
  editCommentId: string;                      // id of comment to be edited
  deleteCommentId: string;                    // id of comment to be deleted
  commentBody: string;                        // editor field value
  loading: boolean;                           // loader status
  

  constructor(private commentsListService: CommentsListService) {
    console.info("CommentsListComponent:constructor");

    this.commentsListService.errorHandler = error => {
      console.error('Comments component (CommentsListService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }
    this.loading = false;
    this.editCommentId = '';  
    this.deleteCommentId = '';       
    this.commentBody = '';
  }

  loadComments() {
    //load list of comments into commentsListService commetns property 
    console.info("CommentsListComponent:loadComments()");
    
    this.loading = true;
    this.commentsListService.getComments(this.userId, this.taskId)
      .then (() => this.comments = this.commentsListService.comments)
      .then (() => this.setCount.emit(this.comments.length))
      .then(() => {    
        setTimeout(() => {
          this.loading = false;
          this.editCommentId = '';
        }, 1000);  
      })
      .catch((error) => this.commentsListService.errorHandler(error));
  }

  setEditorField(val: any) {
    // sets editor field value, sets comment to edit ID
    console.info("CommentsListComponent:setEditorField(val: any)", val);

    this.commentBody = this.commentsListService.getText(val); 
    this.editCommentId = val;
  }

  saveComment() {
    // saves new/update comment
    console.info("CommentsListComponent:saveComment()");

    this.commentsListService.saveComment(this.userId, this.taskId, this.editCommentId, this.commentBody)
      .then(() => this.loadComments())   // reload updated comments list
      .catch((error) => this.commentsListService.errorHandler(error));
  }

  openDeleteModal(val: any) {
    // opens dialog window, sets comment to delete ID 
    console.info("CommentsListComponent:openDeleteModal(val: any)", val);

    this.deleteCommentId = val;
    $('#delCommentModal').modal();
  }

  deleteComment() {
    // closes dialog window, calls service to delete comment
    console.info("CommentsListComponent:deleteComment()");

    $('#delCommentModal').modal("hide");    //dismiss alert window

    this.commentsListService.removeComment(this.userId, this.taskId, this.deleteCommentId)
      .then(() => this.loadComments())                        // reload updated comments list
      .catch((error) => this.commentsListService.errorHandler(error));
  }

  get showEditField() {
    if (!this.editCommentId || this.editCommentId.length ==  0) return false;
    return true;
  }

}
