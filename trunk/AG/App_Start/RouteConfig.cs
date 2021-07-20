using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AG
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Packages", "{category}-packages/{id}", new { controller = "Home", action = "List", category = UrlParameter.Optional, id = UrlParameter.Optional });
            routes.MapRoute("Package", "{category}-package/{id}", new { controller = "Home", action = "Detail", category = UrlParameter.Optional, id = UrlParameter.Optional });
            routes.MapRoute("EnquirySubmit", "enquiry-for-{name}-sent/{id}", new { controller = "Enquiry", action = "Submit", id = UrlParameter.Optional });
            routes.MapRoute("Enquiry", "enquiry-for-{id}", new { controller = "Enquiry", action = "Index", id = UrlParameter.Optional });
            routes.MapRoute("Default", "{action}/{id}", new { controller = "Home", action = "Index", id = UrlParameter.Optional });
        }
    }
}