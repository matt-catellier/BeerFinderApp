import {Component}   from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

interface venueInfo {
    id:string; 
    name: string;
    crossStreet:string;
    lat:number;
    lng:number; 
}

@Component({
    providers: [HTTP_PROVIDERS],
})
// This is the service.
export class FourSquareAPI {
    public http:Http;
    public FS:string;
    public venues:venueInfo[];
    constructor(http: Http) {
        this.http=http;
        this.FS = "https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=3SJALTSRALGWUIR3DXB4YM5TGQEOF4Q1DAS4U2GWZ50PFLSM&client_secret=UFONVH33KCQO4U4C2NI5DR02WLJBVMJ2EWNKHDD0Q5MITTOL&v=20160327"
        this.venues = [];
        this.callVenues();
    }
    
    callVenues() {
        this.http.get(this.FS)
        .map(res => res.json())
        .subscribe(
            result => {
                var x = 5;
                console.log(result);
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
    }
    
    getVenues() {
        return this.venues;
    }
}
