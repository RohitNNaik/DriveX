namespace DriveX.Core.Models;

public enum FuelType
{
    Petrol,
    Diesel,
    Electric,
    Hybrid,
    CNG
}

public enum TransmissionType
{
    Manual,
    Automatic
}

public enum BodyType
{
    SUV,
    Sedan,
    Hatchback,
    MPV,
    Coupe
}

public enum UsageTag
{
    City,
    Highway,
    Family,
    OffRoad,
    Budget
}

public enum IntentType
{
    Buy,
    TestDrive,
    Loan,
    Insurance,
    General
}

public enum LeadStatus
{
    New,
    Contacted,
    Converted,
    Closed
}

public enum CompareMode
{
    DifferentCars,
    SameModelVariants
}

public enum CreditScore
{
    Excellent,
    Good,
    Fair
}
