using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AG.Startup))]
namespace AG
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
