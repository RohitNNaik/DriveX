using DriveX.Core.Models;

namespace DriveX.Core.Interfaces.Repositories;

public interface ILeadRepository : IRepository<Lead>
{
    Task<bool> UpdateStatusAsync(string id, LeadStatus status, CancellationToken ct = default);
}
