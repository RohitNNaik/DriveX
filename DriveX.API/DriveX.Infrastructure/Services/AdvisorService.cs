using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;
using Microsoft.Extensions.Logging;

namespace DriveX.Infrastructure.Services;

public class AdvisorService : IAdvisorService
{
    private readonly ICarRepository _repo;
    private readonly ILogger<AdvisorService> _logger;

    public AdvisorService(ICarRepository repo, ILogger<AdvisorService> logger)
    {
        _repo   = repo;
        _logger = logger;
    }

    public async Task<AdvisorResponseDto> GetRecommendationsAsync(AdvisorRequestDto req, CancellationToken ct = default)
    {
        var allCars = await _repo.GetFilteredAsync(
            new CarFilterDto(null, null, null, null, req.Budget, null), ct);

        var suggestions = ApplyRuleEngine(req.Query, req.City, req.Budget, allCars);
        var text        = BuildResponseText(req, suggestions);

        return new AdvisorResponseDto(text, suggestions.Select(CarService.ToDto).ToList(), "rule-based");
    }

    // ── Rule-Based Engine ─────────────────────────────────────────────────

    private static List<Car> ApplyRuleEngine(string query, string? city, decimal? budget, List<Car> cars)
    {
        var q = query.ToLower();
        var scored = cars.Select(c => (car: c, score: Score(c, q, city))).ToList();

        return scored
            .Where(x => x.score > 0)
            .OrderByDescending(x => x.score)
            .ThenByDescending(x => x.car.Rating)
            .Take(5)
            .Select(x => x.car)
            .ToList();
    }

    private static int Score(Car c, string query, string? city)
    {
        int s = 0;

        // Fuel type keywords
        if (query.Contains("electric") || query.Contains("ev"))
        {
            if (c.FuelType == FuelType.Electric) s += 30;
        }
        if (query.Contains("diesel") && c.FuelType == FuelType.Diesel) s += 20;
        if (query.Contains("petrol") && c.FuelType == FuelType.Petrol)  s += 20;
        if (query.Contains("cng")    && c.FuelType == FuelType.CNG)     s += 20;

        // Body type keywords
        if ((query.Contains("suv") || query.Contains("xuv")) && c.BodyType == BodyType.SUV) s += 25;
        if (query.Contains("sedan") && c.BodyType == BodyType.Sedan)                        s += 25;
        if ((query.Contains("hatch") || query.Contains("small")) && c.BodyType == BodyType.Hatchback) s += 25;
        if ((query.Contains("mpv") || query.Contains("family van")) && c.BodyType == BodyType.MPV)    s += 25;

        // Usage tags
        if (query.Contains("city") && c.Tags.Contains(UsageTag.City))        s += 15;
        if (query.Contains("highway") && c.Tags.Contains(UsageTag.Highway))  s += 15;
        if (query.Contains("family") && c.Tags.Contains(UsageTag.Family))    s += 15;
        if (query.Contains("offroad") && c.Tags.Contains(UsageTag.OffRoad))  s += 15;
        if ((query.Contains("budget") || query.Contains("cheap") || query.Contains("affordable"))
            && c.Tags.Contains(UsageTag.Budget)) s += 15;

        // Rating bonus
        s += (int)(c.Rating * 2);

        return s;
    }

    private static string BuildResponseText(AdvisorRequestDto req, List<Car> cars)
    {
        if (cars.Count == 0)
            return "I couldn't find a perfect match. Try adjusting your budget or requirements.";

        var budgetStr = req.Budget.HasValue ? $"under ₹{req.Budget.Value:N0}" : "";
        var cityStr   = !string.IsNullOrWhiteSpace(req.City) ? $" for {req.City}" : "";
        var names     = string.Join(", ", cars.Take(3).Select(c => c.Name));

        return $"Based on your query, here are my top recommendations{cityStr} {budgetStr}: {names}. " +
               $"These match your requirements for {req.Query.ToLower()}.";
    }
}
