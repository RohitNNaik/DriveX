using System.Linq.Expressions;
using DriveX.Core.Interfaces.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DriveX.Infrastructure.Repositories;

public abstract class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly IMongoCollection<T> _collection;

    protected BaseRepository(IMongoCollection<T> collection)
    {
        _collection = collection;
    }

    public async Task<T?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        if (!ObjectId.TryParse(id, out _)) return null;
        var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
        return await _collection.Find(filter).FirstOrDefaultAsync(ct);
    }

    public async Task<List<T>> GetAllAsync(CancellationToken ct = default) =>
        await _collection.Find(_ => true).ToListAsync(ct);

    public async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default) =>
        await _collection.Find(predicate).ToListAsync(ct);

    public async Task<T> CreateAsync(T entity, CancellationToken ct = default)
    {
        await _collection.InsertOneAsync(entity, cancellationToken: ct);
        return entity;
    }

    public async Task<bool> UpdateAsync(string id, T entity, CancellationToken ct = default)
    {
        if (!ObjectId.TryParse(id, out _)) return false;
        var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await _collection.ReplaceOneAsync(filter, entity, cancellationToken: ct);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken ct = default)
    {
        if (!ObjectId.TryParse(id, out _)) return false;
        var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
        var result = await _collection.DeleteOneAsync(filter, ct);
        return result.DeletedCount > 0;
    }

    public async Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default)
    {
        var filter = predicate is not null
            ? Builders<T>.Filter.Where(predicate)
            : Builders<T>.Filter.Empty;
        return await _collection.CountDocumentsAsync(filter, cancellationToken: ct);
    }

    public async Task BulkInsertAsync(IEnumerable<T> entities, CancellationToken ct = default) =>
        await _collection.InsertManyAsync(entities, cancellationToken: ct);
}
