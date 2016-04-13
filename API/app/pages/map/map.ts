/// <reference path="./google.maps.d.ts" />
import {Page, NavController, NavParams, MenuController} from 'ionic-angular';
import { FourSquareAPI } from './../../services/FourSquareAPI';
import { Venue } from './../../models/Venue';

// pages
import {ItemDetailsPage} from './../item-details/item-details';

@Page({
  providers: [FourSquareAPI],
  templateUrl: 'build/pages/map/map.html',
})

export class MapPage { 
  public API:FourSquareAPI
  public venues : Venue[];
  public venue : any;
  public map: any;
  public lat: any;
  public lng: any;
  public menu: any;
  
  constructor(private nav:NavController, navParams:NavParams, fsAPI:FourSquareAPI, menu :MenuController ) { 
      
    // for side menu
    this.menu = menu;
        
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
        infowindow.setContent('<div><strong> Your location </strong>');
        var marker = new google.maps.Marker({
          map: map,
          position: latLng,         
        });
        
        autocomplete.addListener('place_changed', function() {
            infowindow.close();
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
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
           
      }, 
      (error) => {
          console.log(error);
      }, options
    );
  }
  
  createMarkers() {
      for(var i = 0; i < this.venues.length; i++) {
          var marker = this.createMarker(this.venues[i])
          marker.setMap(this.map);
      }
  }
  
  createMarker(venue) {
    var pos = new google.maps.LatLng(venue.lat,venue.lng);
    var marker = new google.maps.Marker({
        position: pos,
        title: venue.name,
        icon: "http://google-maps-icons.googlecode.com/files/bar.png"
    });  
    
    var menu = this.menu;
    var page = this;
    marker.addListener('click', function() {     
        createInfoWindow(page, venue); 
        // createClick(page, venue); 
        page.venue = venue;     
        menu.open();    
    }); 
    return marker; 
  }
   
  itemTapped(item) {
        this.nav.push(ItemDetailsPage, {
            item: item
        });
    }  
} // closes class 
  
  function createClick(page, venue) {
    var viewBtn = document.createElement("button");
    //Assign different attributes to the element. 
    viewBtn.type = "button";
    viewBtn.innerText = "View";
    viewBtn.onclick = function() { // Note this is a function
        page.itemTapped(venue);
    };
    var window = document.getElementById("custom-window");
    window.innerHTML = "";
    //Append the element in page (in span).  
    window.appendChild(viewBtn);
  }
  
  // NOTE HOW YOUR SUPPOSED TO DO IT... but it works...
  function createInfoWindow(page, venue) {
    // names row
    var name = document.createElement('td');
    name.innerHTML = "<p>" + venue.name + "</p>"   
    var view = document.createElement('td');
    var viewBtn = createViewBtn(page, venue);
    view.appendChild(viewBtn);
    var nameRow = document.createElement('tr')
    nameRow.appendChild(name);
    nameRow.appendChild(view);
    
    // location row
    var address = document.createElement('td');
    address.innerHTML = "<p>" + venue.address + "</p>"
    var directions = document.createElement('td');
    var directionsBtn = createDirectionsBtn(page, venue);
    directions.appendChild(directionsBtn)      
    var directionsRow = document.createElement('tr')
    directionsRow.appendChild(address);
    directionsRow.appendChild(directions);    
        
    // phone row
    var phone = document.createElement('td');
    phone.innerHTML = "<p>" + venue.formattedPhone  + "</p>"
    var call = document.createElement('td'); 
    var callBtn = createCallBtn(venue);
    call.appendChild(callBtn);
    var phoneRow = document.createElement('tr');
    phoneRow.appendChild(phone);
    phoneRow.appendChild(call);
    
    // add rows to tables
    var table = document.createElement('table');    
    table.appendChild(nameRow);
    table.appendChild(directionsRow);
    table.appendChild(phoneRow);
     
    // add table to sidebar
    var window = document.getElementById("custom-window");
    window.innerHTML = "";
    window.appendChild(createCloseBtn(page));
    window.appendChild(table);
  }
  
  
function createCloseBtn(page) {
    var closeBtn = document.createElement("span");
    //Assign different attributes to the element. 
    closeBtn.innerText = "x";
    closeBtn.className = "closeBtn"
    closeBtn.onclick = function() { // Note this is a function
        page.menu.close();   
    };
    return closeBtn;
}  
  
  
  function createViewBtn(page, venue) {
    var viewBtn = document.createElement("button");
    //Assign different attributes to the element. 
    viewBtn.type = "button";
    viewBtn.innerText = "View";
    viewBtn.onclick = function() { // Note this is a function
        page.itemTapped(venue);
    };
    return viewBtn;
}
  
  function createCallBtn(venue) {
    var callBtn = document.createElement("a");
    //Assign different attributes to the element. 
    callBtn.innerText = "Call";
    callBtn.href = "tel:+" +  venue.phone;
    return callBtn;
}

function createDirectionsBtn(page, venue) {
        
        var directionsBtn = document.createElement("button");
        //Assign different attributes to the element. 
        directionsBtn.type = "button";
        directionsBtn.innerText = "Directions";
        directionsBtn.onclick = function() { // Note this is a function
            if(page.directionsDisplay != null) {
                page.directionsDisplay.setMap(null);    
            } 
            page.menu.close();
            var directionsService = new google.maps.DirectionsService;
            page.directionsDisplay = new google.maps.DirectionsRenderer;
            page.directionsDisplay.setMap(page.map);
            calculateAndDisplayRoute(directionsService, page.directionsDisplay, page, venue);
        };
        return directionsBtn;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, page, venue) {
        let currentPos = new google.maps.LatLng(page.lat, page.lng);
        let targetPos = new google.maps.LatLng(venue.lat, venue.lng);
        directionsService.route({
          origin: currentPos,
          destination: targetPos,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions( { suppressMarkers: true, preserveViewport: true } );
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}
  



