using DriveX.Core.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DriveX.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Car> Cars =>
        _database.GetCollection<Car>("cars");

    public IMongoCollection<Lead> Leads =>
        _database.GetCollection<Lead>("leads");

    public IMongoDatabase Database => _database;
}
