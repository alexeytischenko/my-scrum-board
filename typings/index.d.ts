/// <reference path="globals/es6-shim/index.d.ts" />
declare var app: {
  environment: string;
};

declare function require(id: string): any;
declare function $(id: any): any;

declare var firebase;

declare function progress_start(color:string): void;
declare function progress_end(): void;