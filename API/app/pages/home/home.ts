import {Page, NavController, NavParams} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Component} from 'angular2/core';
import { FilterPipe } from './../../pipes/filter-pipe';
import {ItemDetailsPage} from './../item-details/item-details';
import { FourSquareAPI } from './../../services/FourSquareAPI';

interface venueInfo {
    id:string; 
    name: string;
    crossStreet:string;
    lat:number;
    lng:number; 
}

@Page({
    providers: [FourSquareAPI],
    templateUrl: 'build/pages/home/home.html',
    pipes: [ FilterPipe ]
})

export class HomePage { 
    public title = 'Four Square DEMO';
    public API:FourSquareAPI
    public venues:venueInfo[];
    public searchTerm:string;
    public lat: any;
    public lng: any;
    
    constructor(private nav:NavController, navParams:NavParams, fsAPI:FourSquareAPI) {
        this.API = fsAPI;
        
        // this.venues = fsAPI.getVenues();   
        let options = {timeout: 10000, enableHighAccuracy: true};
        navigator.geolocation.getCurrentPosition(
            (position) => {                 
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                fsAPI.getVenues3(this.lat, this.lng).subscribe(
                    result => {
                        this.venues = [];
                        var venueResults = result.response.venues;
                        for(var i = 0; i < venueResults.length; i++) {
                            var venue: venueInfo = {
                                id: venueResults[i].id,
                                name: venueResults[i].name,
                                crossStreet: venueResults[i].location.crossStreet,
                                lat: venueResults[i].location.lat,
                                lng: venueResults[i].location.lng,                        
                            }             
                            this.venues.push(venue);            
                        }
                        console.log(this.venues);              
                    }
            );
        },
        (error) => {
            console.log(error);
        }, options
        );     
    }

    itemTapped(item) {
        this.nav.push(ItemDetailsPage, {
            item: item
        });
    }    
}