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
                  <input type="file" id="file" required name="file" placeholder="Add file" class="form-control input-sm {{(checkFileExists)? 'ng-valid' : 'ng-invalid' }}" />
                  <a class="btn btn-warning btn-sm" (click)="editFileId = ''">
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="hidden-xs">Cancel</span>
                  </a>
                  <button class="btn btn-primary btn-sm" type="submit" [disabled]="!checkFileExists">
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
                    <span (click)="openDeleteAttModal(comment.id)" class="glyphicon glyphicon-trash"></span>
                  </span>
                  <div class="commentslist_date">{{comment.created | date:'medium'}} <span *ngIf="comment.edited" style="margin-left:10px;">edited: {{comment.edited | date:'medium'}}</span></div>
                </li>
              </template>  
          </ul-->
    </section>

    <!-- Modal Delete Comment Popup -->
    <div class="modal fade" id="delFileModal" role="dialog">
      <div class="modal-dialog modal-sm">
      
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 style="text-align: center;"><span class="glyphicon glyphicon-fire"></span> Delete the comment?</h4>
          </div>
          <div class="modal-body">
                <button class="btn btn-danger btn-block" (click)="deleteAttachment()"><span class="glyphicon glyphicon-trash"></span> Delete</button>
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
  
  input[type=file].ng-valid, .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
  input[type=file].ng-invalid  {border-left: 5px solid #a94442; /* red */}
  div.alert-danger {height: 40px; padding: 8px 15px; font-size: 12px;}
  `]
})
export class AttachmentsComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";
  attachments = [];
  @Output() setAttachments = new EventEmitter();    // set attachments count value in outter component  
  @Input() taskId : string;
  editFileId: string;                      // id of attachment to be edited
  editFilename: string;
  editFileInput: string;
  deleteFileId: string;                    // id of attachment to be deleted
  loading: boolean;                           // loader status
  

  constructor(private attachmentsService: AttachmentsService) {
    console.info("AttachmentsComponent:constructor");

    this.attachmentsService.errorHandler = error => {
      console.error('Comments component (AttachmentsService) error! ' + error);
      window.alert('An error occurred while processing this page! Try again later.');
    }
    this.loading = false;
    this.clearFields();
  }

  setEditorField(val: any) {
    // sets editor field value, sets file to edit ID
    console.info("AttachmentsComponent:setEditorField(val: any)", val);

    //clear fielda
    this.clearFields();
    (<HTMLInputElement> document.getElementById("file")).value = "";
    //set id (nowdays only -1, option to edit name-description will be added ?)
    this.editFileId = val;
  }

  saveFile() {
    // saves new/update attachment
    console.info("AttachmentsComponent:saveFile()");

    // File or Blob
    var file = (<HTMLInputElement>document.getElementById('file')).files[0];  // cast to <HTMLInputElement> to avoid TypeScript error that there's no such property like "files" 

    this.loading = true;
    this.attachmentsService.saveFile(this.userId, this.taskId, this.editFileId, this.editFilename, file)
      .then(() => this.attachmentsService.getAttachments(this.userId, this.taskId))
      .then((attachments) => { 
        this.setAttachments.emit(attachments);
        setTimeout(() => {
          this.editFileId = '';
          this.loading = false;
        }, 1000);
      })
      .catch((error) => this.attachmentsService.errorHandler(error));
  }


  openDeleteAttModal(val: any) {
    // opens dialog window, sets comment to delete ID 
    console.info("AttachmentsComponent:openDeleteModal(val: any)", val);

    this.deleteFileId = val;
    $('#delFileModal').modal();
  }

  deleteAttachment() {
    // closes dialog window, calls service to delete attachment
    console.info("AttachmentsComponent:deleteAttachment()");

    $('#delFileModal').modal("hide");    //dismiss alert window
    this.loading = true;
    this.attachmentsService.removeAttachment(this.userId, this.taskId, this.deleteFileId)
      .then(() => setTimeout(() => this.loading = false, 1000))                        // reload updated comments list
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  private clearFields () {
    this.editFileId = ''; 
    this.editFilename = '';  
    this.deleteFileId = '';
  }

  get showEditField() {
    if (!this.editFileId || this.editFileId.length ==  0) return false;
    return true;
  }

  get checkFileExists() {

    if ((<HTMLInputElement>document.getElementById('file')).files.length > 0) return true;

    return false;
  }

  ngAfterViewInit() {
    //fire standart event to star the Angular Digest loop -- for input[type=file] validation 
    console.info("AttachmentsComponent:ngAfterViewInit()", this.userId);
    document.getElementById('file').addEventListener('change', function () {
          var e = document.createEvent('HTMLEvents');
          e.initEvent('input', false, true);
          this.dispatchEvent(e);
    }, false); 
      
  }

}
