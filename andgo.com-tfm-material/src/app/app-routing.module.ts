import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

import { ServiceListingComponent } from './service-listing/service-listing.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ContentListingComponent } from './content-listing/content-listing.component';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: ContentComponent, data: {type:'page', guid:'32737c03-933a-4dcc-8444-09893b7bf3f0'} },
  { path: 'terms-and-conditions', component: ContentComponent, data: {type:'page', guid:'984844ce-df18-4e4b-943a-4d8bc2621b53'} },
  { path: 'privacy-policy', component: ContentComponent, data: {type:'page', guid:'e249402e-7774-4e00-b80a-9a195c318745'} },
  //{ path: 'forgot-password', component: ForgotPasswordComponent },
  //{ path: 'reset-password', component: ResetPasswordAppComponent },
  { path: 'blog', component: ContentListingComponent, data: {type:'blog'} },
  { path: 'blog-posts/:tag', component: ContentListingComponent, data: {type:'blog'} },
  { path: 'blog/:alias', component: ContentComponent, data: {type:'blog'} },
  // { path: 'destinations', component: ContentListingComponent, data: {type:'destination'} },
  { path: 'destinations', component: ServiceListingComponent, data: {type:'destination'} },
  { path: 'destination/:alias', component: ContentComponent, data: {type:'destination'} },
  
  //{ path: 'packages/specials-and-promotions', component: ResultAppComponent, data: {type:'package', onPromo:true} },

  //{ path: 'packages/:tag', component: ResultAppComponent, data: {type:'package'} },
  { path: 'package/:alias', component: ServiceDetailComponent, data: {type:'package'} },
  { path: 'search-packages/:search', component: ServiceListingComponent, data: {type:'packages-search'} },
  //{ path: 'search-packages/:search', component: ServicesComponent, data: {type:'packages-search'} },
  
  //{ path: 'search-results/:guid', component: ResultAppComponent, data: {type:'search'} },
  //{ path: 'book-itinerary/:guid', component: BookingAppComponent },
  //{ path: 'confirm-itinerary/:guid', component: ConfirmAppComponent },

  //{ path: 'login', component: LoginAppComponent },
  //{ path: 'profile', component: ProfileAppComponent,canActivate: [AuthGuard] },
  //{ path: 'signup', component: RegistrationAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule { }
