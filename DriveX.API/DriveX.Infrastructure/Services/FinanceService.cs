using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;

namespace DriveX.Infrastructure.Services;

public class FinanceService : IFinanceService
{
    // ── Static Lender Catalogue ───────────────────────────────────────────

    private static readonly List<LoanProviderDto> Lenders =
    [
        new("sbi", "SBI Car Loan", "🏦", "Bank", 8.75, 10.75, 0.5, 1000, 10000, 85, 84, 100000, 50000000,
            ["No prepayment charges", "Doorstep service", "Online tracking"], "Salaried with salary account", "2–3 days"),
        new("hdfc", "HDFC Bank", "🏛", "Bank", 8.9, 11.5, 0.5, 3000, 15000, 100, 84, 200000, 150000000,
            ["100% on-road funding", "Pre-approved in 10 min", "Flexible tenure"], "HDFC account holders & salaried", "10 minutes"),
        new("icici", "ICICI Bank", "🏢", "Bank", 9.0, 12.0, 0.5, 2500, 15000, 100, 84, 200000, 150000000,
            ["Instant in-principle approval", "Online account management", "Part-payment allowed"], "Existing ICICI customers", "30 minutes"),
        new("axis", "Axis Bank", "🔷", "Bank", 9.25, 13.0, 1.0, 3500, 20000, 95, 84, 100000, 150000000,
            ["Up to 95% funding", "Flexible repayment", "Balance transfer available"], "High credit score applicants", "1–2 days"),
        new("kotak", "Kotak Mahindra", "🔴", "Bank", 8.99, 14.0, 0.5, 5000, 10000, 100, 60, 250000, 100000000,
            ["100% on-road price", "Quick disbursal", "Door-step service"], "Business owners & self-employed", "1–2 days"),
        new("bajaj", "Bajaj Finserv", "🅱️", "NBFC", 9.5, 15.0, 2.0, 3999, 25000, 95, 84, 100000, 80000000,
            ["Minimal documentation", "Pre-approved offers", "Flexi loan option"], "Self-employed & low CIBIL", "Same day"),
        new("tata-capital", "Tata Capital", "🌟", "NBFC", 9.25, 14.0, 1.0, 5000, 20000, 90, 72, 200000, 100000000,
            ["Zero foreclosure charges", "Custom tenure", "Balance transfer"], "Tata car buyers", "2–3 days"),
    ];

    // ── Static Insurer Catalogue ──────────────────────────────────────────

    private static readonly List<InsuranceProviderDto> Insurers =
    [
        new("hdfc-ergo", "HDFC ERGO", "🛡", "Zero Depreciation", 2.8, 3000, 98.0, 6800,
            ["Zero depreciation on parts", "Cashless at 6800+ garages", "24/7 roadside assistance", "Engine protection included"],
            ["Drunk driving", "Mechanical breakdown"],
            ["Key replacement", "Return to invoice", "Tyre protection"],
            "New cars (0–3 years)", 95),
        new("bajaj-allianz", "Bajaj Allianz", "🔵", "Comprehensive", 2.4, 2500, 97.0, 4000,
            ["Own damage coverage", "Third-party liability", "Personal accident cover", "Natural calamity cover"],
            ["Depreciation losses", "Electrical/mechanical breakdown"],
            ["Zero dep", "Engine guard", "24/7 assistance"],
            "Best value comprehensive plan", 90),
        new("icici-lombard", "ICICI Lombard", "🟠", "Comprehensive", 2.6, 2800, 96.4, 5600,
            ["InstaSpect — photo-based claims", "Spot claim settlement", "Wide network garages", "Electric vehicle cover"],
            ["Consequential loss", "Racing accidents"],
            ["Zero dep", "Consumables", "Return to invoice"],
            "Tech-savvy & EV owners", 92),
        new("go-digit", "Go Digit", "🟢", "Comprehensive", 2.1, 2000, 95.8, 1400,
            ["100% online, paperless", "Fastest claim process (self-inspection)", "Flexible IDV", "Door-to-door pickup"],
            ["Drunk driving", "Wear & tear"],
            ["Zero dep", "Engine protection", "Key loss"],
            "Budget-conscious buyers", 88),
        new("new-india", "New India Assurance", "🏛", "Third-Party", 0.0, 0, 93.5, 3000,
            ["Government-backed insurer", "Mandatory third-party cover", "Low fixed premium", "Wide branch network"],
            ["Own damage", "Theft of car", "Natural disasters"],
            [],
            "Old cars (7+ years) or minimal coverage", 0),
        new("tata-aig", "Tata AIG", "⭐", "Bundled", 3.0, 3500, 97.5, 5500,
            ["1+3 year bundled plan", "Zero dep included (1st year)", "Engine & gearbox cover", "Roadside assistance across India"],
            ["Pre-existing damage", "Racing"],
            ["EMI protection", "Hospital cash", "Return to invoice"],
            "Brand new cars — best long-term value", 100),
    ];

