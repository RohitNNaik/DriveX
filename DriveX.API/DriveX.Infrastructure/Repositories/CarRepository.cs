using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Models;
using DriveX.Infrastructure.Data;
using MongoDB.Driver;

namespace DriveX.Infrastructure.Repositories;

public class CarRepository : BaseRepository<Car>, ICarRepository
{
    public CarRepository(MongoDbContext context) : base(context.Cars) { }

    public async Task<List<Car>> GetFilteredAsync(CarFilterDto filter, CancellationToken ct = default)
    {
        var builder = Builders<Car>.Filter;
        var filters = new List<FilterDefinition<Car>>
        {
            builder.Eq(c => c.IsUsed, false)
        };

        if (!string.IsNullOrWhiteSpace(filter.FuelType) &&
            Enum.TryParse<FuelType>(filter.FuelType, true, out var fuelType))
            filters.Add(builder.Eq(c => c.FuelType, fuelType));

        if (!string.IsNullOrWhiteSpace(filter.BodyType) &&
            Enum.TryParse<BodyType>(filter.BodyType, true, out var bodyType))
            filters.Add(builder.Eq(c => c.BodyType, bodyType));

        if (!string.IsNullOrWhiteSpace(filter.Brand))
            filters.Add(builder.Regex(c => c.Brand, new MongoDB.Bson.BsonRegularExpression(filter.Brand, "i")));

        if (!string.IsNullOrWhiteSpace(filter.UsageTag) &&
            Enum.TryParse<UsageTag>(filter.UsageTag.Replace("-", ""), true, out var tag))
            filters.Add(builder.AnyEq(c => c.Tags, tag));

        if (filter.MinPrice.HasValue)
            filters.Add(builder.Gte(c => c.Price, filter.MinPrice.Value));

        if (filter.MaxPrice.HasValue)
            filters.Add(builder.Lte(c => c.Price, filter.MaxPrice.Value));

        var combined = builder.And(filters);
        return await _collection.Find(combined).SortBy(c => c.Price).ToListAsync(ct);
    }

    public async Task<List<Car>> GetUsedCarsAsync(UsedCarFilterDto filter, CancellationToken ct = default)
    {
        var builder = Builders<Car>.Filter;
        var filters = new List<FilterDefinition<Car>>
        {
            builder.Eq(c => c.IsUsed, true)
        };

        if (!string.IsNullOrWhiteSpace(filter.City))
            filters.Add(builder.Regex(c => c.Brand, new MongoDB.Bson.BsonRegularExpression(filter.City, "i")));

        if (filter.MaxKmDriven.HasValue)
            filters.Add(builder.Lte(c => c.KmDriven, filter.MaxKmDriven.Value));

        if (filter.MaxOwners.HasValue)
            filters.Add(builder.Lte(c => c.Owners, filter.MaxOwners.Value));

        var combined = builder.And(filters);
        return await _collection.Find(combined).SortBy(c => c.Price).ToListAsync(ct);
    }

    public async Task<List<Car>> GetFeaturedAsync(int limit = 6, CancellationToken ct = default) =>
        await _collection
            .Find(c => c.IsFeatured && !c.IsUsed)
            .Limit(limit)
            .ToListAsync(ct);

    public async Task<List<Car>> GetVariantsByModelAsync(string brand, string model, CancellationToken ct = default) =>
        await _collection
            .Find(c => c.Brand == brand && c.Model == model && c.Variant != null)
            .SortBy(c => c.Price)
            .ToListAsync(ct);

    public async Task<List<Car>> GetBySlugAsync(IEnumerable<string> slugs, CancellationToken ct = default)
    {
        var filter = Builders<Car>.Filter.In(c => c.Slug, slugs);
        return await _collection.Find(filter).ToListAsync(ct);
    }

    public async Task<Car?> GetBySlugAsync(string slug, CancellationToken ct = default) =>
        await _collection.Find(c => c.Slug == slug).FirstOrDefaultAsync(ct);

    public async Task<List<string>> GetDistinctBrandsAsync(CancellationToken ct = default) =>
        await _collection.Distinct<string>("brand", Builders<Car>.Filter.Eq(c => c.IsUsed, false))
                         .ToListAsync(ct);

    public async Task<bool> AnyAsync(CancellationToken ct = default) =>
        await _collection.Find(_ => true).AnyAsync(ct);
}
