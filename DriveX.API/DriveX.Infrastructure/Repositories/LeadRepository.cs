using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Models;
using DriveX.Infrastructure.Data;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DriveX.Infrastructure.Repositories;

public class LeadRepository : BaseRepository<Lead>, ILeadRepository
{
    public LeadRepository(MongoDbContext context) : base(context.Leads) { }

    public async Task<bool> UpdateStatusAsync(string id, LeadStatus status, CancellationToken ct = default)
    {
        if (!ObjectId.TryParse(id, out _)) return false;

        var filter = Builders<Lead>.Filter.Eq("_id", ObjectId.Parse(id));
        var update = Builders<Lead>.Update
            .Set(l => l.Status, status)
            .Set(l => l.UpdatedAt, DateTime.UtcNow);

        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: ct);
        return result.ModifiedCount > 0;
    }
}
