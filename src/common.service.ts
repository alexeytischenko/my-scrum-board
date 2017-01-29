import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  getArrayFromObject(attObject) {
    //parse subtasks object to array
    console.debug ("TaskService:getSubtasksArray(attObect)", attObject);

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
}
