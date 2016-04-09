import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/item-details/item-details.html'
})
export class ItemDetailsPage {
    selectedItem: any;
    constructor(private nav: NavController, navParams: NavParams) {
        // If we navigate to this page, we have an item available as a nav param
        this.selectedItem = navParams.get('item');
    }
}
