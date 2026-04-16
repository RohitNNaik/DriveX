using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DriveX.Core.Models;

public class Car
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("slug")]
    public string Slug { get; set; } = string.Empty;   // e.g. "maruti-brezza-2024"

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("brand")]
    public string Brand { get; set; } = string.Empty;

    [BsonElement("model")]
    public string Model { get; set; } = string.Empty;

    [BsonElement("variant")]
    public string? Variant { get; set; }

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("image")]
    public string Image { get; set; } = string.Empty;

    [BsonElement("fuelType")]
    [BsonRepresentation(BsonType.String)]
    public FuelType FuelType { get; set; }

    [BsonElement("transmission")]
    [BsonRepresentation(BsonType.String)]
    public TransmissionType Transmission { get; set; }

    [BsonElement("bodyType")]
    [BsonRepresentation(BsonType.String)]
    public BodyType BodyType { get; set; }

    [BsonElement("mileage")]
    public double Mileage { get; set; }         // kmpl (0 for EV)

    [BsonElement("seating")]
    public int Seating { get; set; }

    [BsonElement("engineCC")]
    public int EngineCC { get; set; }           // 0 for EV

    [BsonElement("power")]
    public int Power { get; set; }              // bhp

    [BsonElement("torque")]
    public int Torque { get; set; }             // Nm

    [BsonElement("airbags")]
    public int Airbags { get; set; }

    [BsonElement("rating")]
    public double Rating { get; set; }          // out of 5

    [BsonElement("pros")]
    public List<string> Pros { get; set; } = [];

    [BsonElement("cons")]
    public List<string> Cons { get; set; } = [];

    [BsonElement("tags")]
    [BsonRepresentation(BsonType.String)]
    public List<UsageTag> Tags { get; set; } = [];

    [BsonElement("isUsed")]
    public bool IsUsed { get; set; }

    [BsonElement("kmDriven")]
    public int? KmDriven { get; set; }

    [BsonElement("owners")]
    public int? Owners { get; set; }

    [BsonElement("isFeatured")]
    public bool IsFeatured { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
