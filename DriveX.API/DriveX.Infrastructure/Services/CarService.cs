using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;

namespace DriveX.Infrastructure.Services;

public class CarService : ICarService
{
    private readonly ICarRepository _repo;

    public CarService(ICarRepository repo) => _repo = repo;

    public async Task<List<CarDto>> GetCarsAsync(CarFilterDto filter, CancellationToken ct = default)
    {
        var cars = await _repo.GetFilteredAsync(filter, ct);
        return cars.Select(ToDto).ToList();
    }

    public async Task<CarDto?> GetCarByIdAsync(string id, CancellationToken ct = default)
    {
        // Try ObjectId first, then slug
        var car = await _repo.GetByIdAsync(id, ct)
                  ?? await _repo.GetBySlugAsync(id, ct);
        return car is null ? null : ToDto(car);
    }

    public async Task<List<CarDto>> GetUsedCarsAsync(UsedCarFilterDto filter, CancellationToken ct = default)
    {
        var cars = await _repo.GetUsedCarsAsync(filter, ct);
        return cars.Select(ToDto).ToList();
    }

    public async Task<List<VariantSummaryDto>> GetVariantsAsync(string brand, string model, CancellationToken ct = default)
    {
        var cars = await _repo.GetVariantsByModelAsync(brand, model, ct);
        return cars.Select(c => new VariantSummaryDto(
            c.Id ?? c.Slug,
            c.Brand,
            c.Model,
            c.Variant ?? c.Name,
            c.FuelType.ToString(),
            c.Transmission.ToString(),
            c.Price
        )).ToList();
    }

    public async Task<List<ModelVariantGroupDto>> GetVariantModelsAsync(CancellationToken ct = default)
    {
        // Fetch all cars that have a variant label
        var all = await _repo.FindAsync(c => c.Variant != null && !c.IsUsed, ct);

        return all
            .GroupBy(c => new { c.Brand, c.Model })
            .Where(g => g.Count() >= 2)
            .Select(g => new ModelVariantGroupDto(
                g.Key.Brand,
                g.Key.Model,
                g.Select(c => new VariantSummaryDto(
                    c.Id ?? c.Slug,
                    c.Brand,
                    c.Model,
                    c.Variant!,
                    c.FuelType.ToString(),
                    c.Transmission.ToString(),
                    c.Price
                )).OrderBy(v => v.Price).ToList()
            ))
            .OrderBy(g => g.Brand).ThenBy(g => g.Model)
            .ToList();
    }

    internal static CarDto ToDto(Car c) => new(
        c.Id ?? c.Slug,
        c.Slug,
        c.Name,
        c.Brand,
        c.Model,
        c.Variant,
        c.Year,
        c.Price,
        c.Image,
        c.FuelType.ToString(),
        c.Transmission.ToString(),
        c.BodyType.ToString(),
        c.Mileage,
        c.Seating,
        c.EngineCC,
        c.Power,
        c.Torque,
        c.Airbags,
        c.Rating,
        c.Pros,
        c.Cons,
        c.Tags.Select(t => t.ToString()).ToList(),
        c.IsUsed,
        c.KmDriven,
        c.Owners
    );
}
