using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Infrastructure.Data;
using DriveX.Infrastructure.Repositories;
using DriveX.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DriveX.Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // MongoDB settings
        services.Configure<MongoDbSettings>(opts =>
        {
            var section = configuration.GetSection("MongoDbSettings");
            opts.ConnectionString = section["ConnectionString"] ?? string.Empty;
            opts.DatabaseName     = section["DatabaseName"] ?? "drivex";
            opts.CarsCollection   = section["CarsCollection"] ?? "cars";
            opts.LeadsCollection  = section["LeadsCollection"] ?? "leads";
        });

        // DB context (singleton — MongoClient is thread-safe)
        services.AddSingleton<MongoDbContext>();

        // Repositories
        services.AddScoped<ICarRepository,  CarRepository>();
        services.AddScoped<ILeadRepository, LeadRepository>();

        // Services
        services.AddScoped<ICarService,         CarService>();
        services.AddScoped<ILeadService,        LeadService>();
        services.AddScoped<IFinanceService,     FinanceService>();
        services.AddScoped<IComparisonService,  ComparisonService>();
        services.AddScoped<IAdvisorService,     AdvisorService>();
        services.AddScoped<IBffService,         BffService>();
        services.AddScoped<ISeedService,        SeedService>();

        return services;
    }
}
