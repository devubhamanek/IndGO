using AG.Models;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace AG.Controllers
{
    public class HomeController : Controller
    {
        private Helper _helper = new Helper();

        public HomeController()
        {
        }
        public ActionResult Index()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            ViewBag.Categories = _helper.RequestFromAPI("iCore/Category/List", new { ClientID = (int)ViewBag.Client.ID });
            ViewBag.Inventory = _helper.RequestFromAPI("iCMS/Inventory/List", new { ClientID = (int)ViewBag.Client.ID });
            ViewBag.InventoryBanner = _helper.RequestFromAPI("iCMS/Inventory/List", new { ClientID = (int)ViewBag.Client.ID, Labels = new string[] { "Banner" } });

            return View();
        }
        public async Task<ActionResult> List(string category, string id)
        {
            ViewBag.Client = _helper.InitializeClient(this.HttpContext);
            if (!string.IsNullOrEmpty(category))
            {
                var cat = _helper.RequestFromAPI("iCore/Category/Get", new { ClientID = (int)ViewBag.Client.ID, Alias = category });

                if (cat != null)
                {
                    ViewBag.Category = cat;
                    ViewBag.Inventory = _helper.RequestFromAPI("iCMS/Inventory/List", new { ClientID = (int)ViewBag.Client.ID, CategoryID = (int)cat.ID });
                    ViewBag.InventoryBanner = _helper.RequestFromAPI("iCMS/Inventory/List", new { ClientID = (int)ViewBag.Client.ID, CategoryID = (int)cat.ID, Labels = new string[] { "Banner-Destination" } });
                }
            }

            return View();
        }
        public async Task<ActionResult> Detail(string category, string id)
        {
            ViewBag.Client = _helper.InitializeClient(this.HttpContext);
            if (!string.IsNullOrEmpty(id))
            {
                ViewBag.Detail = _helper.RequestFromAPI("iCMS/Inventory/Get", new { Alias = id, IsView = true });
                ViewBag.Category = _helper.RequestFromAPI("iCore/Category/Get", new { ClientID = (int)ViewBag.Client.ID, ID = (int)ViewBag.Detail.CategoryID });
                ViewBag.OtherOffers = ((List<dynamic>)_helper.RequestFromAPI("iCMS/Inventory/List", new { ClientID = (int)ViewBag.Client.ID, CategoryID = (int)ViewBag.Detail.CategoryID, Limit = 4, Random = true }).ToObject<List<dynamic>>());
            }
            return View();
        }
        [ActionName("About-Thailand")]
        public ActionResult AboutThailand()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }
        public ActionResult Travel()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }
        [HttpPost]
        public ActionResult Contact(FormCollection coll)
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);

            dynamic meta = new ExpandoObject();
            meta.Name = coll["name"];
            meta.Email = coll["email"];
            meta.Telephone = coll["number"];

            var rq = new
            {
                Group = coll["group"], // Will be the identifier as to the purpose of the message and allow for grouping it together in iCore
                Subject = "Contact Us Request", // A short description to be used as the title and/or subject for the message
                Body = coll["message"], // The body of the message
                ClientID = (int)ViewBag.Client.ID,
                NotifyClient = false, // If true, the client will be notified via the iCore of the new message
                NotifyUser = false, // If true, the user will be notified via the iCore of the new message
                EmailClient = true, // If true, the client will be emailed a copy of the message
                EmailUser = false, // If true, the user will be emailed a copy of the message
                UserID = 0, // Optional
                InventoryID = 0, // Optional - only need to be set if this is an enquiry/message against a specific inventory
                Meta = Newtonsoft.Json.JsonConvert.SerializeObject(meta)
            };

            ViewBag.Result = _helper.RequestFromAPI("iCore/Message/Create", rq);

            return View();
        }
        [ActionName("privacy-policy")]
        public ActionResult PrivacyPolicy()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }

        public ActionResult Terms()
        {
            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            return View();
        }
        [ActionName("Newsletter-Signup")]
        [HttpPost]
        public ActionResult NewsletterSignup(FormCollection coll)
        {
            string emailAddress = coll["emailAddress"];
            string group = coll["group"];

            ViewBag.Client = (dynamic)_helper.InitializeClient(this.HttpContext);
            var rq = new
            {
                ClientID = (int)ViewBag.Client.ID,
                EmailAddress = emailAddress,
                Group = group
            };

            ViewBag.Result = _helper.RequestFromAPI("iCore/Client/Subscriber/Create", rq);
            return View();
        }
    }
}