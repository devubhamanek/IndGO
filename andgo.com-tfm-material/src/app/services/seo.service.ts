import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Configuration } from '../app.configuration';

@Injectable()

export class SeoService {
 /**
  * Angular 2 Title Service
  */
  private titleService: Title;
  private metaService: Meta;
 /**
  * <head> Element of the HTML document
  */
  private headElement: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private metaDescription: HTMLElement;
  /**
  * <head> Element of the HTML document
  */
  private metaKeywords: HTMLElement;
 /**
  * <head> Element of the HTML document
  */
  private robots: HTMLElement;
  private DOM: any;

 /**
  * Inject the Angular 2 Title Service
  * @param titleService
  */
  constructor(titleService: Title, metaService: Meta, private _config: Configuration){
    this.titleService = titleService;
    this.metaService = metaService;

   /**
    * get the <head> Element
    * @type {any}
    */
    // this.headElement = this.DOM.query('head');
    this.metaDescription = this.metaService.getTag('description');
    this.metaKeywords = this.metaService.getTag('keywords');
    this.robots = this.metaService.getTag('robots');
  }

  toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  public getTitle(): string {
    return this.titleService.getTitle();
  }

  public setTitle(newTitle: string) {
    if (newTitle && newTitle.length > 0){
      this.titleService.setTitle(this.toTitleCase(newTitle) + " - andgo.com");
    }
    else {
      this.titleService.setTitle("andgo.com | Ready-packaged and tailor-made holidays");
    }
  }

  public getMetaDescription(): string {
    return this.metaDescription.getAttribute('content');
  }

  public setMetaDescription(description: string) {
    this.metaService.updateTag({content:description, name:'description'});
    //this.metaDescription.setAttribute('content', description);
  }

  public getMetaKeywords(): string {
    return this.metaKeywords.getAttribute('content');
  }

  public setMetaKeywords(keywords: string) {
    this.metaService.updateTag({content:keywords, name:'keywords'});
    // this.metaKeywords.setAttribute('content', keywords);
  }

  public getMetaRobots(): string {
    return this.robots.getAttribute('content');
  }

  public setMetaRobots(robots: string) {
    if (this._config._dev)
      this.metaService.updateTag({content:'noindex', name:'robots'});
    else
      this.metaService.updateTag({content:robots, name:'robots'});
  }

   /**
    * get the HTML Element when it is in the markup, or create it.
    * @param name
    * @returns {HTMLElement}
    */
    private getOrCreateMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.query('meta[name=' + name + ']');
      if (el === null) {
        el = this.DOM.createElement('meta');
        el.setAttribute('name', name);
        this.headElement.appendChild(el);
      }
      return el;
    }

}