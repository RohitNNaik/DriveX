namespace DriveX.Infrastructure.Data;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = "drivex";
    public string CarsCollection { get; set; } = "cars";
    public string LeadsCollection { get; set; } = "leads";
}
