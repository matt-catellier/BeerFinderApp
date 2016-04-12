import {Page, NavController, NavParams} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Component} from 'angular2/core';
// pipes
import { FilterPipe } from './../../pipes/filter-pipe';
import { OrderByPipe } from './../../pipes/orderby-pipe';
// pages
import {ItemDetailsPage} from './../item-details/item-details';
// services
import { FourSquareAPI } from './../../services/FourSquareAPI';
// models
import { Venue } from './../../models/Venue';
import { Photo } from './../../models/Photo';

@Page({
    providers: [FourSquareAPI],
    templateUrl: 'build/pages/home/home.html',
    pipes: [ FilterPipe, OrderByPipe ]
})

export class HomePage { 
    public title = 'Four Square DEMO';
    public API:FourSquareAPI
    public venues:Venue[];
    public photos:Photo[];
    public searchTerm:string;
    public lat: any;
    public lng: any;
    
    public currentPos: any;
    
    constructor(private nav:NavController, navParams:NavParams, fsAPI:FourSquareAPI) {
        this.API = fsAPI;  
        this.venues = [];      
        this.photos = [];
        let options = {timeout: 10000, enableHighAccuracy: true};
        navigator.geolocation.getCurrentPosition(
            (position) => {                 
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                var currentPos = new google.maps.LatLng(this.lat, this.lng);
                fsAPI.searchLocalBreweries(this.lat, this.lng).subscribe(
                    result => {                     
                        var venueResults = result.response.venues;
                        // works, but delayed , majorly delayed.
                        // var photo = fsAPI.getBreweryPhotos(venueResults[0].venue.id);
                        for(var i = 0; i < venueResults.length; i++) {
                            var venue = new Venue(venueResults[i]);  
                                    
                            this.venues.push(venue);           
                        }
                       console.log(this.venues);                       
                    }) // closes. subscribe   
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
    
    alphaASC() {
        this.venues.sort(function(a,b) {
           if(a.name < b.name) return -1;
           if(a.name > b.name) return 1;
           return 0; 
        });
    }  
    
    alphaDESC() {
        this.venues = this.venues.sort(function(a,b) {
           if(a.name > b.name) return -1;
           if(a.name < b.name) return 1;
           return 0; 
        });
    } 
    // this is not working properly
    locationClosest() {
        let currentPos = new google.maps.LatLng(this.lat, this.lng);
        this.venues = this.venues.sort(function(a,b) {
       
            var aPos = new google.maps.LatLng(a.lat, a.lng);
            var bPos = new google.maps.LatLng(b.lat, b.lng);
            
            var aDiff = calculateDistance(currentPos, aPos);
            var bDiff = calculateDistance(currentPos, bPos);
            console.log();
            console.log("---------");
            console.log(a.name + " - " + aDiff + ", " + b.name + " - " + bDiff);
                       
            if(aDiff > bDiff) {
                console.log(a.name + " FARTHER");
                return 1;
            }
            if(aDiff < bDiff) {
                console.log( b.name + " FARTHER");
                return -1;
            }
            return 0; 
            });
    }  
    
    
}
//calculates distance between two points in km's
function calculateDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}