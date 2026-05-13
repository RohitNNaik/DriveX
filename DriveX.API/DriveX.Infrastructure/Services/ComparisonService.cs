using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;

namespace DriveX.Infrastructure.Services;

public class ComparisonService : IComparisonService
{
    private readonly ICarRepository _repo;

    public ComparisonService(ICarRepository repo) => _repo = repo;

    public async Task<CompareResponseDto> CompareAsync(CompareRequestDto req, CancellationToken ct = default)
    {
        return req.Mode.ToLower() == "same-model-variants"
            ? await CompareVariantsAsync(req.VariantIds ?? [], ct)
            : await CompareDifferentCarsAsync(req.CarIds ?? [], ct);
    }

    // ── Mode A: Different Cars ────────────────────────────────────────────

    private async Task<CompareResponseDto> CompareDifferentCarsAsync(List<string> ids, CancellationToken ct)
    {
        if (ids.Count < 2) throw new ArgumentException("Provide at least 2 car IDs.");
        if (ids.Count > 3) throw new ArgumentException("Maximum 3 cars can be compared.");

        var cars = new List<Car>();
        foreach (var id in ids)
        {
            var car = await _repo.GetByIdAsync(id, ct) ?? await _repo.GetBySlugAsync(id, ct);
            if (car is not null) cars.Add(car);
        }

        if (cars.Count < 2) throw new InvalidOperationException("Could not find enough cars to compare.");

        var table = BuildSpecTable(cars);
        var winner = DetermineWinner(cars, table);
        var insights = BuildInsights(cars);
        var cards = cars.Select(ToCard).ToList();

        return new CompareResponseDto("different-cars", winner, insights, table, cards, null);
    }

    // ── Mode B: Variant Comparison ────────────────────────────────────────

    private async Task<CompareResponseDto> CompareVariantsAsync(List<string> slugs, CancellationToken ct)
    {
        if (slugs.Count < 2) throw new ArgumentException("Select at least 2 variants.");
        if (slugs.Count > 4) throw new ArgumentException("Maximum 4 variants can be compared.");

        var cars = await _repo.GetBySlugAsync(slugs, ct);
        if (cars.Count < 2) throw new InvalidOperationException("Could not find enough variants.");

        var table = BuildSpecTable(cars);
        var winner = DetermineWinner(cars, table);
        var insights = BuildVariantInsights(cars);
        var cards = cars.Select(ToCard).ToList();

        var priceGap = cars.Count > 1
            ? $"Price gap across variants: ₹{cars.Max(c => c.Price) - cars.Min(c => c.Price):N0}"
            : null;

        return new CompareResponseDto("same-model-variants", winner, insights, table, cards, priceGap);
    }

    // ── Spec Table Builder ────────────────────────────────────────────────

    private static List<CompareTableRowDto> BuildSpecTable(List<Car> cars)
    {
        static int? WinnerIdx<T>(List<T> vals, bool higherIsBetter = true) where T : IComparable<T>
        {
            if (vals.All(v => v.CompareTo(vals[0]) == 0)) return null; // tie
            return higherIsBetter
                ? vals.IndexOf(vals.Max()!)
                : vals.IndexOf(vals.Min()!);
        }

        var prices  = cars.Select(c => c.Price).ToList();
        var mileage = cars.Select(c => c.Mileage).ToList();
        var engines = cars.Select(c => c.EngineCC).ToList();
        var powers  = cars.Select(c => c.Power).ToList();
        var torques = cars.Select(c => c.Torque).ToList();
        var airbags = cars.Select(c => c.Airbags).ToList();
        var ratings = cars.Select(c => c.Rating).ToList();

        return
        [
            new("Price (₹)", cars.Select(c => $"₹{c.Price:N0}").ToList(), WinnerIdx(prices, false)),
            new("Mileage (kmpl)", cars.Select(c => c.Mileage == 0 ? "Electric" : $"{c.Mileage} kmpl").ToList(), WinnerIdx(mileage)),
            new("Engine", cars.Select(c => c.EngineCC == 0 ? "Electric" : $"{c.EngineCC} cc").ToList(), WinnerIdx(engines)),
            new("Power (bhp)", cars.Select(c => $"{c.Power} bhp").ToList(), WinnerIdx(powers)),
            new("Torque (Nm)", cars.Select(c => $"{c.Torque} Nm").ToList(), WinnerIdx(torques)),
            new("Airbags", cars.Select(c => c.Airbags.ToString()).ToList(), WinnerIdx(airbags)),
            new("Seating", cars.Select(c => c.Seating.ToString()).ToList(), null),
            new("Fuel Type", cars.Select(c => c.FuelType.ToString()).ToList(), null),
            new("Transmission", cars.Select(c => c.Transmission.ToString()).ToList(), null),
            new("Rating", cars.Select(c => $"{c.Rating}/5").ToList(), WinnerIdx(ratings)),
        ];
    }

    private static string DetermineWinner(List<Car> cars, List<CompareTableRowDto> table)
    {
        var scores = new int[cars.Count];
        foreach (var row in table)
            if (row.Winner.HasValue)
                scores[row.Winner.Value]++;

        return cars[Array.IndexOf(scores, scores.Max())].Name;
    }

    private static List<string> BuildInsights(List<Car> cars)
    {
        var insights = new List<string>();
        var cheapest = cars.MinBy(c => c.Price)!;
        var bestMpg  = cars.MaxBy(c => c.Mileage)!;
        var mostPwr  = cars.MaxBy(c => c.Power)!;
        var topRated = cars.MaxBy(c => c.Rating)!;

        insights.Add($"{cheapest.Name} is the most affordable option");
        if (cars.Any(c => c.Mileage > 0))
            insights.Add($"{bestMpg.Name} offers the best fuel economy at {bestMpg.Mileage} kmpl");
        insights.Add($"{mostPwr.Name} has the most powerful engine at {mostPwr.Power} bhp");
        insights.Add($"{topRated.Name} has the highest user rating ({topRated.Rating}/5)");
        return insights;
    }

    private static List<string> BuildVariantInsights(List<Car> cars)
    {
        var insights = new List<string>();
        var cheapest = cars.MinBy(c => c.Price)!;
        var bestMpg  = cars.Where(c => c.Mileage > 0).MaxBy(c => c.Mileage);
        var gap      = cars.Max(c => c.Price) - cars.Min(c => c.Price);

        insights.Add($"{cheapest.Name} is the most affordable variant");
        insights.Add($"Price gap across variants: ₹{gap:N0}");
        if (bestMpg is not null)
            insights.Add($"{bestMpg.Name} delivers the best mileage at {bestMpg.Mileage} kmpl");
        return insights;
    }

    private static CarCompareCardDto ToCard(Car c) => new(
        c.Id ?? c.Slug,
        c.Name,
        c.Brand,
        c.Variant,
        c.Price,
        c.Image,
        c.Pros,
        c.Cons,
        c.Rating,
        c.FuelType.ToString(),
        c.Transmission.ToString()
    );
}
