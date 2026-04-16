using DriveX.Core.DTOs;

namespace DriveX.Core.Interfaces.Services;

public interface IFinanceService
{
    Task<LoanOffersResponseDto> GetLoanOffersAsync(LoanRequestDto request, CancellationToken ct = default);
    Task<InsuranceResponseDto> GetInsuranceRecommendationsAsync(InsuranceRequestDto request, CancellationToken ct = default);
}
