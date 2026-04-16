using System.ComponentModel.DataAnnotations;

namespace DriveX.Core.DTOs;

public record AdvisorRequestDto(
    [Required, MinLength(3)] string Query,
    string? City,
    decimal? Budget
);

public record AdvisorResponseDto(
    string Text,
    List<CarDto> Suggestions,
    string Source          // "openai" | "rule-based"
);
