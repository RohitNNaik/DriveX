using DriveX.Core.DTOs;
using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;

namespace DriveX.Infrastructure.Services;

public class LeadService : ILeadService
{
    private readonly ILeadRepository _repo;

    public LeadService(ILeadRepository repo) => _repo = repo;

    public async Task<LeadDto> CreateLeadAsync(CreateLeadDto dto, CancellationToken ct = default)
    {
        if (!Enum.TryParse<IntentType>(dto.Intent.Replace("_", ""), true, out var intent))
            intent = IntentType.General;

        var lead = new Lead
        {
            CarId   = dto.CarId,
            CarName = dto.CarName,
            Name    = dto.Name.Trim(),
            Phone   = dto.Phone.Trim(),
            City    = dto.City.Trim(),
            Intent  = intent,
            Status  = LeadStatus.New,
        };

        await _repo.CreateAsync(lead, ct);
        return ToDto(lead);
    }

    public async Task<List<LeadDto>> GetLeadsAsync(CancellationToken ct = default)
    {
        var leads = await _repo.GetAllAsync(ct);
        return leads.OrderByDescending(l => l.CreatedAt).Select(ToDto).ToList();
    }

    public async Task<LeadDto?> GetLeadByIdAsync(string id, CancellationToken ct = default)
    {
        var lead = await _repo.GetByIdAsync(id, ct);
        return lead is null ? null : ToDto(lead);
    }

    public async Task<bool> UpdateLeadStatusAsync(string id, UpdateLeadStatusDto dto, CancellationToken ct = default)
    {
        if (!Enum.TryParse<LeadStatus>(dto.Status, true, out var status)) return false;
        return await _repo.UpdateStatusAsync(id, status, ct);
    }

    private static LeadDto ToDto(Lead l) => new(
        l.Id ?? string.Empty,
        l.CarId,
        l.CarName,
        l.Name,
        l.Phone,
        l.City,
        l.Intent.ToString(),
        l.Status.ToString(),
        l.CreatedAt,
        l.UpdatedAt
    );
}
