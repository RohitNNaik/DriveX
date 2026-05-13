namespace DriveX.Core.Interfaces.Services;

public interface ISeedService
{
    Task<string> SeedAsync(CancellationToken ct = default);
}
