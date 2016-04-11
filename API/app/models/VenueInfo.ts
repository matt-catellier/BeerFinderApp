import {Injectable} from 'angular2/core';

@Injectable()

export class VenueInfo {
    id:string; 
    name: string;
    crossStreet:string;
    lat:number;
    lng:number; 
}