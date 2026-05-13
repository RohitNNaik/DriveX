using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/used-cars")]
[Produces("application/json")]
public class UsedCarsController : ControllerBase
{
    private readonly ICarService _service;

    public UsedCarsController(ICarService service) => _service = service;

    /// <summary>List used cars with optional filters.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<CarDto>), 200)]
    public async Task<IActionResult> GetUsedCars(
        [FromQuery] string? city,
        [FromQuery] int? maxKmDriven,
        [FromQuery] int? maxOwners,
        CancellationToken ct)
    {
        var filter = new UsedCarFilterDto(city, maxKmDriven, maxOwners);
        var cars   = await _service.GetUsedCarsAsync(filter, ct);
        return Ok(cars);
    }
}
