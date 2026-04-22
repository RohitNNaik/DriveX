using System.ComponentModel.DataAnnotations;

namespace DriveX.Core.DTOs;

// ── Loan ──────────────────────────────────────────────────────────────────

public record LoanRequestDto(
    [Required, Range(100000, 100000000)] decimal CarPrice,
    [Required, Range(0, 99000000)]       decimal DownPayment,
    [Required, Range(12, 84)]            int TenureMonths,

    /// <summary>excellent | good | fair  (default: good)</summary>
    string CreditScore = "good"
);

public record LoanProviderDto(
    string Id,
    string Name,
    string Logo,
    string Type,
    double MinRate,
    double MaxRate,
    double ProcessingFeePercent,
    decimal ProcessingFeeMin,
    decimal ProcessingFeeMax,
    int MaxLTV,
    int MaxTenureMonths,
    decimal MinLoanAmount,
    decimal MaxLoanAmount,
    List<string> Features,
    string BestFor,
    string PreApprovalTime
);

public record LoanOfferDto(
    LoanProviderDto Provider,
    double AppliedRate,
    decimal Emi,
    decimal TotalInterest,
    decimal TotalPayable,
    decimal ProcessingFeeAmount,
    decimal EffectiveCost,
    double Score,
    string? Badge
);

public record LoanOffersResponseDto(
    decimal Principal,
    int TenureMonths,
    string CreditScore,
    List<LoanOfferDto> Offers
);

// ── Insurance ─────────────────────────────────────────────────────────────

public record InsuranceRequestDto(
    [Required, Range(100000, 100000000)] decimal CarPrice,
    [Range(0, 20)]                       int CarAge = 0,
    [Range(0, 10000)]                    int EngineCC = 1500,
    bool IsEV = false
);

public record InsuranceProviderDto(
    string Id,
    string Name,
    string Logo,
    string PlanType,
    double AnnualPremiumRate,
    decimal BasePremium,
    double ClaimSettlementRatio,
    int NetworkGarages,
    List<string> KeyFeatures,
    List<string> NotCovered,
    List<string> AddOns,
    string BestFor,
    int IdvCoverage
);

public record InsuranceRecommendationDto(
    InsuranceProviderDto Provider,
    decimal EstimatedIDV,
    decimal EstimatedPremium,
    double Score,
    string? Badge,
    string? Tag
);

public record InsuranceResponseDto(
    decimal CarPrice,
    int CarAge,
    int EngineCC,
    bool IsEV,
    List<InsuranceRecommendationDto> Recommendations
);
