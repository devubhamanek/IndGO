import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TFMApiService } from './services/tfm-api.service';
import { SeoService } from './services/seo.service';
import { Configuration } from './app.configuration';
import { Location } from '@angular/common';

// Declare ga function as ambient
declare var ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public searchString : string;
  public destinations: any;
  private currentRoute: string;
  
  constructor(private _config: Configuration, private seoService: SeoService, private router: Router, private _service: TFMApiService,  private _location: Location) {
    router.events.subscribe((event) => {
      // Send GA tracking on NavigationEnd event. You may wish to add other logic here too or change which event to work with
      if (event instanceof NavigationEnd) {
        // When the route is '/', location.path actually returns ''.
        let newRoute = this._location.path() || '/';
        // If the route has changed, send the new route to analytics.
        if (this.currentRoute != newRoute) {
          if (!_config._dev) {
            //Run tracking code.
            ga('send', 'pageview', newRoute);
          }
          this.currentRoute = newRoute;
        }
      }
    });
  }
  ngOnInit() {
    //Ensure each page scroll to the top when route changes
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        document.body.scrollIntoView()
    });

    this._service.getContents().subscribe(res=>{
      this.destinations = this._service.filterContents(res, 'destination', null);
    });
  }
  public navigateToDestination(alias){
    this.router.navigate(['/destination', alias]);
  }
  public submitSearch(searchString) {
    this.router.navigate(['/search-packages', searchString]);
  }
}
