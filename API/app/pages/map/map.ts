/// <reference path="./google.maps.d.ts" />
import {Page, NavController} from 'ionic-angular';
import { FourSquareAPI } from './../../services/FourSquareAPI';
import { Venue } from './../../models/Venue';

@Page({
  providers: [FourSquareAPI],
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage { 
  public API:FourSquareAPI
  public venues : Venue[];
  public map: any;
  public lat: any;
  public lng: any;
  
  constructor( fsAPI:FourSquareAPI ) {    
    console.log("in constructor")
    this.venues = [];
    let options = {timeout: 10000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
        (position) => { 
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            fsAPI.searchLocalBreweries(this.lat, this.lng).subscribe(
                result => {
                    var venueResults = result.response.venues;
                    for(var i = 0; i < venueResults.length; i++) {
                        var venue = new Venue(venueResults[i]);         
                        this.venues.push(venue);            
                    }
                    // console.log(this.venues); 
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
          var input: any =  document.getElementById('pac-input');
            
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);
        autocomplete.setTypes([]);
        
        var infowindow = new google.maps.InfoWindow();   
        var map = this.map;
        
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          position: latLng,         
        });
        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);  // Why 17? Because it looks good.
            }
            
            // reposition ICON
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        });      
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
        title: title,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });   
    return marker; 
  } 
}


