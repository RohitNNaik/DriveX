using DriveX.Core.DTOs;

namespace DriveX.Core.Interfaces.Services;

public interface IAdvisorService
{
    Task<AdvisorResponseDto> GetRecommendationsAsync(AdvisorRequestDto request, CancellationToken ct = default);
}
