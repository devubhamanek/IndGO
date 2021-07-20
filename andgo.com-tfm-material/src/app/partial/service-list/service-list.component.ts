import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TFMApiService } from '../../services/tfm-api.service';
import { SeoService } from '../../services/seo.service';
import * as jQuery from 'jquery';
(<any>window).$ = jQuery;
(<any>window).jQuery = jQuery;
import { Configuration } from '../../app.configuration';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  
  @Input("query")
  public query : string = null;
  @Input("promo")
  public promo : boolean = null;
  
  @Input("col")
  public col : number = 3;
  @Input("col-tablet")
  public colTablet : number = 4;
  @Input("col-phone")
  public colPhone : number = 4;

  @Output("count")
  public count$: EventEmitter<number> = new EventEmitter<number>();

  public services: any;
  public tempservices:any;
  public type: string = "";
  public searchString: string = "";
public FilterPrice: string = "0";
  public FilterRating: string = "0";
  constructor(public _config: Configuration, private seoService: SeoService, private _service: TFMApiService, private route: ActivatedRoute, private router: Router) {
    this.route.data.subscribe(data => {
      this.type = data["type"];
    });
  } 

 
  ngOnInit() {
    
    if (this.type == 'packages-search') {
      this.route.params.subscribe(params => {
        this.searchString = params["search"] ? params["search"] : null;
        this.query = null;
        this.promo = null;

        this.seoService.setTitle("Search results for " + this.searchString);
        
        this.seoService.setMetaRobots('Index, Follow');

        this.search()
      });
    }
    else {
      this.search()
    }
  }
  private search() {
    
    this._service.getPackages().subscribe(res => {
      this.tempservices = this._service.filterPackages(res, this.query, this.promo, null, null, this.searchString);
      this.services=this.tempservices;

      this.count$.emit(this.services.length);
    });
  }
  public refresh(type, query, searchString, promo){
    
    this.type = type;
    this.query = query;
    this.searchString = searchString;
    this.promo = promo;

    this.search();
  }
  public navigateToService(params){
    
    this.router.navigate(params);
    $(".mdl-layout__content").stop().animate({scrollTop:0},"slow"); 
  }

 
 OnFilterchange(val1,val2,filtertype){ 
   
   let tempservice2:any;
   if(filtertype==1)
   {
     tempservice2=this.tempservices;
     if(val2>0)
     {
       tempservice2 = this.tempservices.filter(country => country.grading == val2);    
     }
    if(val1=="10000")
    {       
           tempservice2 =tempservice2.filter(country => country.rateFrom.sellPrice <= 10000 );    
    }
    else if(val1=="15000")
    {       
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 10000 && country.rateFrom.sellPrice<=15000 );    
    }
    else if(val1=="20000")
    {         
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 15000 && country.rateFrom.sellPrice<=20000 );    
    }
    else if(val1=="25000")
     {           
        tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 20000 && country.rateFrom.sellPrice<=25000 );    
    }
    else if(val1=="30000")
    {
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 25000 && country.rateFrom.sellPrice<=30000 );    
    }
    else if(val1=="35000")
    {               
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 30000 && country.rateFrom.sellPrice<=35000 );    
    }
    else if(val1=="40000")
    {                 
      tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 40000);    
    }
    else
    {
     this.services=tempservice2;
    }
     this.services=tempservice2;
   }
   else if(filtertype==2)
   {
     tempservice2=this.tempservices;
  if(val2>0)
    {
       if(val2=="10000")
    {       
      tempservice2 =tempservice2.filter(country => country.rateFrom.sellPrice <= 10000 );    
    }
    else if(val2=="15000")
    {       
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 10000 && country.rateFrom.sellPrice<=15000 );    
    }
    else if(val2=="20000")
    {         
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 15000 && country.rateFrom.sellPrice<=20000 );    
    }
    else if(val2=="25000")
     {           
        tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 20000 && country.rateFrom.sellPrice<=25000 );    
    }
    else if(val2=="30000")
    {
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 25000 && country.rateFrom.sellPrice<=30000 );    
    }
    else if(val2=="35000")
    {               
       tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 30000 && country.rateFrom.sellPrice<=35000 );    
    }
    else if(val2=="40000")
    {                 
      tempservice2 = tempservice2.filter(country => country.rateFrom.sellPrice >= 40000);    
    }
     }
     if(val1>0)
     {
       tempservice2= tempservice2.filter(country => country.grading == val1);
     }
     this.services=tempservice2;
   }
    
     
  
}
public ResetFilter() {
    this.FilterPrice = "0";
    this.FilterRating = "0";
  this.services=this.tempservices;
  }
}