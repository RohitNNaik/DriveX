using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/finance")]
[Produces("application/json")]
public class FinanceController : ControllerBase
{
    private readonly IFinanceService _service;

    public FinanceController(IFinanceService service) => _service = service;

    /// <summary>
    /// Get ranked loan offers from 7 lenders based on loan parameters.
    /// </summary>
    [HttpPost("loan-offers")]
    [ProducesResponseType(typeof(LoanOffersResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetLoanOffers([FromBody] LoanRequestDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var result = await _service.GetLoanOffersAsync(dto, ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get ranked insurance recommendations from 6 insurers.
    /// </summary>
    [HttpPost("insurance")]
    [ProducesResponseType(typeof(InsuranceResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetInsurance([FromBody] InsuranceRequestDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _service.GetInsuranceRecommendationsAsync(dto, ct);
        return Ok(result);
    }
}
