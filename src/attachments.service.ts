import { Injectable } from '@angular/core';

@Injectable()
export class AttachmentsService {

  errorHandler = error => console.error('AttachmentsService error', error);
  fileIcons = ['film', 'music', 'picture', 'compressed', 'list-alt']; //'file'
  fileTypesMap: any = {'jpg': 'picture', 'jpeg': 'picture', 'gif': 'picture', 'bmp': 'picture', 'png': 'picture','mov': 'film', 'avi' : 'film', 'mpeg4' : 'film', 'wav' : 'music', 'aiff' : 'music', 'mp3' : 'music', 'zip' : 'compressed', 'rar' : 'compressed', 'doc' : 'list-alt', 'docx' : 'list-alt', 'rtf' : 'list-alt', 'txt' : 'list-alt', 'pdf' : 'list-alt'};  //, '' : ''



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
                var fileurl = snapshot.downloadURL;//metadata.downloadURLs[0];
                console.log('File available at', fileurl);
                postData = {
                  fileURl: fileurl,
                  name: filedesc,
                  user: 'User',
                  created : Date.now()
                }
                let newAttRef = newattachRef.push();
                newAttRef.set(postData, function(error) {
                  if (!error) resolve(newAttRef.key.toString());
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


  removeAttachment(url: string, taskId: string, commId: string) {
    // remove comment
    console.debug ("AttachmentsService:removeComment(url, taskId, commId)", url, taskId, commId);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/comments/${taskId}/${commId}`);

    return new Promise(function(resolve, reject) {
        taskRef.remove(function(error) {
            if (error) reject(error);
            resolve(true);
          })
        .catch((error)=>reject(error));
    });
  }


  private convertObject(objectedResponse, id) {

    return {
        id : id,
        text: objectedResponse.text,
        user : objectedResponse.user,
        created : objectedResponse.created,
        edited : objectedResponse.edited
    };
  }

}