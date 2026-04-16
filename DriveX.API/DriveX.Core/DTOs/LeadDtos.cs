using System.ComponentModel.DataAnnotations;

namespace DriveX.Core.DTOs;

public record CreateLeadDto(
    string? CarId,
    string? CarName,

    [Required, MinLength(2)]
    string Name,

    [Required, RegularExpression(@"^\d{10}$", ErrorMessage = "Phone must be 10 digits")]
    string Phone,

    [Required]
    string City,

    /// <summary>buy | test_drive | loan | insurance | general</summary>
    string Intent = "general"
);

public record LeadDto(
    string Id,
    string? CarId,
    string? CarName,
    string Name,
    string Phone,
    string City,
    string Intent,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record UpdateLeadStatusDto(
    [Required] string Status
);
