using Microsoft.CSharp.RuntimeBinder;
using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace AG.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class Helper
    {
        private int _clientID = 9;
        private HttpClient client = new HttpClient();

        public Helper()
        {
            this.client.BaseAddress = new Uri(ConfigurationManager.AppSettings["iCore_Url"]);
            this.client.DefaultRequestHeaders.Accept.Clear();
            this.client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public dynamic InitializeClient(HttpContextBase httpContext)
        {
            if (_clientID > 0)
            {
                httpContext.Session["Client"] = this.RequestFromAPI("iCMS/Client/Get", new { ID = _clientID });
            }
            return httpContext.Session["Client"];
        }
        public dynamic RequestFromAPI(string apiUrl, dynamic obj)
        {
            var rq = obj;
            HttpContent contentPost = new StringContent(new JavaScriptSerializer().Serialize(rq), Encoding.UTF8, "application/json");
            HttpResponseMessage response = client.PostAsync(apiUrl, contentPost).Result;
            if (response.IsSuccessStatusCode)
            {
                return (dynamic)JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);
            }

            return null;
        }
    }
}