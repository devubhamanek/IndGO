import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Configuration } from '../app.configuration';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class TFMApiService {
  private responseVersion: any;
  private responseSites: any;
  private responseContents: any;
  private responsePackages: any;

  public itinIdentifier : string = "";

  public itinGuid$: EventEmitter<string>;

  constructor(private http: Http,private authHttp: AuthHttp, private _config: Configuration, private sanitizer: DomSanitizer) {
    this.itinGuid$ = new EventEmitter<string>();
    this.itinIdentifier = this._config._itinIdentifier;
    // this.getVersion().subscribe(res => {
    //     this.responseVersion = res;
    //     let link = this.getLink(res._links, "sites");
    //     link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);

    //     this.send(link).subscribe(res => {
    //       this.responseSites = res;
    //     });
    // });
  }

  private headers : Headers = new Headers({ 
    'Content-Type': 'application/json', 
    // 'Accept': 'application/json',
    //'Cache-Control':'not-store, no-cache',
    //'Pragma':'no-cache',
    //'Expires': '0'
  });
  private options : RequestOptions = new RequestOptions({ headers: this.headers });
  
  private tfmApiVersion : number = 1;

  public getCookie(name: string) {
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = `${name}=`;
      let c: string;

      for (let i: number = 0; i < caLen; i += 1) {
          c = ca[i].replace(/^\s+/g, '');
          if (c.indexOf(cookieName) == 0) {
              return c.substring(cookieName.length, c.length);
          }
      }
      return '';
  }

  itinGuid(itinGuid){
    this.itinGuid$.emit(itinGuid);
  }

  init() {
  }
  getExtendedDataImage(provider, id) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "extended-data-images");
      link.href = link.href.replace("{provider}", provider);
      link.href = link.href.replace("{id}", id);

      this.send(link).subscribe(res => {
        rs.next(res);
      });
    });

    return rs;
  }
  addSubscriber(content:any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "sites");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);

      this.send(link).subscribe(res => {
        
        let link2 = this.getLink(res.content.filter(x=>x.id == this._config.TFMApiSiteID)[0]._links, "subscribers");
        this.send(link2).subscribe(res => {
          
          let link3 = this.getLink(res._links, "add");
          this.send(link3, content).subscribe(res => {
            
            rs.next(res);
          });
        });
      });
    });

    return rs;
  }
  register(content:any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "profiles");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);

      this.send(link).subscribe(res => {
        
        let link2 = this.getLink(res._links, "add");

        this.send(link2, content).subscribe(res => {
          
          rs.next(res);
        });
      });
    });

    return rs;
  }
  updateProfile(content:any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "profiles");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);

      this.send(link).subscribe(res => {
        let profile = res.content.filter(x=>x.guid == content.guid)[0];
        let link2 = this.getLink(profile._links, "edit");

        this.send(link2, content).subscribe(res => {
          
          rs.next(res);
        });
      });
    });

    return rs;
  }
  login(content:any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "user-login");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);

      this.send(link, content).subscribe(res => {
        rs.next(res);
      });
    });

    return rs;
  }

  


  forgotpassword(content:any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "sites") ;
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
  
      this.send(link, content).subscribe(res => {
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];
        let link = this.getLink(site._links, "profile-forgot-password");
      this.send(link, content).subscribe(res => {
          rs.next(res);
      });
      });
    });

    return rs;
  }

    resetpassword(content:any) {
var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "sites") ;
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
  
      this.send(link, content).subscribe(res => {
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];
        let link = this.getLink(site._links, "profile-reset-password");
 
      this.send(link, content).subscribe(res => {
          rs.next(res);
      });
      });
    });

    return rs;
  }


  getProfile(profileGuid) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "profiles");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);

      this.send(link).subscribe(res => {
        let profile = res.content.filter(x=>x.guid == profileGuid)[0];

        rs.next(profile);
      });
    });

    return rs;
  }
  getSites() {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      if (this.responseSites){
        rs.next(this.responseSites);
      }
      else {
        let link = this.getLink(res._links, "sites");
        link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);

        this.send(link).subscribe(res => {
          this.responseSites = res;
          
          rs.next(this.responseSites);
        });
      }
    });

    return rs;
  }

  getLoggedInUserId(){
    let userId = 0;
    //If user logged in, get id
    if (localStorage.getItem("userId") && !isNaN(Number(localStorage.getItem("userId"))))
      userId = Number(localStorage.getItem("userId"));

    return userId;
  }
  saveSearch(content : any, type) {
    var search:ReplaySubject<any> = new ReplaySubject(1);
    
    content.profileId = this.getLoggedInUserId();
    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "sites");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);

      this.send(link).subscribe(res => {
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "searches");
        this.send(link).subscribe(res => {
          
          let link = null;
          if (type == 5){
            link = this.getLink(res._links, "add-flight-hotel-golf-car");
          }
          else if (type == 6){
            link = this.getLink(res._links, "add-flight-hotel-golf");
          }
          else if (type == 7){
            link = this.getLink(res._links, "add-hotel-golf-car");
          }
          
          if (link) {
            this.send(link, content).subscribe(res => {
              search.next(res);
            });
          }
        });
      });
    });

    return search;
  }
  createItin(content : any) {
    var itin:ReplaySubject<any> = new ReplaySubject(1);

    content.userId = this.getLoggedInUserId();
    this.getSites().subscribe(res => {
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itineraries");
      this.send(link).subscribe(res => {
        let link = this.getLink(res._links, "add");
        this.send(link, content).subscribe(res => {
          itin.next(res);
        });
      });
    });

    return itin;
  }
  getItins(userId) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itineraries");
      this.send(link).subscribe(res => {
        
        let itin = res.content.filter(x=>x.itinerary.profileId == userId);          
        itinRS.next(itin);
      });
    });

    return itinRS;
  }
  getSearches(userId) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "searches");
      this.send(link).subscribe(res => {
        
        let searches = res.content.filter(x=>x.profileId == userId);          
        rs.next(searches);
      });
    });

    return rs;
  }
  getItinFromId(itinId) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itineraries");
      this.send(link).subscribe(res => {
        
        let itin = res.content.filter(x=>x.itinerary.id == itinId)[0];          
        if (itin) {
          let link = this.getLink(itin.itinerary._links, "self");
          this.send(link).subscribe(res => {
            itinRS.next(res);
          });
        }
        else {
          itinRS.next(null);
        }
      });
    });

    return itinRS;
  }
  getItin(itinGuid) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);
    
    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itinerary");
      link.href = link.href.replace("{guid}", itinGuid);
      this.send(link).subscribe(res => {
        if (res && res.content && res.content.itinerary && res.content.itinerary.id){
          itinRS.next(res);
        }
        else {
          localStorage.removeItem(this.itinIdentifier);
          itinRS.next(null);
        }
      });
    });

    return itinRS;
  }
  updateItin(itinGuid, content : any) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    content.profileId = this.getLoggedInUserId();

    this.getSites().subscribe(res=>{
      
    let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

    let link = this.getLink(site._links, "itineraries");
    this.send(link).subscribe(res => {
      let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];
      
      let link = this.getLink(itin.itinerary._links, "edit");
      this.send(link, content).subscribe(res => {
        itinRS.next(res);
      });
    });
    });

    return itinRS;
  }
  getItinItems(itinGuid) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itineraries");
      this.send(link).subscribe(res => {
        let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];
        
        let link = this.getLink(itin.itinerary._links, "items");
        this.send(link).subscribe(res => {
          itinRS.next(res);
        });
      });
    });

    return itinRS;
  }
  addItinItem(itinGuid, content : any) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    content.profileId = this.getLoggedInUserId();
    this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "itineraries");
        this.send(link).subscribe(res => {
          let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];          
          
          let link = this.getLink(itin.itinerary._links, "items");
          this.send(link).subscribe(res => {
            let link = this.getLink(res._links, "add");
            this.send(link, content).subscribe(res => {
              itinRS.next(res);
            });
          });
        });
    });

    return itinRS;
  }
  getItinPax(itinGuid) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "itineraries");
      this.send(link).subscribe(res => {
        let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];
        
        let link = this.getLink(itin.itinerary._links, "persons");
        this.send(link).subscribe(res => {
          itinRS.next(res);
        });
      });
    });

    return itinRS;
  }
  updatePax(pax) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    let link = this.getLink(pax._links, "edit");
    if (link) {
      this.send(link, pax).subscribe(res => {
        itinRS.next(res);
      });
    }
    else {
      itinRS.next(null);
    }

    return itinRS;
  }
  addItinPax(itinGuid, content : any) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "itineraries");
        this.send(link).subscribe(res => {
          let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];          
          
          let link = this.getLink(itin.itinerary._links, "persons");
          this.send(link).subscribe(res => {
            let link = this.getLink(res._links, "add");
            this.send(link, content).subscribe(res => {
              itinRS.next(res);
            });
          });
        });
    });

    return itinRS;
  }
  createMessage(content : any) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    if (localStorage.getItem(this.itinIdentifier)) {
      let itinGuid = localStorage.getItem(this.itinIdentifier);

      this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "itineraries");
        this.send(link).subscribe(res => {
          let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];
          if (itin) {
            let link = this.getLink(itin.itinerary._links, "messages");
            this.send(link).subscribe(res => {
              let link = this.getLink(res._links, "add");
              this.send(link, content).subscribe(res => {
                rs.next(res);
              });
            });
          }
        });
      });
    }
    else {
      rs.next(null);
    }

    return rs;
  }
  submitHubspotForm(formGuid, content) {
    var rs:ReplaySubject<any> = new ReplaySubject(1);

    let finalContent = {
      content:content,
      hsContext:{
        'hutk':this.getCookie("hubspotutk"),
        'ipAddress':'',
        'pageUrl':document.location.href,
        'pageName':document.title
      }
    }

    this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "tools");
        this.send(link).subscribe(res => {
          link = this.getLink(res._links, "hubspot");
          this.send(link).subscribe(res => {
            link = this.getLink(res._links, "form-submit");
            //Replace formGuid in url.
            link.href = link.href.replace("{formGuid}", formGuid);
            this.send(link, finalContent).subscribe(res => {
              rs.next(res);
            });
          });
        });
    });

    return rs;
  }
  prebookItin(itinGuid) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "itineraries");
        this.send(link).subscribe(res => {
          let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];          
          
          let link = this.getLink(itin.itinerary._links, "prebook");
          this.send(link).subscribe(res => {
            itinRS.next(res);
          });
        });
    });

    return itinRS;
  }
  bookItin(itinGuid) {
    var itinRS:ReplaySubject<any> = new ReplaySubject(1);

    this.getSites().subscribe(res=>{
        let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

        let link = this.getLink(site._links, "itineraries");
        this.send(link).subscribe(res => {
          let itin = res.content.filter(x=>x.itinerary.guid == itinGuid)[0];          
          
          let link = this.getLink(itin.itinerary._links, "book");
          this.send(link).subscribe(res => {
            itinRS.next(res);
          });
        });
    });

    return itinRS;
  }
  getLocations(placeName : string) {
    var locations:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      if (!placeName) {
        locations.next(null);
      }
      else {
        let link = this.getLink(res._links, "locations");
        link.href = link.href.replace("{placeName}", placeName);

        this.send(link).subscribe(res => {
          locations.next(res.content.predictions);
        });
      }
    });
    
    return locations;
  }
  getAirports(placeName : string) {
    var locations:ReplaySubject<any> = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      if (!placeName) {
        locations.next(null);
      }
      else {
        let link = this.getLink(res._links, "airports");
        link.href = link.href.replace("{placeName}", placeName);

        this.send(link).subscribe(res => {
          locations.next(res.content.results);
        });
      }
    });

    return locations;
  }
  private responseContentsRS : ReplaySubject<any>;
  private responseContentsRSInit : boolean = false;
  getContents() {
    
    if (!this.responseContentsRS)
      this.responseContentsRS = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "contents");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);

      if (this.responseContents){
        this.responseContentsRS.next(this.responseContents);
        return this.responseContentsRS;
      }
      else if (this.responseContentsRS && this.responseContentsRSInit){
        return this.responseContentsRS;
      }
      else {
        this.responseContentsRSInit = true;

        this.send(link).subscribe(res => {
          this.responseContents = res;
          this.responseContentsRS.next(this.responseContents);

          this.responseContentsRS = null;
          this.responseContentsRSInit = false;
        });
      }
    });

    return this.responseContentsRS;
  }
  filterContents(res, type: string, alias: string = null, tag: string = null, guid: string = null){
    let typeId = 0;
    if (type == 'article')
      typeId = 1;
    if (type == 'destination')
      typeId = 2;
    if (type == 'testimonial')
      typeId = 4;
    if (type == 'page')
      typeId = 5;

    let contents : any;

    contents = res.content.filter(content => content.isActive);
    if (tag != null) {
      contents = res.content.filter(content => content.tags != null && content.tags.toLowerCase().replace(new RegExp(' ', 'g'), "-").includes(tag.toLowerCase().replace(new RegExp(' ', 'g'), "-")));
    }

    if (type != null) {
      contents = contents.filter(content => content.contentTypeID == typeId);          
    }
    else {
      contents = contents.filter(content => content.siteID == this._config.TFMApiSiteID);
    }

    for (var x = 0; x < contents.length; x++){
      contents[x].rawContentShortSafe = this.sanitizer.bypassSecurityTrustHtml(contents[x].rawContentShort);
      contents[x].rawContentSafe = this.sanitizer.bypassSecurityTrustHtml(contents[x].rawContent);

      if (contents[x].images && contents[x].images.length > 0){
        for (var i = 0; i < contents[x].images.length; i++){
          contents[x].images[i].imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.getLink(contents[x].images[i]._links, "view").href);
          contents[x].images[i].imageUrlBg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.getLink(contents[x].images[i]._links, "view").href + ')');
        }

        var featuredImg = contents[x].images.filter(img => img.isFeatured == true);
        if (featuredImg.length > 0) {
          contents[x].imageUrl = featuredImg[0].imageUrl;
          contents[x].imageUrlBg = featuredImg[0].imageUrlBg;
        }
        else {
          contents[x].imageUrl = contents[x].images[0].imageUrl;
          contents[x].imageUrlBg = contents[x].images[0].imageUrlBg;
        }
      }
    }

    //Get the pinned and sortindexed items
    var fixedContent = contents.filter(x=>x.isPinned || x.sortIndex > 0);
    var variableContent = contents.filter(x=>!x.isPinned && !x.sortIndex);
    if (type == 'destination')
      variableContent = this.shuffle(variableContent);

    variableContent.forEach(element => {
      fixedContent.push(element);
    });

    contents = fixedContent;

    if (alias){
      contents = contents.filter(content => content.seo.alias == alias)[0];
    }
    
    if (guid){
      contents = contents.filter(content => content.guid == guid)[0];
    }

    return contents;
  }
  getSearch(guid: string, cbResults: (data) => void) {
    this.getSites().subscribe(res => {
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "searches");
      this.send(link).subscribe(res => {
        var search = res.content.filter(search => search.guid == guid)[0];

        cbResults(search);
      });
    });
  }
  getSearchResults(guid: string, searchType: string, cbQuery: (data) => void, cbResults: (data) => void) {
    this.getSites().subscribe(res => {
      let site = res.content.filter(site => site.id == this._config.TFMApiSiteID)[0];

      let link = this.getLink(site._links, "searches");
      this.send(link).subscribe(res => {
        let linkQuery = this.getLink(res.content.filter(search => search.guid == guid)[0]._links, "query-" + searchType);
        let linkResults = this.getLink(res.content.filter(search => search.guid == guid)[0]._links, "search-results-" + searchType);
        
        this.send(linkQuery).subscribe(res => {
          cbQuery(res);          
          this.send(linkResults).subscribe(res => {
            cbResults(res);
          });
        });
      });
    });
  }
  private responsePackagesRS : ReplaySubject<any>;
  private responsePackagesRSInit : boolean = false;
  getPackages() {
    if (!this.responsePackagesRS)
      this.responsePackagesRS = new ReplaySubject(1);

    this.getVersion().subscribe(res=>{
      let link = this.getLink(res._links, "services-by-type");
      link.href = link.href.replace("{agencyId}", this._config.TFMApiAgencyID);
      link.href = link.href.replace("{siteId}", this._config.TFMApiSiteID);
      link.href = link.href.replace("{serviceType}", "package");

      if (this.responsePackages){
        this.responsePackagesRS.next(this.responsePackages);
        return this.responsePackagesRS;
      }
      else if (this.responsePackagesRS && this.responsePackagesRSInit){
        return this.responsePackagesRS;
      }
      else {
        this.responsePackagesRSInit = true;

        this.send(link).subscribe(res => {
          this.responsePackages = res;
          this.responsePackagesRS.next(this.responsePackages);

          this.responsePackagesRS = null;
          this.responsePackagesRSInit = false;
        });
      }
    });

    return this.responsePackagesRS;
  }
  filterPackages(res, tag: string, onPromo:boolean = false, alias: string = null, onBanner:boolean = false, searchString: string = null){
    let packages : any;
    
    packages = res.content.filter(pkg => pkg.isActive);
    if (tag != null) {
      packages = packages.filter(pkg => pkg.tags != null && pkg.tags.toLowerCase().replace(new RegExp(' ', 'g'), "-").includes(tag.toLowerCase().replace(new RegExp(' ', 'g'), "-")));
    }

    if (onPromo) {
      packages = packages.filter(pkg => pkg.onPromo == true);
    }
    if (onBanner) {
      packages = packages.filter(pkg => pkg.onBanner == true);
    }
    if (searchString) {
      searchString = searchString.replace(/^\s+|\s+$/g,'');
      packages = packages.filter(pkg => 
        (pkg.tags != null && pkg.tags.toLowerCase().includes(searchString.toLowerCase())) || 
        (pkg.name != null && pkg.name.toLowerCase().includes(searchString.toLowerCase())) || 
        (pkg.tagline != null && pkg.tagline.toLowerCase().includes(searchString.toLowerCase())) || 
        (pkg.contentShort != null && pkg.contentShort.toLowerCase().includes(searchString.toLowerCase())) || 
        (pkg.place != null && pkg.place.toLowerCase().includes(searchString.toLowerCase()))
      );
    }
    

    for (var x = 0; x < packages.length; x++){
      packages[x].contentSafe = this.sanitizer.bypassSecurityTrustHtml(packages[x].content);
      packages[x].contentExcludeSafe = this.sanitizer.bypassSecurityTrustHtml(packages[x].contentExclude);
      packages[x].contentIncludeSafe = this.sanitizer.bypassSecurityTrustHtml(packages[x].contentInclude);
      packages[x].contentShortSafe = this.sanitizer.bypassSecurityTrustHtml(packages[x].contentShort);
      packages[x].contentHighlightSafe = this.sanitizer.bypassSecurityTrustHtml(packages[x].contentHighlight);

      if (packages[x].images && packages[x].images.length > 0){
        for (var i = 0; i < packages[x].images.length; i++){
          packages[x].images[i].imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.getLink(packages[x].images[i]._links, "view").href);
          packages[x].images[i].imageUrlBg = this.sanitizer.bypassSecurityTrustStyle('url("' + this.getLink(packages[x].images[i]._links, "view").href + '")');
        }

        var featuredImg = packages[x].images.filter(img => img.isFeatured == true);
        if (featuredImg.length > 0) {
          packages[x].imageUrl = featuredImg[0].imageUrl;
          packages[x].imageUrlBg = featuredImg[0].imageUrlBg;
        }
        else {
          packages[x].imageUrl = packages[x].images[0].imageUrl;
          packages[x].imageUrlBg = packages[x].images[0].imageUrlBg;
        }
      }
      if (packages[x].documents && packages[x].documents.length > 0){
        for (var i = 0; i < packages[x].documents.length; i++){
          packages[x].documents[i].documentUrl = this.sanitizer.bypassSecurityTrustUrl(this.getLink(packages[x].documents[i]._links, "view").href);
        }
      }
    }

    //packages.reverse();

    if (alias){
      packages = packages.filter(pkg => pkg.seo.alias == alias)[0];
    }

    return packages;
  }
  shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
  private responseVersionRS : ReplaySubject<any>;
  getVersion() {
    if (this.responseVersion){
      //this.responseVersionRS = new ReplaySubject(1);
      //this.responseVersionRS.next(this.responseVersion);
      return Observable.of(this.responseVersion);
    }
    else if (this.responseVersionRS){
      return this.responseVersionRS;
    }
    else {
      this.responseVersionRS = new ReplaySubject(1);
      this.send(this._config.TFMApiEntryLink).subscribe(res => {
        this.responseVersion = res.versions.filter(x => x.value == this.tfmApiVersion)[0];
        this.responseVersionRS.next(this.responseVersion);

        this.responseVersionRS = null;
      });
    }

    return this.responseVersionRS;
  }
  getContent(link) {
    if (link.method == "get"){
      return this.http
        .get(link.href, this.options)
        .map(res => res.json());
    }

    return Observable.empty();
  }
  filterAndSend(links, rel, content:any = {}){
    let link = this.getLink(links, rel);

    return this.send(link, content);
  }
  send(link, content:any = {}): Observable<any>{
    
    if (this._config._debug) {
      
      if (link.method != "get"){
        
      }
    }

    if (link.method == "get"){
      return this.http
        .get(link.href, this.options)
        .map(res => <any>res.json());
    }
    else if (link.method == "post") {
      return this.http.
        post(link.href, content, this.options)
        .flatMap(res => {
            if (this._config._debug) {
              
            }

            if (res.headers.get('Location')) {

              var location = res.headers.get('Location');
              return this.http
                .get(location, this.options)
                .map(res => <any>res.json());
            }
            else {

              return Observable.of(res.json());
            }
        });
    }
    else if (link.method == "put") {
      return this.http.
        put(link.href, content, this.options)
        .flatMap(res => {
            if (this._config._debug) {
              
            }

            if (res.url) {
              var location = res.url;
              return this.http
                .get(location, this.options)
                .map(res => <any>res.json());
            }
            else {
              return Observable.of(res.json());
            }
        });
    }
    else if (link.method == "delete") {
      return this.http.delete(link.href, this.options)
        .flatMap(res => {
            if (this._config._debug) {
              
            }
            return Observable.of(new TFMResponse());
        });
    }

    return Observable.of(new TFMResponse());
  }

  getLink(links, rel) {
    let linkCollection = links.filter(x => x.rel == "curies" ? x.name == rel : x.rel == rel);
    if (linkCollection && linkCollection.length > 0) {
      let link = Object.create(linkCollection[0]);
      return link;
    }

    return null;
  }
}
export class TFMResponse {
  public content: any = {};
  public _links: any[] = ["not init"];

  constructor(){
  }
}