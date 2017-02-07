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
          <ul>
               <template ngFor let-file [ngForOf]="attachments">
                <li id="{{file.id}}" 
                      onmouseOver="$(this).find('div.comment_context_menu').show();"
                      onmouseOut="$(this).find('div.comment_context_menu').hide();"
                >
                  <div class="media">
                    <div class="media-left">
                      <a href='{{file.downloadUrl}}' id='link_{{file.id}}' target='_blank' class="gl_display">
                        <img src="{{file.downloadUrl}}" class="icn_img_display" *ngIf="isImage(file.type)">
                        <span class="glyphicon glyphicon-file" *ngIf="!isImage(file.type)"></span>
                      </a>
                      <div class="comment_context_menu">
                        <span (click)="openDeleteAttModal(file.id)" class="glyphicon glyphicon-trash" alt="Delete attachment" title="Delete attachment"></span>
                        <a href="{{file.downloadUrl}}" target="_blank" id="new_window_{{file.id}}" [hidden]="!isImage(file.type)" alt="Open in a new window" title="Open in a new window">
                          <span class="glyphicon glyphicon-new-window"></span>
                        </a>
                        <a href="{{file.downloadUrl}}" target="_blank" id="download_{{file.id}}" [hidden]="isImage(file.type)" alt="Download" title="Download">
                          <span class="glyphicon glyphicon-cloud-download"></span>
                        </a>
                      </div>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">{{file.name}}</h5>
                      <span class="commentslist_date">{{file.created | date:'medium'}}</span>
                      <div class="commentslist_date">{{file.size}} bytes</div>                  
                      <div class="commentslist_date">@{{file.user}}</div>
                    </div>
                  </div>
                </li>
              </template>  
          </ul>
    </section>

    <!-- Modal Delete Comment Popup -->
    <div class="modal fade" id="delFileModal" role="dialog">
      <div class="modal-dialog modal-sm">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 style="text-align: center;"><span class="glyphicon glyphicon-fire"></span> Delete the attachment?</h4>
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
  li {margin-bottom: 10px; min-height: 80px;}
  .commentslist_username {color:#284289;}
  .commentslist_date { color: #999; font-style: italic; font-size:11px;}
  .edit_div {width: 80%; padding: 20px 0px 20px 40px;}
  .comment_context_menu {display:none; margin: 5px 2px;}
  .comment_context_menu span {cursor: pointer; color: #999;}
  .modal-dialog {margin: 100px auto!important;}
  .modal-header {padding:25px 30px;}
  .modal-body {padding:40px 50px;}
  .form-inline {margin-top: 10px;}
  a.gl_display, a.gl_display:hover  {text-decoration: none;}
  a.gl_display span {font-size: 40px; color: #cccccc; margin-right:10px; text-decoration: none;}
  .icn_img_display {width:50px; height:50px;}
  
  input[type=file].ng-valid, .ng-valid.required  { border-left: 5px solid #42A948; /* green */}
  input[type=file].ng-invalid  {border-left: 5px solid #a94442; /* red */}
  div.alert-danger {height: 40px; padding: 8px 15px; font-size: 12px;}
  `]
})
export class AttachmentsComponent {

  userId = "mSmxxvKkt4ei6nL80Krmt9R0m983";

  @Output() setAttachments = new EventEmitter();    // set attachments count value in outter component  
  @Input() taskId : string;
  @Input()attachments : any;
  editFileId: string;                               // id of attachment to be edited
  editFilename: string;
  editFileInput: string;
  deleteFileId: string;                             // id of attachment to be deleted
  loading: boolean;                                 // loader status


  constructor(private attachmentsService: AttachmentsService) {
    console.info("AttachmentsComponent:constructor");

    this.attachmentsService.errorHandler = error => {
      console.error('AttachmentsComponent (AttachmentsService) error! ' + error);
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
      .then((attachment) => {
        this.attachments.push(attachment);
        this.setAttachments.emit(this.attachments);
        setTimeout(() => {
          this.editFileId = '';
          this.loading = false;
          //this.getSingleIconNLink(this.attachments[this.attachments.length-1]); //passing last (just created) element
        }, 1000);
      })
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  openDeleteAttModal(val: any) {
    // opens dialog window, sets comment to delete ID 
    console.info("AttachmentsComponent:openDeleteAttModal(val: any)", val);

    this.deleteFileId = val;
    $('#delFileModal').modal();
  }

  deleteAttachment() {
    // closes dialog window, calls service to delete attachment
    console.info("AttachmentsComponent:deleteAttachment()");

    $('#delFileModal').modal("hide");    //dismiss alert window
    this.loading = true;
    this.attachmentsService.removeAttachment(this.userId, this.taskId, this.deleteFileId)
      .then(() => {
        for (let i = 0; i < this.attachments.length; i++) {
          if (this.attachments[i] && this.attachments[i].id == this.deleteFileId)
            this.attachments.splice(i, 1);
        }
      })
      .then(() => setTimeout(() => this.loading = false, 1000))
      .catch((error) => this.attachmentsService.errorHandler(error));
  }

  private isImage(tp) : boolean {
    //checks if this attachmnent typr should be considered as an image
    if (this.attachmentsService.imgIcons.indexOf(tp) > -1)  return true;
    return false;
  }

  private clearFields () {
    //clear new attachment form
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
    console.info("AttachmentsComponent:ngAfterViewInit()", this.userId); 

    //fire standart event to start the Angular Digest loop -- for input[type=file] validation 
    document.getElementById('file').addEventListener('change', function () {
          var e = document.createEvent('HTMLEvents');
          e.initEvent('input', false, true);
          this.dispatchEvent(e);
    }, false); 
      
  }

}
