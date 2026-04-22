using System.Linq.Expressions;

namespace DriveX.Core.Interfaces.Repositories;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<List<T>> GetAllAsync(CancellationToken ct = default);
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T> CreateAsync(T entity, CancellationToken ct = default);
    Task<bool> UpdateAsync(string id, T entity, CancellationToken ct = default);
    Task<bool> DeleteAsync(string id, CancellationToken ct = default);
    Task<long> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken ct = default);
    Task BulkInsertAsync(IEnumerable<T> entities, CancellationToken ct = default);
}
