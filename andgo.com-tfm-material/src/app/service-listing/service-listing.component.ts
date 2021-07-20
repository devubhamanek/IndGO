import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TFMApiService } from '../services/tfm-api.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-service-listing',
  templateUrl: './service-listing.component.html',
  styleUrls: ['./service-listing.component.scss']
})
export class ServiceListingComponent implements OnInit {
  public type: string = "";
  public sections : { value: string, query: string, promo: boolean, count: number }[] = [
    // { value: 'Special Offers', query: null, promo: true, count: 0 }
  ];

  constructor(private seoService: SeoService, private _service: TFMApiService, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.type = data["type"];
    });
  }

  ngOnInit() {
    this._service.getContents().subscribe(res=>{
      var destinations = this._service.filterContents(res, 'destination', null);
      destinations.forEach(destination => {
        this.sections.push({ value: destination.name, query: destination.name, promo: null, count: 0 });
      });
    });
  }

}
