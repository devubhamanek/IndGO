import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import { TFMApiService } from '../services/tfm-api.service';
import {SeoService} from '../services/seo.service';

import { Configuration } from '../app.configuration';
import { ServiceListComponent } from '../partial/service-list/service-list.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  private sub: any;
  public routeAlias: string;
  public content: any;
  public type: string = "";
  public packages: any = null;
  public guid: string;

  @ViewChild("appServiceList")
  private appServiceList : ServiceListComponent;

  constructor(public _config: Configuration, private seoService: SeoService, private route: ActivatedRoute, private location:Location, private _service: TFMApiService) {
    this.route.data.subscribe(data => {
        this.type = data["type"];
        if (data["guid"])
          this.guid = data["guid"];
    });
  }

  ngOnInit() {
    this.content = null;

    this.sub = this.route.params.subscribe(params => {
      if (params["alias"])
        this.routeAlias = params["alias"];

      var type = this.type;
      if (type == "blog")
        type="article";

      this._service.getContents().subscribe(res=>{
        this.content = this._service.filterContents(res, type, this.routeAlias, null, this.guid);
        this.content.url = window.location.href;

        if (this.content.seo){
          this.seoService.setTitle(this.content.seo.title);
          this.seoService.setMetaDescription(this.content.seo.description);
          this.seoService.setMetaKeywords(this.content.seo.keywords);
        }
        this.seoService.setMetaRobots('Index, Follow');

        if (this.appServiceList)
          this.appServiceList.refresh(null, this.content.name, null, null);
      });
    });
  }
}
