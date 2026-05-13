using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/bff")]
[Produces("application/json")]
public class BffController : ControllerBase
{
    private readonly IBffService        _bff;
    private readonly IComparisonService _comparison;
    private readonly IAdvisorService    _advisor;

    public BffController(IBffService bff, IComparisonService comparison, IAdvisorService advisor)
    {
        _bff        = bff;
        _comparison = comparison;
        _advisor    = advisor;
    }

    /// <summary>
    /// Returns all data required by the home/explore page in a single request:
    /// featured cars, used cars, platform stats, and filter options.
    /// </summary>
    [HttpGet("explore-page-data")]
    [ProducesResponseType(typeof(ExplorePageDataDto), 200)]
    public async Task<IActionResult> GetExplorePageData(CancellationToken ct)
    {
        var data = await _bff.GetExplorePageDataAsync(ct);
        return Ok(data);
    }

    /// <summary>
    /// Compare cars side-by-side and receive a spec table, winner, and AI insights.
    /// Supports two modes:
    /// - "different-cars"      : provide carIds (MongoDB ObjectIds or slugs), 2–3 items
    /// - "same-model-variants" : provide variantIds (slugs), 2–4 items
    /// </summary>
    [HttpPost("compare")]
    [ProducesResponseType(typeof(CompareResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Compare([FromBody] CompareRequestDto dto, CancellationToken ct)
    {
        try
        {
            var result = await _comparison.CompareAsync(dto, ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Ask the AI car advisor for personalised recommendations.
    /// Falls back to a rule-based engine if no OpenAI key is configured.
    /// </summary>
    [HttpPost("advisor")]
    [ProducesResponseType(typeof(AdvisorResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAdvisorRecommendations([FromBody] AdvisorRequestDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _advisor.GetRecommendationsAsync(dto, ct);
        return Ok(result);
    }
}
