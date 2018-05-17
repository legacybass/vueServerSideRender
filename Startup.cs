using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace VueExperiment
{
	public class Startup
	{
		protected IConfiguration Configuration { get; }
		protected IHostingEnvironment Environment { get; }

		public Startup(IConfiguration configuration, IHostingEnvironment env)
		{
			Configuration = configuration;
			Environment = env;
		}


		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			ConfigureDependencyInjection(services);

			services.Configure<IdentityOptions>(options =>
			{
				options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
				options.Lockout.MaxFailedAccessAttempts = 5;
				options.Lockout.AllowedForNewUsers = true;

				options.Password.RequiredUniqueChars = 6;
				options.Password.RequireDigit = true;
				options.Password.RequiredLength = 8;
				options.Password.RequireNonAlphanumeric = true;
				options.Password.RequireUppercase = true;
				options.Password.RequireLowercase = false;

				options.User.RequireUniqueEmail = true;

				options.SignIn.RequireConfirmedEmail = false;
				options.SignIn.RequireConfirmedPhoneNumber = false;
			});

			services.ConfigureApplicationCookie(options =>
			{
				options.Cookie.HttpOnly = true;
				options.Cookie.Expiration = TimeSpan.FromDays(2);
				options.Cookie.Name = nameof(VueExperiment);
			});

			services.AddAuthentication()
			.AddCookie(options => options.LoginPath = new Microsoft.AspNetCore.Http.PathString("/user/login"));

			services.AddOptions();

			if(Environment.IsDevelopment())
			{
				services.AddNodeServices(options =>
				{
					options.LaunchWithDebugging = true;
				});
			}

			services.AddAntiforgery();

			// Add framework services.
			services.AddMvc();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			if(env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true
				});
				app.UseBrowserLink();
			}
			else
			{
				app.UseRewriter(new Microsoft.AspNetCore.Rewrite.RewriteOptions().AddRedirectToHttps());
				app.UseExceptionHandler("/Home/Error");
			}

			app.UseStaticFiles();
			app.UseAuthentication();

			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Index}/{id?}");

				routes.MapSpaFallbackRoute(
					name: "spa-fallback",
					defaults: new { controller = "Home", action = "Index" });
			});
		}

		protected void ConfigureDependencyInjection(IServiceCollection services)
		{

		}
	}
}
