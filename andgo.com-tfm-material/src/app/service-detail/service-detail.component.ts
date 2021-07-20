import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TFMApiService } from '../services/tfm-api.service';
import { SeoService } from '../services/seo.service';
import { Configuration } from '../app.configuration';
import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule, MdlOptionComponent  } from '@angular-mdl/select';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';
import { Location } from "@angular/common";
import * as jQuery from 'jquery';
import { MdlDialogReference } from '@angular-mdl/core';
import{MdlDialogComponent} from '@angular-mdl/core';
(<any>window).$ = jQuery;
(<any>window).jQuery = jQuery;
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  private sub: any;
  public routeAlias: string;
  public service: any;
  public serviceImages: any;
  public services: any;

  public enquiry: any = {};
  public message: any = {};
  public status : string = "Submit Enquiry";
  public rateSelected: any;
  
  @ViewChild('enquireDialog') private  enquireDialog: MdlDialogComponent;
public NoOfAdults: any = [
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5', value: '5'},
    {name: '6', value: '6'},
    {name: '7', value: '7'},
    {name: '8', value: '8'},
    {name: '9', value: '9'},    
    {name: '10+', value: '10+'},
  ];
  public NoOfChildren: any = [
    {name: '0', value: '0'},
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5', value: '5'},
    {name: '6', value: '6'},
    {name: '7', value: '7'},
    {name: '8', value: '8'},
    {name: '9', value: '9'},
    {name: '10+', value: '10+'},
  ];
  public NoOfInfants: any = [
    {name: '0', value: '0'},
    {name: '1', value: '1'},
    {name: '2', value: '2'},
    {name: '3', value: '3'},
    {name: '4', value: '4'},
    {name: '5', value: '5'},
    {name: '6', value: '6'},
    {name: '7', value: '7'},
    {name: '8', value: '8'},
    {name: '9', value: '9'},      
    {name: '10+', value: '10+'},
  ];
  constructor(private _config: Configuration, private seoService: SeoService, private router: Router, private _service: TFMApiService, private route: ActivatedRoute,public location:Location) {
  }

  ngOnInit() {
    this.enquiry.adultCount = 2;
    this.enquiry.childCount = 0;
    this.enquiry.infantCount = 0;

    this.sub = this.route.params.subscribe(params => {
        this.routeAlias = params["alias"];

        this._service.getPackages().subscribe(res => {
          this.service = this._service.filterPackages(res, null, false, this.routeAlias);

          this.serviceImages = [];
          this.service.images.forEach(image => {
             this.serviceImages.push({source:image.imageUrl, alt:'', title:''}); 
          });

          // var s = this._service.filterPackages(res, this.service.tags, false, null);
          // s = s.filter(x=>x.seo.alias != this.service.seo.alias);
          // this.services = s;

          this.seoService.setTitle(this.service.seo.title);
          this.seoService.setMetaDescription(this.service.seo.description);
          this.seoService.setMetaKeywords(this.service.seo.keywords);
          this.seoService.setMetaRobots('Index, Follow');

          // this._service.filterAndSend(this.service._links, "location-details").subscribe(res => {
          //     if (res && res.content && res.content.result) {
          //         this.service.location = res.content.result.geometry.location;
          //     }
          // });
          
          // this.service.stopsOnMap = null;          
          // this._service.filterAndSend(this.service._links, "stops").subscribe(res => {
          //     if (res && res.content) {
          //       var stops = res.content;
          //       var stopCount = 0;
          //       stops.forEach(stop => {
          //         this._service.filterAndSend(stop._links, "location-details").subscribe(res => {
          //             if (res && res.content && res.content.result) {
          //                 stop.location = res.content.result.geometry.location;
          //             }

          //             stopCount++;
                      
          //             if (stopCount == stops.length) {
          //               setTimeout(() => {
          //                 var stopIndex = 0;
          //                 this.service.stopsOnMap = [];
          //                 stops.forEach(x => {
          //                   console.log(stopIndex,stops.length - 1,stops[0].location.lat,stop.location.lat,stops[0].location.lng,stop.location.lng);
          //                   if (stopIndex == stops.length - 1 && (stops[0].location.lat == stop.location.lat && stops[0].location.lng == stop.location.lng)) {
          //                     console.log("Stop similar");
          //                     this.service.stopsOnMap.push(x);
          //                   }else {
          //                     this.service.stopsOnMap.push(x);
          //                   }
          //                   stopIndex++;
          //                 });
          //               },1000);
          //             }

          //             this.service.stops = stops;
          //         });
          //       });
          //     }
          // });
        });
    });
  }
  ngOnDestroy() {
      this.sub.unsubscribe();
  }
  public selectRate(rate) {
    this.rateSelected = rate;
    
    this.enquiry.dateFrom = this.rateSelected.startDate;
    this.enquiry.dateTo = this.rateSelected.endDate;

    //Update min/max dates
    // setTimeout(() => {
    //   this.picker.datePicker.startDate = moment(this.rateSelected.startDate);
    //   this.picker.datePicker.endDate = moment(this.rateSelected.endDate);

    //   this.picker.datePicker.minDate = moment(this.rateSelected.startDate);
    //   this.picker.datePicker.maxDate = moment(this.rateSelected.endDate);
    // }, 500);
  }
  
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  public daterange: any = {};
  public options: any = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      autoUpdateInput: true,
      autoApply: true,
      startDate: new Date(),
      endDate: new Date(),
      "opens": "center"
  };
  public selectedDate(value: any) {
      this.enquiry.from = new Date(value.start).toDateString();
      this.enquiry.to = new Date(value.end).toDateString();
      //this.daterange.label = value.label;
      this.daterange.label = this.enquiry.from + " - " + this.enquiry.to;
  }

  public submitEnquiry(result){
    this.status = "Sending...";
    
        if (localStorage.getItem(this._service.itinIdentifier)) {
          this._service.getItin(localStorage.getItem(this._service.itinIdentifier)).subscribe(res => {
            if (res && res.content && res.content.itinerary) {
                this._service.itinGuid(localStorage.getItem(this._service.itinIdentifier));
    
                this.addItemToItin(res.content.itinerary.id, this.rateSelected || this.service);
                this.addMessageToItin(res.content.itinerary.id);
            }
            else {
                //Create new itinerary
                let itin : any = {};
                itin.description = "Package enquiry from website detail page";
                itin.emailAddress = this.enquiry.emailAddress;
                itin.contactNumber = this.enquiry.contactNumber;
                itin.firstName = this.enquiry.firstName;
                itin.lastName = this.enquiry.lastName;
          
                this._service.createItin(itin).subscribe(res => {
                  localStorage.setItem(this._service.itinIdentifier, res.content.itinerary.guid);
                  this._service.itinGuid(res.content.itinerary.guid);
          
                  this.addItemToItin(res.content.itinerary.id, this.rateSelected || this.service);
                  this.addMessageToItin(res.content.itinerary.id);
                });
            }
          });
        }
        else {
          let itin : any = {};
          itin.description = "Package enquiry from website detail page";
          itin.emailAddress = this.enquiry.emailAddress;
          itin.contactNumber = this.enquiry.contactNumber;
          itin.firstName = this.enquiry.firstName;
          itin.lastName = this.enquiry.lastName;
    
          this._service.createItin(itin).subscribe(res => {
            localStorage.setItem(this._service.itinIdentifier, res.content.itinerary.guid);
            this._service.itinGuid(res.content.itinerary.guid);
    
            this.addItemToItin(res.content.itinerary.id, this.rateSelected || this.service);
            this.addMessageToItin(res.content.itinerary.id);
          });
        }    
  }
  addItemToItin(itinId, rate){
    let link = this._service.getLink(rate._links, "add-item");
    if (link) {
      link.href = link.href.replace("{itineraryId}", itinId);

      this._service.send(link, {
        start: this.enquiry.from,
        end: this.enquiry.to,
        adultCount: this.enquiry.adultCount,
        childCount: this.enquiry.childCount,
        infantCount: this.enquiry.infantCount
      }).subscribe(res => {
        if (res == null) {
          this.status = "Failed to add - your reference is: " + itinId;
        }
        else {
          this.status = "Thank you - your reference is: " + itinId;
         
          //this.router.navigate(['/book-itinerary', localStorage.getItem(this._service.itinIdentifier)]);
        }

        setTimeout(() => {
          this.status = "Submit Enquiry";
           this.enquireDialog.close();

           localStorage.removeItem(this._service.itinIdentifier);
           this._service.itinGuid(null);
        }, 5000);
      });
    }
  }
  addMessageToItin(itinId){
    this.message.content = "";
    this.message.content += "Contact Number: " + this.enquiry.contactNumber + "\n";
    this.message.content += "Depart From: " + this.enquiry.departFrom + "\n";
    // this.message.content += "Departure Date: " + this.enquiry.dateFrom + "\n";
    // this.message.content += "Return Date: " + this.enquiry.dateTo + "\n";

    this.message.content += "# of Adults: " + this.enquiry.adultCount + "\n";
    this.message.content += "# of Children: " + this.enquiry.childCount + "\n";
    if (this.enquiry.childCount > 0)
      this.message.content += "Child ages: " + this.enquiry.childAges + "\n";

    this.message.content += "# of Infants: " + this.enquiry.infantCount + "\n";

    this.message.content += "Comments: " + this.enquiry.comments + "\n";

    this._service.createMessage(this.message).subscribe(res => {
      if (res == null) {
        this.status = "Failed to send - your reference is: " + itinId;
      }
      else {
        this.status = "Thank you - your reference is: " + itinId;
        //enquireDialog.close();
        
      }

      setTimeout(() => {
          this.status = "Submit Enquiry";
          this.enquireDialog.close();

          localStorage.removeItem(this._service.itinIdentifier);
          this._service.itinGuid('');
        }, 5000);
    });
  }

  BackToUrl()
  {
      this.location.back();
  }
}
