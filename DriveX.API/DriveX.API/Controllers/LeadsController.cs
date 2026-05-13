using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace DriveX.API.Controllers;

[ApiController]
[Route("api/leads")]
[Produces("application/json")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _service;

    public LeadsController(ILeadService service) => _service = service;

    /// <summary>Submit a buyer lead / deal request.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(LeadDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> CreateLead([FromBody] CreateLeadDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var lead = await _service.CreateLeadAsync(dto, ct);
        return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, lead);
    }

    /// <summary>List all leads (internal use).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<LeadDto>), 200)]
    public async Task<IActionResult> GetLeads(CancellationToken ct)
    {
        var leads = await _service.GetLeadsAsync(ct);
        return Ok(leads);
    }

    /// <summary>Get a single lead by ID.</summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(LeadDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetLead(string id, CancellationToken ct)
    {
        var lead = await _service.GetLeadByIdAsync(id, ct);
        return lead is null ? NotFound(new { message = $"Lead '{id}' not found." }) : Ok(lead);
    }

    /// <summary>Update the status of a lead.</summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateLeadStatusDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = await _service.UpdateLeadStatusAsync(id, dto, ct);
        return updated ? NoContent() : NotFound(new { message = $"Lead '{id}' not found or invalid status." });
    }
}
