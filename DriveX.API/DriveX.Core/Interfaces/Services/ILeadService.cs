using DriveX.Core.DTOs;
using DriveX.Core.Models;

namespace DriveX.Core.Interfaces.Services;

public interface ILeadService
{
    Task<LeadDto> CreateLeadAsync(CreateLeadDto dto, CancellationToken ct = default);
    Task<List<LeadDto>> GetLeadsAsync(CancellationToken ct = default);
    Task<LeadDto?> GetLeadByIdAsync(string id, CancellationToken ct = default);
    Task<bool> UpdateLeadStatusAsync(string id, UpdateLeadStatusDto dto, CancellationToken ct = default);
}
