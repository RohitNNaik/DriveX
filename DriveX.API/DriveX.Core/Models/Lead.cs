using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DriveX.Core.Models;

public class Lead
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("carId")]
    public string? CarId { get; set; }

    [BsonElement("carName")]
    public string? CarName { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("city")]
    public string City { get; set; } = string.Empty;

    [BsonElement("intent")]
    [BsonRepresentation(BsonType.String)]
    public IntentType Intent { get; set; } = IntentType.General;

    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public LeadStatus Status { get; set; } = LeadStatus.New;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
