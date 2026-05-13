using DriveX.Core.DTOs;
using DriveX.Core.Models;

namespace DriveX.Core.Interfaces.Repositories;

public interface ICarRepository : IRepository<Car>
{
    Task<List<Car>> GetFilteredAsync(CarFilterDto filter, CancellationToken ct = default);
    Task<List<Car>> GetUsedCarsAsync(UsedCarFilterDto filter, CancellationToken ct = default);
    Task<List<Car>> GetFeaturedAsync(int limit = 6, CancellationToken ct = default);
    Task<List<Car>> GetVariantsByModelAsync(string brand, string model, CancellationToken ct = default);
    Task<List<Car>> GetBySlugAsync(IEnumerable<string> slugs, CancellationToken ct = default);
    Task<Car?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<List<string>> GetDistinctBrandsAsync(CancellationToken ct = default);
    Task<bool> AnyAsync(CancellationToken ct = default);
}
