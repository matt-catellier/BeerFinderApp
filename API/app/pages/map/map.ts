/// <reference path="./google.maps.d.ts" />
import {Page, NavController} from 'ionic-angular';
import { FourSquareAPI } from './../../services/FourSquareAPI';
import { VenueInfo } from './../../models/VenueInfo';

@Page({
  providers: [FourSquareAPI],
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage { 
  public API:FourSquareAPI
  public venues : VenueInfo[];
  public map: any;
  public lat: any;
  public lng: any;
  
  constructor( fsAPI:FourSquareAPI ) {    
    console.log("in constructor")
    this.venues = [];
    // this is working !!! Cool and se easy YAY!
    // fsAPI.getVenues2().subscribe(
    //         result => {
    //             var venueResults = result.response.venues;
    //             for(var i = 0; i < venueResults.length; i++) {
    //                 var venue: VenueInfo = {
    //                     id: venueResults[i].id,
    //                     name: venueResults[i].name,
    //                     crossStreet: venueResults[i].location.crossStreet,
    //                     lat: venueResults[i].location.lat,
    //                     lng: venueResults[i].location.lng,                        
    //                 }             
    //                 this.venues.push(venue);            
    //             }
    //             console.log(this.venues); 
    //             this.createMarkers();               
    //          }
    //      );	
    let options = {timeout: 10000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
        (position) => { 
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          fsAPI.getVenues3(this.lat, this.lng).subscribe(
            result => {
                var venueResults = result.response.venues;
                for(var i = 0; i < venueResults.length; i++) {
                    var venue: VenueInfo = {
                        id: venueResults[i].id,
                        name: venueResults[i].name,
                        crossStreet: venueResults[i].location.crossStreet,
                        lat: venueResults[i].location.lat,
                        lng: venueResults[i].location.lng,                        
                    }             
                    this.venues.push(venue);            
                }
                console.log(this.venues); 
                this.createMarkers();               
             }
          );
      },
      (error) => {
          console.log(error);
      }, options
    );  
        
  }
  
  onPageLoaded() {
      console.log("page loaded");
      this.initializeMap();
      // To add the marker to the map, call setMap();
      // marker.setMap(map);
      // to remove marker.setMap(null);
      // marker = null; 
  }
  
  initializeMap() {
    let options = {timeout: 10000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
        (position) => { 
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          let mapOptions = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          }
 
          this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      },
 
      (error) => {
          console.log(error);
      }, options
    );
    // let latLng = new google.maps.LatLng(40.7,-74);
 
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }
    // var map = document.getElementById("map");
    // console.log(map);
    // this.map = new google.maps.Map(map, mapOptions)
  }
  
  createMarkers() {
      for(var i = 0; i < this.venues.length; i++) {
          var marker = this.createMarker(this.venues[i].name , this.venues[i].lat, this.venues[i].lng)
          marker.setMap(this.map);
      }
  }
  
  createMarker(title, lat, lng) {
    var pos = new google.maps.LatLng(lat,lng);
    var marker = new google.maps.Marker({
        position: pos,
        title: title
    });   
    return marker; 
  }
}
