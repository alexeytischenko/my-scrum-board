import { Injectable } from '@angular/core';

@Injectable()
export class AttachmentsService {

  errorHandler = error => console.error('AttachmentsService error', error);
  attachments = [];
  
  constructor() {
    console.debug ("AttachmentsService:constructor");
  }

  getAttachments(url, task) {
    //retrun Promise to get comments list
    console.debug ("AttachmentsService:getAttachments(url, task)", url, task);

    let self = this;
    let commentscount = 0;
    let tasksRef = firebase.database().ref(`${url}/backlog/${task}/attachments`);
    tasksRef.off(); 
    self.attachments = [];

    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("created").once('value')
            .then(function(snapshot) {
              snapshot.forEach(function(child) {
                  self.attachments[commentscount] = self.convertObject(child.val(), child.getKey());
                  commentscount++;
              });
              resolve(commentscount);
            })
            .catch((error) => reject(error)); 
    });
  }


 saveFile(url: string, task: any, commentid: any, commenytext: string) {
    // save new/update comment
    console.debug("AttachmentsService:saveComment(url: string, task: any, commentid: any, commenytext: string)", url, task, commentid, commenytext);

    let postData; 
    let self = this;
    let taskRef = firebase.database().ref(`${url}/comments/${task}`);

    if (commentid == -1) {
      //new comment properties
      return new Promise(function(resolve, reject) {
            postData = {
              text: commenytext,
              user: 'User',
              created : Date.now()
            }
            let newcommRef = taskRef.push();
            newcommRef.set(postData, function(error) {
              if (error) reject(error)
              else resolve(newcommRef.key.toString());
            }); 
      });

    } else {
        //existing comment text
        postData = {
          text: commenytext,
          edited : Date.now()
        }

        return new Promise(function(resolve, reject) {
            taskRef.child(commentid).update(postData, function(error) {
                if (error) {
                  console.error('Update failed');
                  reject(error);
                } else {
                  resolve('');
                }
            }); 
        });
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