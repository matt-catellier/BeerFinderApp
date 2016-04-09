/// <reference path="./google.maps.d.ts" />
import {Page, NavController} from 'ionic-angular';
 
@Page({
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage { 
  map: any;
  constructor() {    
    console.log("in constructor")
  }
  
  onPageLoaded() {
      console.log("page loaded");
      this.initializeMap();
  }
  
  initializeMap() {
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    var map = document.getElementById("map");
    console.log(map);
    this.map = new google.maps.Map(map, mapOptions)
  }
}
