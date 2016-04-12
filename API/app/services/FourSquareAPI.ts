import {Component}   from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import { Photo } from './../models/Photo';

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
    // API info
    client_id : string = "3SJALTSRALGWUIR3DXB4YM5TGQEOF4Q1DAS4U2GWZ50PFLSM";
    fs_secret : string = "UFONVH33KCQO4U4C2NI5DR02WLJBVMJ2EWNKHDD0Q5MITTOL&v=20160327";
    // urls / endpoints
    searchURL : string = "https://api.foursquare.com/v2/venues/search";
    trendingURL : string = "https://api.foursquare.com/v2/venues/trending";
    exploreURL : string = "https://api.foursquare.com/v2/venues/explore";   
    venuesURL : string =  "https://api.foursquare.com/v2/venues";
    // category IDS
    breweriesID : string = "50327c8591d4c4b30a586d5d";
    
    public http:Http;
    public venues:venueInfo[];
    
    constructor(http: Http) {
        this.http=http;
        this.venues = [];
    }
    //  var URL = this.searchURL + "?categoryId=" + this.breweriesID + " &ll=" + lat + "," + lng + 
    //                 + "&client_id=" + this.client_id + "&client_secret=" + this.client_secret + "&v=" + this.version;
    searchLocalBreweries(lat, lng) {
        // parse results like this
        // var venueResults = result.response.venues;
        var URL = "https://api.foursquare.com/v2/venues/search?categoryId=50327c8591d4c4b30a586d5d&ll=" + lat + "," + lng+ "&client_id=3SJALTSRALGWUIR3DXB4YM5TGQEOF4Q1DAS4U2GWZ50PFLSM&client_secret=UFONVH33KCQO4U4C2NI5DR02WLJBVMJ2EWNKHDD0Q5MITTOL&v=20160327"
        return this.http.get(URL).map(res => res.json());       
    }
    
    exploreLocalBreweries(lat, lng) {
        // parse results like this
        // var venueResults = result.response.groups[0].items;
        var URL = "https://api.foursquare.com/v2/venues/explore?categoryId=50327c8591d4c4b30a586d5d&ll=" + lat + "," + lng+ "&client_id=3SJALTSRALGWUIR3DXB4YM5TGQEOF4Q1DAS4U2GWZ50PFLSM&client_secret=UFONVH33KCQO4U4C2NI5DR02WLJBVMJ2EWNKHDD0Q5MITTOL&v=20160327"
        return this.http.get(URL).map(res => res.json());       
    }
    
    getBreweryPhotos(id) : any {
        // i.e.
        // https://api.foursquare.com/v2/venues/4aa83aacf964a520405020e3/photos
        var URL = this.venuesURL + "/" + id + "/photos?client_id=3SJALTSRALGWUIR3DXB4YM5TGQEOF4Q1DAS4U2GWZ50PFLSM&client_secret=UFONVH33KCQO4U4C2NI5DR02WLJBVMJ2EWNKHDD0Q5MITTOL&v=20160327";
        this.http.get(URL).map(res => res.json()).subscribe(
            result => {
                if(result.response.photos.count > 0) {
                        var photos = result.response.photos.items;
                        var photo = new Photo(photos[0]);
                        console.log(photo);
                        return photo;
                }                   
        });
    }
}
