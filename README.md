# myScrumBoard

An Angular 2 web application that lets manage your tasks in a scrum manner.
The application use the HTTP Client to make requests and integrate with a REST backend (Firebase).

To work on this project:

* Run `npm install` inside the project folder to download all the dependencies. This only needs to be done once.
* Run `npm run build` to compile the TypeScript code in the `src` folder into ES5 code into the `app` folder.
* Run `npm run serve` to start a local development web server. You can now access the application at [localhost:8080](http://localhost:8080/).


#### database.config.js  file

  // Initialize Firebase\
  var config = {\
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXX",\
    authDomain: "xxxxxx-xxxx.firebaseapp.com",\
    databaseURL: "https://xxxxxx-xxxx.firebaseio.com", \
    storageBucket: "xxxxxx-xxxx.appspot.com",\
  };\
  firebase.initializeApp(config);



#### Compatability:

Array.prototype.indexOf()   >=  IE9 \
Object.keys(obj).length     >=  IE9