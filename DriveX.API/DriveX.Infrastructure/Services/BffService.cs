using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;

namespace DriveX.Infrastructure.Services;

public class BffService : IBffService
{
    private readonly ICarRepository  _carRepo;
    private readonly ILeadRepository _leadRepo;

    public BffService(ICarRepository carRepo, ILeadRepository leadRepo)
    {
        _carRepo  = carRepo;
        _leadRepo = leadRepo;
    }

    public async Task<ExplorePageDataDto> GetExplorePageDataAsync(CancellationToken ct = default)
    {
        var featuredTask  = _carRepo.GetFeaturedAsync(6, ct);
        var usedTask      = _carRepo.GetUsedCarsAsync(new UsedCarFilterDto(null, null, null), ct);
        var brandsTask    = _carRepo.GetDistinctBrandsAsync(ct);
        var totalCarsTask = _carRepo.CountAsync(c => !c.IsUsed, ct);
        var totalUsedTask = _carRepo.CountAsync(c => c.IsUsed, ct);
        var totalLeadTask = _leadRepo.CountAsync(null, ct);

        await Task.WhenAll(featuredTask, usedTask, brandsTask, totalCarsTask, totalUsedTask, totalLeadTask);

        var featured = await featuredTask;
        var used     = await usedTask;
        var brands   = await brandsTask;
        var allCars  = await _carRepo.FindAsync(c => !c.IsUsed, ct);

        var minPrice = allCars.Any() ? allCars.Min(c => c.Price) : 0;
        var maxPrice = allCars.Any() ? allCars.Max(c => c.Price) : 5000000;

        var stats = new PlatformStatsDto(
            (int)await totalCarsTask,
            brands.Count,
            (int)await totalUsedTask,
            (int)await totalLeadTask
        );

        var filterOptions = new FilterOptionsDto(
            Enum.GetNames<FuelType>().ToList(),
            Enum.GetNames<BodyType>().ToList(),
            brands.OrderBy(b => b).ToList(),
            minPrice,
            maxPrice
        );

        return new ExplorePageDataDto(
            featured.Select(CarService.ToDto).ToList(),
            used.Select(CarService.ToDto).ToList(),
            stats,
            filterOptions
        );
    }
}
