import {Page} from 'ionic-angular';
import {MapPage} from '../map/map';
import {HomePage} from '../home/home';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})

export class TabsPage {
    mapPage: any;
    listPage: any;
  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.mapPage = MapPage;
    this.listPage = HomePage;
  }
}
