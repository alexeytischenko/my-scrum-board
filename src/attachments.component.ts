import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { AttachmentsService } from './attachments.service';

@Component({
  selector: 'attachments',
  template: `
    <section>
          <div class="edit_div" [hidden]="!showEditField"> 
            <form (ngSubmit)="saveFile()" novalidate>
                <input type="text" name="name" id="name" [(ngModel)]="editFilename" placeholder="Add short comment or name" class="form-control input-sm">
                <div class="form-inline">
                  <input type="file" id="file" required  name="file" placeholder="Add file" class="form-control input-sm" />
                  <!--div class="alert alert-danger" [hidden]="fileValidation.valid || fileValidation.pristine">File is required</div-->
                  <a class="btn btn-warning btn-sm" (click)="editFileId = ''">
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="hidden-xs">Cancel</span>
                  </a>
                  <button class="btn btn-primary btn-sm" type="submit">
                    <span class="glyphicon glyphicon-ok"></span>
                    <span class="hidden-xs">Save</span>
                  </button>
              </div>
            </form>
          </div>
          <div *ngIf="loading" class="loader"></div>
          <!--ul>
               <template ngFor let-file [ngForOf]="attachments">
                <li id="{{file.id}}" 
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
          </ul-->
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
  .form-inline {margin-top: 10px;}
  
  .ng-valid[required], .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
  .ng-invalid:not(form)  {border-left: 5px solid #a94442; /* red */}
  div.alert-danger {height: 40px; padding: 8px 15px; font-size: 12px;}
  `]
})
export class AttachmentsComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  attachments = [];
  @Output() setCount = new EventEmitter();    // set attachments count value in outter component  
  @Input() taskId : string;
  editFileId: string;                      // id of attachment to be edited
  editFilename: string;
  deleteFileId: string;                    // id of attachment to be deleted
  loading: boolean;                           // loader status
  

  constructor(private attachmentsService: AttachmentsService) {
    console.info("AttachmentsComponent:constructor");

    this.attachmentsService.errorHandler = error => {
      console.error('Comments component (AttachmentsService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }
    this.loading = false;
    this.editFileId = ''; 
    this.editFilename = '';  
    this.deleteFileId = '';
  }

  loadAttachments() {
    //load list of attachments into attachmentsService attachments property 
    console.info("AttachmentsComponent:loadAttachments()");
    
    this.loading = true;
    this.attachmentsService.getAttachments(this.userId, this.taskId)
      .then (() => this.attachments = this.attachmentsService.attachments)
      .then (() => this.setCount.emit(this.attachments.length))
      .then(() => {    
        setTimeout(() => {
          this.loading = false;
          this.editFileId = '';
        }, 1000);  
      })
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  setEditorField(val: any) {
    // sets editor field value, sets file to edit ID
    console.info("AttachmentsComponent:setEditorField(val: any)", val);

    this.editFileId = val;
  }

  saveFile() {
    // saves new/update attachment
    console.info("AttachmentsComponent:saveFile()");

    this.attachmentsService.saveFile(this.userId, this.taskId, this.editFileId, this.editFilename)
      .then(() => this.loadAttachments())   // reload updated list
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  private handleFileSelect = (evt) => {  //When you need to pass functions around use the new lambda syntax for member variables 
     console.info("AttachmentsComponent:handleFileSelect(evt)", this.userId, this.taskId);

      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      var metadata = {
        'contentType': file.type
      };
      // [START oncomplete]
      var storageRef = firebase.storage().ref();
      storageRef.child(this.userId+'/'+ this.taskId + "/" + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);

      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
  }

  openDeleteModal(val: any) {
    // opens dialog window, sets comment to delete ID 
    console.info("AttachmentsComponent:openDeleteModal(val: any)", val);

    this.deleteFileId = val;
    $('#delFileModal').modal();
  }

  deleteAttachment() {
    // closes dialog window, calls service to delete attachment
    console.info("AttachmentsComponent:deleteAttachment()");

    $('#delFileModal').modal("hide");    //dismiss alert window

    this.attachmentsService.removeAttachment(this.userId, this.taskId, this.deleteFileId)
      .then(() => this.loadAttachments())                        // reload updated comments list
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  get showEditField() {
    if (!this.editFileId || this.editFileId.length ==  0) return false;
    return true;
  }

  ngAfterViewInit() {
  console.info("AttachmentsComponent:ngAfterViewInit()", this.userId);
    //document.getElementById('file').addEventListener('change', this.handleFileSelect, false);
  
}

}
