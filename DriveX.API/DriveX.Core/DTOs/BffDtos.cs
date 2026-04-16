namespace DriveX.Core.DTOs;

public record PlatformStatsDto(
    int TotalCars,
    int TotalBrands,
    int TotalUsedCars,
    int TotalLeads
);

public record FilterOptionsDto(
    List<string> FuelTypes,
    List<string> BodyTypes,
    List<string> Brands,
    decimal MinPrice,
    decimal MaxPrice
);

public record ExplorePageDataDto(
    List<CarDto> FeaturedCars,
    List<CarDto> UsedCars,
    PlatformStatsDto Stats,
    FilterOptionsDto FilterOptions
);
