using System.ComponentModel.DataAnnotations;

namespace DriveX.Core.DTOs;

public record CompareRequestDto(
    /// <summary>different-cars | same-model-variants</summary>
    string Mode = "different-cars",

    /// <summary>Used when Mode = different-cars. 2–3 MongoDB ObjectId strings.</summary>
    List<string>? CarIds = null,

    /// <summary>Used when Mode = same-model-variants. 2–4 car slugs.</summary>
    List<string>? VariantIds = null
);

public record CompareTableRowDto(
    string Label,
    List<string> Values,
    int? Winner          // index of the winning column (null = tie)
);

public record CarCompareCardDto(
    string Id,
    string Name,
    string Brand,
    string? Variant,
    decimal Price,
    string Image,
    List<string> Pros,
    List<string> Cons,
    double Rating,
    string FuelType,
    string Transmission
);

public record CompareResponseDto(
    string Mode,
    string? Winner,
    List<string> Insights,
    List<CompareTableRowDto> Table,
    List<CarCompareCardDto> Cars,
    string? PriceGap         // only for same-model-variants
);
