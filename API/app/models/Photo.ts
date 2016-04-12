import {Injectable} from 'angular2/core';

@Injectable()

export class Photo {
    id:string; 
    prefix: string;
    suffix: string;
    size: string;
   
    constructor(photo) {
        this.id = photo.id;
        this.prefix = photo.prefix;
        this.suffix = photo.suffix;
        this.size = photo.width;
    }
}