import { Injectable } from '@angular/core';

@Injectable()
export class AttachmentsService {

  errorHandler = error => console.error('AttachmentsService error', error);

  imgIcons = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']; 

  //fileTypes = ['application/pdf', 'text/rtf', '', '']; //'', '', '', ''
  fileTypesMap: any = {'application/pdf': 'pdf', 'text/rtf' : 'rtf', 'application/vnd.oasis.opendocument.text' : 'odt', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'docx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'xls'};// '' : '', '' : '', '' : '', '' : ''

// .doc      application/msword
// .dot      application/msword

// .docx     application/vnd.openxmlformats-officedocument.wordprocessingml.document
// .dotx     application/vnd.openxmlformats-officedocument.wordprocessingml.template
// .docm     application/vnd.ms-word.document.macroEnabled.12
// .dotm     application/vnd.ms-word.template.macroEnabled.12

// .xls      application/vnd.ms-excel
// .xlt      application/vnd.ms-excel
// .xla      application/vnd.ms-excel

// .xlsx     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// .xltx     application/vnd.openxmlformats-officedocument.spreadsheetml.template
// .xlsm     application/vnd.ms-excel.sheet.macroEnabled.12
// .xltm     application/vnd.ms-excel.template.macroEnabled.12
// .xlam     application/vnd.ms-excel.addin.macroEnabled.12
// .xlsb     application/vnd.ms-excel.sheet.binary.macroEnabled.12

// .ppt      application/vnd.ms-powerpoint
// .pot      application/vnd.ms-powerpoint
// .pps      application/vnd.ms-powerpoint
// .ppa      application/vnd.ms-powerpoint

// .pptx     application/vnd.openxmlformats-officedocument.presentationml.presentation
// .potx     application/vnd.openxmlformats-officedocument.presentationml.template
// .ppsx     application/vnd.openxmlformats-officedocument.presentationml.slideshow
// .ppam     application/vnd.ms-powerpoint.addin.macroEnabled.12
// .pptm     application/vnd.ms-powerpoint.presentation.macroEnabled.12
// .potm     application/vnd.ms-powerpoint.template.macroEnabled.12
// .ppsm     application/vnd.ms-powerpoint.slideshow.macroEnabled.12

// .mdb      application/vnd.ms-access

  constructor() {
    console.debug ("AttachmentsService:constructor");
  }

  getAttachments(url, taskId) {
    //get task attachments from DB
    console.debug ("AttachmentsService:getAttachments(url, taskId)", url, taskId);

    let self = this;
    let tasksRef = firebase.database().ref(`${url}/backlog/${taskId}/attachments`);
    tasksRef.off(); 

    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("created").once('value')
            .then((snapshot) => resolve(self.getAttachmentsArray(snapshot.val())))
            .catch((error) => reject(error)); 
    });

  }

  getAttachment(url: string, taskId:string, id: string) {
     //get one attachment
    console.debug ("AttachmentsService:getAttachment(url,taskId, id)", url, taskId, id);   

    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/${taskId}/attachments`).child(id);
    taskRef.off(); 

    return new Promise(function(resolve, reject) {
          taskRef.once('value', function(snapshot) {
            if (snapshot.exists()) {

              let att = snapshot.val();
              att.id = id;
              resolve(att);
            }
            else reject("Couldn't get attachment");
          }); 
      }
    );
  }

  getAttachmentsArray(attObject) {
    //parse attachments object to array
    console.debug ("AttachmentsService:getAttachmentsArray(attObect)", attObject);

    var attArray = [];
    var i = 0;

    for (var key in attObject) {
        if (!attObject.hasOwnProperty(key)) {
            continue;
        }
        attObject[key].id = key;
        attArray[i++] = attObject[key];
    }

    return attArray;
   
  }

  getIconsNLinks(url: string, task: string, file: any) {
    // get Icons and links to attached documents in attachment list
    console.debug ("AttachmentsService:getIconsNLinks(url: string, task: string, file: any)", url, task, file);

    let self = this;
    let storageRef = firebase.storage().ref(`${url}/${task}`);

    return new Promise(function(resolve, reject) {
      storageRef.child(file.fileURl)
            .getDownloadURL()
            .then((url) => resolve(url))
            .catch((error) => reject(error));
    });
  }  

  saveFile(url: string, task: any, fileid: any, filedesc: string, file: any ) {
    // save new/update comment
    console.debug("AttachmentsService:saveFile(url: string, task: any, fileid: any, filedesc: string)", url, task, fileid, filedesc, file);

    let postData; 
    let self = this;
    let storageRef = firebase.storage().ref(`${url}/${task}`);
    let newattachRef = firebase.database().ref(`${url}/backlog/${task}/attachments`);

    if (fileid == -1) {
      //new comment properties
      return new Promise(function(resolve, reject) {
          // Create the file metadata
          var metadata = {
            contentType: file.type
          };
          var uploadTask = storageRef
            .child(file.name)
            .put(file, metadata)
            .then(function(snapshot) {
                console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                //var fileurl = snapshot.downloadURL;//metadata.downloadURLs[0];
                //console.log('File available at', fileurl.toString(), `${url}/${task}/${file.name}`);
                postData = {
                  fileURl: file.name,
                  name: filedesc,
                  user: 'User',
                  created : Date.now(),
                  type: file.type,
                  size: snapshot.totalBytes
                }
                let newAttRef = newattachRef.push();
                newAttRef.set(postData, function(error) {
                  if (!error) {
                    postData.id = newAttRef.key.toString();
                    resolve(postData);
                  }
                }); 

            })
            .catch(function(error) {
                //'storage/unauthorized': User doesn't have permission to access the object
                //'storage/unknown': Unknown error occurred, inspect error.serverResponse
                //'storage/canceled': User canceled the upload
                reject(error);
            });

          // // Listen for state changes, errors, and completion of the upload.
          // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          //   function(snapshot) {
          //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //     console.log('Upload is ' + progress + '% done');
          //     console.log('Upload is ' + snapshot.bytesTransferred + ' of ' + snapshot.totalBytes);
          //     // switch (snapshot.state) {
          //     //   case firebase.storage.TaskState.PAUSED: // or 'paused'
          //     //     console.log('Upload is paused');
          //     //     break;
          //     //   case firebase.storage.TaskState.RUNNING: // or 'running'
          //     //     console.log('Upload is running');
          //     //     break;
          //     // }
          //   }, function(error) {


          // }, function() {
          //   // Upload completed successfully, now we can get the download URL
          //   var downloadURL = uploadTask.snapshot.downloadURL;
          //   console.log('Upload is DONE!', downloadURL);
          // });
      });

    } else {
        //existing file name
        // postData = {
        //   text: filename,
        //   edited : Date.now()
        // }

        // return new Promise(function(resolve, reject) {
        //     taskRef.child(fileid).update(postData, function(error) {
        //         if (error) {
        //           console.error('Update failed');
        //           reject(error);
        //         } else {
        //           resolve('');
        //         }
        //     }); 
        // });
    }

  }


  removeAttachment(url: string, taskId: string, attId: string) {
    // remove comment
    console.debug ("AttachmentsService:removeAttachment(url, taskId, attId)", url, taskId, attId);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/backlog/${taskId}/attachments/${attId}`);
    let fileRef = firebase.storage().ref(`${url}/${taskId}`);

    return new Promise(function(resolve, reject) {
        self.getAttachment(url, taskId, attId)
        .then((att : any) => fileRef.child(att.fileURl).delete())
        .then(() => taskRef.remove())
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  private convertObject(objectedResponse, id) {

    return {
        id : id,
        text: objectedResponse.text,
        user : objectedResponse.user,
        created : objectedResponse.created,
        edited : objectedResponse.edited,
        size : objectedResponse.size
    };
  }

}