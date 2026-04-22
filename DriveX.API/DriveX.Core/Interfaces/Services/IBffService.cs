using DriveX.Core.DTOs;

namespace DriveX.Core.Interfaces.Services;

public interface IBffService
{
    Task<ExplorePageDataDto> GetExplorePageDataAsync(CancellationToken ct = default);
}
