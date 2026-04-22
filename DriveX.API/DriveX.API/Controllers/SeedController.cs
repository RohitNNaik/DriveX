using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/seed")]
[Produces("application/json")]
public class SeedController : ControllerBase
{
    private readonly ISeedService _service;

    public SeedController(ISeedService service) => _service = service;

    /// <summary>
    /// Seeds MongoDB with the static car catalogue.
    /// Safe to call multiple times — will skip if data already exists.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<IActionResult> Seed(CancellationToken ct)
    {
        var message = await _service.SeedAsync(ct);
        return Ok(new { message });
    }
}
