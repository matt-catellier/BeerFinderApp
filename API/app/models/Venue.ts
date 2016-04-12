import {Injectable} from 'angular2/core';
import { Photo } from './Photo';
@Injectable()

export class Venue {
    // info
    id:string; 
    name: string;
    phone: string;
    formattedPhone: string;
    category: string;
    
    // location
    crossStreet:string;
    address:string;
    city: string;
    region: string;
    country: string;
    lat:number;
    lng:number; 
    distance: any;
    
    // photos
    photos: Photo;
    // specials
    specials: any;
    
    constructor(venue) {
        // info
        this.id = venue.id;
        this.name = venue.name;
        this.phone = venue.contact.phone;
        this.formattedPhone = venue.contact.formattedPhone;
        this.category = venue.categories.name;
        //location
        this.crossStreet = venue.location.crossStreet;       
        this.address = venue.location.formattedAddress[0];
        this.city = venue.location.city;
        this.region = venue.location.formattedAddress[1];
        this.country = venue.location.country;
        this.lat = venue.location.lat;
        this.lng = venue.location.lng;
        // specials
        if(venue.specials.count > 0) {
            this.specials = true;
        }
    }
    
    public setDistance(distance) {
        this.distance = distance;
    }
    
    public setPhoto(photo) {
        this.photos = photo;
    }
}