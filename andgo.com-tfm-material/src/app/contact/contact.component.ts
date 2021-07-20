import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TFMApiService } from '../services/tfm-api.service';
import { SeoService } from '../services/seo.service';
import { Configuration } from '../app.configuration';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public enquiry: any = {};
  public message: any = {};
  public status : string = "Submit Message";

  constructor(private _config: Configuration, private seoService: SeoService, private router: Router, private _service: TFMApiService, private route: ActivatedRoute) { }

  ngOnInit() {
  }
   public submitMessage(result){
    this.status = "Sending...";
    
        if (localStorage.getItem(this._service.itinIdentifier)) {
            this._service.getItin(localStorage.getItem(this._service.itinIdentifier)).subscribe(res => {
                if (res && res.content && res.content.itinerary) {
                    this._service.itinGuid(localStorage.getItem(this._service.itinIdentifier));
    
                    this.addMessageToItin(res.content.itinerary.id);
                }
                else {
                    //Create new itinerary
                    let itin : any = {};
                    itin.description = "Message from contact page";
                    itin.emailAddress = this.enquiry.emailAddress;
                    itin.contactNumber = this.enquiry.contactNumber;
                    itin.firstName = this.enquiry.firstName;
                    itin.lastName = this.enquiry.lastName;
              
                    this._service.createItin(itin).subscribe(res => {
                      localStorage.setItem(this._service.itinIdentifier, res.content.itinerary.guid);
                      this._service.itinGuid(res.content.itinerary.guid);
              
                      this.addMessageToItin(res.content.itinerary.id);
                    });
                }
            });
        }
        else {
          let itin : any = {};
          itin.description = "Message from contact page";
          itin.emailAddress = this.enquiry.emailAddress;
          itin.contactNumber = this.enquiry.contactNumber;
          itin.firstName = this.enquiry.firstName;
          itin.lastName = this.enquiry.lastName;
    
          this._service.createItin(itin).subscribe(res => {
            localStorage.setItem(this._service.itinIdentifier, res.content.itinerary.guid);
            this._service.itinGuid(res.content.itinerary.guid);
    
            this.addMessageToItin(res.content.itinerary.id);
          });
        }
    
  }
  addMessageToItin(itinId){
    this.message.content = "";
    this.message.content += "Contact Number: " + this.enquiry.contactNumber + "\n";
    this.message.content += "Comments: " + this.enquiry.comments + "\n";

    this._service.createMessage(this.message).subscribe(res => {
      if (res == null) {
        this.status = "Failed to send - your reference is: " + itinId;
      }
      else {
        this.status = "Thank you - your reference is: " + itinId;
      }

      setTimeout(() => {
          this.status = "Submit Message";
        }, 5000);
    });
  }

  styles: any = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6195a0"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#e6f3d6"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4d2c5"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f4f4"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eaf6f8"
            }
        ]
    }
];
}
