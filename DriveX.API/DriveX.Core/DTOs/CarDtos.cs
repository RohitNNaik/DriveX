using DriveX.Core.Models;

namespace DriveX.Core.DTOs;

// ── Response DTOs ──────────────────────────────────────────────────────────

public record CarDto(
    string Id,
    string Slug,
    string Name,
    string Brand,
    string Model,
    string? Variant,
    int Year,
    decimal Price,
    string Image,
    string FuelType,
    string Transmission,
    string BodyType,
    double Mileage,
    int Seating,
    int EngineCC,
    int Power,
    int Torque,
    int Airbags,
    double Rating,
    List<string> Pros,
    List<string> Cons,
    List<string> Tags,
    bool IsUsed,
    int? KmDriven,
    int? Owners
);

public record VariantSummaryDto(
    string Id,
    string Brand,
    string Model,
    string Variant,
    string FuelType,
    string Transmission,
    decimal Price
);

public record ModelVariantGroupDto(
    string Brand,
    string Model,
    List<VariantSummaryDto> Variants
);

// ── Request / Filter DTOs ──────────────────────────────────────────────────

public record CarFilterDto(
    string? FuelType,
    string? BodyType,
    string? Brand,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? UsageTag
);

public record UsedCarFilterDto(
    string? City,
    int? MaxKmDriven,
    int? MaxOwners
);
