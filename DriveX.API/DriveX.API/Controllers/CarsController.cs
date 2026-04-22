using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/cars")]
[Produces("application/json")]
public class CarsController : ControllerBase
{
    private readonly ICarService _service;

    public CarsController(ICarService service) => _service = service;

    /// <summary>List new cars with optional filters.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<CarDto>), 200)]
    public async Task<IActionResult> GetCars(
        [FromQuery] string? fuelType,
        [FromQuery] string? bodyType,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? usageTag,
        CancellationToken ct)
    {
        var filter = new CarFilterDto(fuelType, bodyType, brand, minPrice, maxPrice, usageTag);
        var cars   = await _service.GetCarsAsync(filter, ct);
        return Ok(cars);
    }

    /// <summary>Get a single car by MongoDB ObjectId or slug.</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CarDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetCar(string id, CancellationToken ct)
    {
        var car = await _service.GetCarByIdAsync(id, ct);
        return car is null ? NotFound(new { message = $"Car '{id}' not found." }) : Ok(car);
    }

    /// <summary>Get all variants for a specific brand + model combination.</summary>
    [HttpGet("variants")]
    [ProducesResponseType(typeof(List<VariantSummaryDto>), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetVariants(
        [FromQuery] string brand,
        [FromQuery] string model,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(brand) || string.IsNullOrWhiteSpace(model))
            return BadRequest(new { message = "Both 'brand' and 'model' query parameters are required." });

        var variants = await _service.GetVariantsAsync(brand, model, ct);
        return Ok(variants);
    }

    /// <summary>List all models that have 2 or more variants (used by variant picker).</summary>
    [HttpGet("variant-models")]
    [ProducesResponseType(typeof(List<ModelVariantGroupDto>), 200)]
    public async Task<IActionResult> GetVariantModels(CancellationToken ct)
    {
        var groups = await _service.GetVariantModelsAsync(ct);
        return Ok(groups);
    }
}
