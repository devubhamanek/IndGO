import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TFMApiService } from '../services/tfm-api.service';
import {SeoService} from '../services/seo.service';

import { Configuration } from '../app.configuration';

@Component({
  selector: 'app-content-listing',
  templateUrl: './content-listing.component.html',
  styleUrls: ['./content-listing.component.scss']
})
export class ContentListingComponent implements OnInit {
  public contents: any;
  public type: string = "";
  private sub: any;
  public tag: string;

  constructor(public _config: Configuration, private seoService: SeoService, private route: ActivatedRoute, private _service: TFMApiService) {
    this.route.data.subscribe(data => {
        this.type = data["type"];
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.tag = params["tag"];

      this._service.getContents().subscribe(res=>{
        var type = this.type;
        if (type == "blog")
          type="article";

        this.contents = this._service.filterContents(res, type, null, this.tag);
        
        var title = "";
        if (type == "destination")
          title = "Destinations";
        if (type == "blog")
          title = "Blogs";
        
        this.seoService.setTitle(title);
        this.seoService.setMetaDescription("");
        this.seoService.setMetaKeywords("");
        this.seoService.setMetaRobots('Index, Follow');
      });
    });
  }

}
