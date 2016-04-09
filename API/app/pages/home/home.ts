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
    
    constructor(private nav:NavController, navParams:NavParams, fsAPI:FourSquareAPI) {
        this.API = fsAPI;
        this.venues = fsAPI.getVenues();      
    }

    itemTapped(item) {
        this.nav.push(ItemDetailsPage, {
            item: item
        });
    }

    
    
}