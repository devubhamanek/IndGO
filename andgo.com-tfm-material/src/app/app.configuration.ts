import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public _local : boolean = false;
    public _debug : boolean = false;
    public _dev : boolean = false;
    public _bookingEngine : boolean = false;
    
    public _itinIdentifier : string = "";
    public _userGuidIdentifier : string = "";
    public _userIdIdentifier : string = "";
    public _tokenIdentifier : string = "";
    
    constructor() {
        if (this._local){
            this.TFMApiEntryLink.href = "http://localhost:64449/entry";
        } 
        else {
            this.TFMApiEntryLink.href = "http://api.travelfind.me/entry";
        }
        this.TFMApiEntryLink.method = "get";

        this._itinIdentifier = "itin" + this.TFMApiAgencyID + "-" + this.TFMApiSiteID;
        this._userGuidIdentifier = "userGuid" + this.TFMApiAgencyID + "-" + this.TFMApiSiteID;
        this._userIdIdentifier = "userId" + this.TFMApiAgencyID + "-" + this.TFMApiSiteID;
        this._tokenIdentifier = "token" + this.TFMApiAgencyID + "-" + this.TFMApiSiteID;
    }

    public TFMApiEntryLink: any = {};
    public TFMApiAgencyID: number = 8;
    public TFMApiSiteID: number = 11;
}