import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TFMApiService } from '../services/tfm-api.service';
import { SeoService } from '../services/seo.service';
import { Configuration } from '../app.configuration';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public sections : { value: string, query: string, promo: boolean, count: number }[] = [
    { value: 'Special Offers', query: null, promo: true, count: 0 }
  ];

  public servicesBanner: any;
  public bannerImages: any[];
  public testimonials: any;

  constructor(private _config: Configuration, private seoService: SeoService, private router: Router, private _service: TFMApiService) { }

  public scrollTo(e){
    var element = document.querySelector("#services")
    if (element){
      element.scrollIntoView();
    }
  }
  ngOnInit() {
    this.seoService.setTitle("");      
    this.seoService.setMetaDescription("");      
    this.seoService.setMetaKeywords("");      
    this.seoService.setMetaRobots('Index, Follow');
    
    this._service.getPackages().subscribe(res => {
      this.servicesBanner = this._service.filterPackages(res, null, null, null, true);

      this.bannerImages = [];
      this.servicesBanner.forEach(service => {
        // service.images.forEach(image => {
        //   this.bannerImages.push({service:service, image: image});
        // });
        if (service.images && service.images.length > 0)
          this.bannerImages.push({service:service, image: service.images[0]});
      });
    });

    this._service.getContents().subscribe(res=>{
      var destinations = this._service.filterContents(res, 'destination', null);
      destinations.forEach(destination => {
        this.sections.push({ value: destination.name, query: destination.name, promo: null, count: 0 });
      });

      var t = this._service.filterContents(res, 'testimonial', null);
      this.testimonials = this._service.shuffle(t);
    });
  }
  public navigateToService(e){
    this.router.navigate(['/package', this.bannerImages[e.index].alias]);
  }

  public subscribeStatus : string = "subscribe";
  public subscriber : any = {};
  public addSubscriber() {
    this.subscribeStatus = "submitting...";

    this.subscriber.group = "Homepage";

    this._service.addSubscriber(this.subscriber).subscribe(res => {

      if (res && res.content) {
        if (res.content.id > 0) {
          this.subscribeStatus = "Thank you!";
        }
        else {
          this.subscribeStatus = "Thank you!";//res.content;
        }
      }
      
      this.subscriber = {};
      setTimeout(() => {
        this.subscribeStatus = "subscribe";
      }, 5000);
    });
  }
}
