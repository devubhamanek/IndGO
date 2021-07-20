import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { Configuration } from './app.configuration';
import { TFMApiService } from './services/tfm-api.service';
import { SeoService } from './services/seo.service';

import { AuthGuard } from './app.auth-guard';
import { AUTH_PROVIDERS, provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { GalleriaModule, CarouselModule } from 'primeng/primeng';
import { RatingModule } from 'ngx-rating';
import { Daterangepicker } from 'ng2-daterangepicker';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { ScrollToModule } from 'ng2-scroll-to-el';

import { ServiceListComponent } from './partial/service-list/service-list.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ContentComponent } from './content/content.component';
import { ServiceListingComponent } from './service-listing/service-listing.component';
import { ContentListingComponent } from './content-listing/content-listing.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
    tokenGetter: (() => localStorage.getItem('token')),
    globalHeaders: [{'Content-Type':'application/json'}],
    noJwtError: true
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    ServiceListComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    TermsComponent,
    PrivacyComponent,
    ServiceDetailComponent,
    ContentComponent,
    ServiceListingComponent,
    ContentListingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    MdlModule, GalleriaModule, CarouselModule,RatingModule,MdlPopoverModule,MdlSelectModule, Daterangepicker,ScrollToModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBgCRj1abJ_xBNWfhgecHPnnDERV7Ul2zw'
    })
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    Configuration, TFMApiService,
    SeoService,AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