    // ── Loan Offers ───────────────────────────────────────────────────────

    public Task<LoanOffersResponseDto> GetLoanOffersAsync(LoanRequestDto req, CancellationToken ct = default)
    {
        var principal = req.CarPrice - req.DownPayment;
        if (principal <= 0)
            throw new ArgumentException("Down payment cannot exceed car price.");

        var creditMultiplier = req.CreditScore.ToLower() switch
        {
            "excellent" => 0.0,
            "fair"      => 1.0,
            _           => 0.5   // good (default)
        };

        var offers = new List<LoanOfferDto>();

        foreach (var p in Lenders)
        {
            if (principal < p.MinLoanAmount || principal > p.MaxLoanAmount) continue;
            if (req.TenureMonths > p.MaxTenureMonths) continue;

            var appliedRate = Math.Round(p.MinRate + (p.MaxRate - p.MinRate) * creditMultiplier * 0.6, 2);
            var emi         = Math.Round(CalcEmi(principal, appliedRate, req.TenureMonths), 0);
            var totalPay    = emi * req.TenureMonths;
            var totalInt    = totalPay - principal;

            var rawFee      = (double)principal * (p.ProcessingFeePercent / 100);
            var fee         = Math.Round(Math.Clamp(rawFee, (double)p.ProcessingFeeMin, (double)p.ProcessingFeeMax), 0);
            var effective   = totalPay + (decimal)fee;

            double score = 1_000_000 / (double)effective;
            if (p.PreApprovalTime.Contains("min")) score += 5;
            if (p.MaxLTV >= 100) score += 3;
            if (p.Type == "Bank") score += 2;

            offers.Add(new LoanOfferDto(p, appliedRate, emi, Math.Round(totalInt, 0), Math.Round(totalPay, 0),
                (decimal)fee, Math.Round(effective, 0), score, null));
        }

        var ranked = offers
            .OrderByDescending(o => o.Score)
            .Select((o, i) => o with { Badge = i == 0 ? "Best Deal" : i == 1 ? "Runner Up" : null })
            .ToList();

        return Task.FromResult(new LoanOffersResponseDto(principal, req.TenureMonths, req.CreditScore, ranked));
    }

    // ── Insurance Recommendations ─────────────────────────────────────────

    public Task<InsuranceResponseDto> GetInsuranceRecommendationsAsync(InsuranceRequestDto req, CancellationToken ct = default)
    {
        double[] depTable = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.35, 0.40, 0.45, 0.50];
        var dep          = depTable[Math.Min(req.CarAge, 9)];
        var currentValue = (double)req.CarPrice * (1 - dep);
        var tpPremium    = req.IsEV ? 3416 : GetTpPremium(req.EngineCC);

        var recs = Insurers.Select(p =>
        {
            var idv = (decimal)Math.Round(currentValue * (p.IdvCoverage / 100.0));
            decimal premium;

            if (p.PlanType == "Third-Party")
                premium = tpPremium;
            else
                premium = (decimal)Math.Round((double)idv * (p.AnnualPremiumRate / 100) + (double)p.BasePremium + (double)tpPremium);

            double score = p.ClaimSettlementRatio * 10 - (double)premium / 5000;
            if (p.PlanType == "Zero Depreciation") score += 15;
            if (p.PlanType == "Bundled")            score += 10;
            if (req.CarAge <= 3 && p.PlanType == "Third-Party") score -= 50;
            if (req.CarAge >= 7 && p.PlanType == "Third-Party") score += 30;

            string? tag = null;
            if (req.CarAge == 0 && p.PlanType == "Zero Depreciation") tag = "Recommended for new car";
            if (req.CarAge == 0 && p.PlanType == "Bundled")            tag = "Best long-term value";
            if (p.PlanType == "Third-Party" && req.CarAge >= 7)        tag = "Best for older cars";
            if (p.Id == "go-digit")                                     tag = "Most affordable";

            return new InsuranceRecommendationDto(p, idv, premium, score, null, tag);
        })
        .OrderByDescending(r => r.Score)
        .Select((r, i) => r with { Badge = i == 0 ? "Top Pick" : i == 1 ? "2nd Choice" : null })
        .ToList();

        return Task.FromResult(new InsuranceResponseDto(req.CarPrice, req.CarAge, req.EngineCC, req.IsEV, recs));
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private static decimal CalcEmi(decimal principal, double ratePercent, int months)
    {
        var r = ratePercent / 12 / 100;
        if (r == 0) return principal / months;
        var pow = Math.Pow(1 + r, months);
        return (decimal)((double)principal * r * pow / (pow - 1));
    }

    private static decimal GetTpPremium(int engineCC) => engineCC switch
    {
        0            => 3416,
        < 1000       => 2094,
        <= 1500      => 3416,
        _            => 7897
    };
}
