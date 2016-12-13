import { Injectable } from '@angular/core';

@Injectable()
export class CommentsListService {

  errorHandler = error => console.error('CommentsListService error', error);
  comments = [];
  
  constructor() {
    console.info ("CommentsListService:constructor");
  }

  getComments(url, task) {
    console.info ("CommentsListService:getComments(url, task)", url, task);

    let self = this;
    let commentscount = 0;
    let tasksRef = firebase.database().ref(`${url}/comments/${task}`);
    tasksRef.off(); 
    self.comments = [];

    //retrun Promise to get the backLog
    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("created").once('value', function(snapshot) {
              snapshot.forEach(function(child) {
                  self.comments[commentscount] = self.convertObject(child.val(), child.getKey());
                  commentscount++;
              });

              if (commentscount > 0) resolve(true);
              else reject("No comments yet");
          }); 
    });
  }

  getText(id : any) : string {

    var commentText = '';
    
    if (id != -1) {
      this.comments.forEach(element => {
          if (element.id == id)  commentText = element.text;
      });
    }
    
    return commentText;
  }

 saveComment(url: string, task: any, commentid: any, commenytext: string) {
    console.info("CommentsListService:saveComment(url: string, task: any, commentid: any, commenytext: string)", url, task, commentid, commenytext);

    let postData; 
    let self = this;
    let taskRef = firebase.database().ref(`${url}/comments/${task}`);

    if (commentid == -1) {
      //new comment properties
      return new Promise(function(resolve, reject) {
            postData = {
              text: commenytext,
              user: 'User',
              created : Date.now(),
            }
            let newcommRef = taskRef.push();
            newcommRef.set(postData, function(error) {
              if (error) {
                reject(error);
              } else {
                  console.log("new comment", postData);
                  console.log("newcomRef", newcommRef.key.toString());
                  resolve(newcommRef.key.toString());
              }
            }); 
      });

    } else {
        //existing comment text
        postData = {
          text: commenytext,
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


  removeComment(url: string, taskId: string, commId: string) {
    console.info ("CommentsListService:removeComment(url, taskId, commId)", url, taskId, commId);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/comments/${taskId}/${commId}`);

    //removing task
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
        created : objectedResponse.created
    };
  }

}