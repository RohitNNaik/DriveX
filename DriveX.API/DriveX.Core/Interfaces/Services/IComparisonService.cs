using DriveX.Core.DTOs;

namespace DriveX.Core.Interfaces.Services;

public interface IComparisonService
{
    Task<CompareResponseDto> CompareAsync(CompareRequestDto request, CancellationToken ct = default);
}
