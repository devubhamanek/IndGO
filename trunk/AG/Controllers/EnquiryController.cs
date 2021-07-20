using AG.Models;
using System;
using System.Dynamic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace AG.Controllers
{
    public class EnquiryController : Controller
    {
        private Helper _helper = new Helper();

        public EnquiryController()
        {
        }

        public async Task<ActionResult> Index(string id)
        {
            ViewBag.Client = _helper.InitializeClient(this.HttpContext);
            if (!string.IsNullOrEmpty(id))
            {
                ViewBag.Result = _helper.RequestFromAPI("iCMS/Inventory/Get", new { Alias = id });
            }
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> Submit(int id, FormCollection coll)
        {
            ViewBag.Client = _helper.InitializeClient(this.HttpContext);

            dynamic meta = new ExpandoObject();
            meta.Name = coll["name"];
            meta.Email = coll["email"];
            meta.Telephone = coll["number"];
            meta.Depart_Date = Convert.ToDateTime(coll["depart_date"]).ToString("dd/MM/yyyy");
            meta.Nights = coll["nights"];
            meta.Flexible_Dates = coll["flexible_dates"];
            meta.Destination = coll["destination"];
            meta.Depart_From = coll["depart_from"];
            meta.Adults = coll["adults"];
            meta.Children = coll["children"];
            meta.Children_Ages = coll["children_ages"];
            meta.Budget_Per_person = coll["budget"];
            meta.Newsletter_Subscribe = coll["newsletter"] == "on" ? "Yes" : "No";

            var rqMessage = new
            {
                Group = coll["group"], // Will be the identifier as to the purpose of the message and allow for grouping it together in iCore
                Subject = coll["subject"], // A short description to be used as the title and/or subject for the message
                Body = coll["comments"], // The body of the message
                ClientID = (int)ViewBag.Client.ID,
                NotifyClient = false, // If true, the client will be notified via the iCore of the new message
                NotifyUser = false, // If true, the user will be notified via the iCore of the new message
                EmailClient = true, // If true, the client will be emailed a copy of the message
                EmailUser = false, // If true, the user will be emailed a copy of the message
                UserID = 0, // Optional
                InventoryID = coll["inventoryid"], // Optional - only need to be set if this is an enquiry/message against a specific inventory
                InventoryRateID = coll["inventoryRateId"], // Optional - only need to be set if this is an enquiry/message against a specific rate
                Meta = Newtonsoft.Json.JsonConvert.SerializeObject(meta)
            };
            ViewBag.Result = _helper.RequestFromAPI("iCore/Message/Create", rqMessage);

            if (coll["newsletter"] == "on")
            {
                var rq = new
                {
                    ClientID = (int)ViewBag.Client.ID,
                    EmailAddress = meta.Email,
                    Group = "Enquiry"
                };

                ViewBag.Result = _helper.RequestFromAPI("iCore/Client/Subscriber/Create", rq);
            }

            return View();
        }
    }
}