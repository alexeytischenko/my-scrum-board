import { Injectable } from '@angular/core';

@Injectable()
export class WorkLogService {

  errorHandler = error => console.error('WorkLogService error', error);
  logs = [];
  
  constructor() {
    console.debug ("WorkLogService:constructor");
  }

  getLog(url, task) {
    //retrun Promise to get comments list
    console.debug ("WorkLogService:getLog(url, task)", url, task);

    let self = this;
    let logscount = 0;
    let tasksRef = firebase.database().ref(`${url}/worklog/${task}`);
    tasksRef.off(); 
    self.logs = [];

    return new Promise(function(resolve, reject) {
          tasksRef.orderByChild("dt").once('value')
            .then(function(snapshot) {
              snapshot.forEach(function(child) {
                  self.logs[logscount] = self.convertObject(child.val(), child.getKey());
                  logscount++;
              });
              resolve(logscount);
            })
            .catch((error) => reject(error)); 
    });
  }

  getRecord(id : any) {
    // get record from worklog list
    console.debug("WorkLogService:getRecord(id : any)", id);

    var record = {dt: '', text: '', hours: 0};
    this.logs.forEach(element => {
          if (element.id == id)  {
              record.text = element.text;
              record.hours = element.hours;

              var sdt = new Date(element.dt);
              record.dt = `${sdt.getMonth()+1}/${sdt.getDate()}/${sdt.getFullYear()}`;
          }
    });

    return record;
  }

 getFullLog() {
    // calc sum of all work logs
    console.debug("WorkLogService:getFullLog");

    var flog = 0;
    this.logs.forEach((element) => flog += element.hours);

    return flog;
 }

 saveRecord(url: string, task: any, record: any, recordID: any) {
    // save new/update record
    console.debug("WorkLogService:saveRecord(url: string, task: any, record: any, recordID: string)", url, task, record, recordID);

    let postData; 
    let self = this;
    let taskRef = firebase.database().ref(`${url}/worklog/${task}`);

    if (recordID == -1) {
      //new record properties
      postData = {
          text: record.text,
          hours: record.hours,
          user: 'User',
          dt : Date.parse(record.dt)
      };
      return new Promise(function(resolve, reject) {
            let newcommRef = taskRef.push();
            newcommRef.set(postData, function(error) {
              if (error) reject(error)
              else resolve(newcommRef.key.toString());
            }); 
      });

    } else {
        //existing record properties
        postData = {
            text: record.text,
            hours: record.hours,
            edited: Date.now(),
            dt : Date.parse(record.dt)
        };
        return new Promise(function(resolve, reject) {
            taskRef.child(recordID).update(postData, function(error) {
                if (error) {
                  reject(error);
                } else resolve('');
            }); 
        });
    }
  }

  removeRecord(url: string, taskId: string, recId: string) {
    // remove record
    console.debug ("WorkLogService:removeComment(url, taskId, recId)", url, taskId, recId);

    let self = this;
    let taskRef = firebase.database().ref(`${url}/worklog/${taskId}/${recId}`);

    return new Promise(function(resolve, reject) {
        taskRef.remove(function(error) {
            if (error) reject(error);
            resolve(true);
          })
        .catch((error) => reject(error));
    });
  }

  private convertObject(objectedResponse, id) {
    return {
        id : id,
        text: objectedResponse.text,
        user : objectedResponse.user,
        dt : objectedResponse.dt,
        hours : objectedResponse.hours,
        edited : objectedResponse.edited
    };
  }

}