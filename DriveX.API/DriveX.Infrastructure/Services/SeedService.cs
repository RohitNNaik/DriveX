using DriveX.Core.Interfaces.Repositories;
using DriveX.Core.Interfaces.Services;
using DriveX.Core.Models;
using Microsoft.Extensions.Logging;

namespace DriveX.Infrastructure.Services;

public class SeedService : ISeedService
{
    private readonly ICarRepository _repo;
    private readonly ILogger<SeedService> _logger;

    public SeedService(ICarRepository repo, ILogger<SeedService> logger)
    {
        _repo   = repo;
        _logger = logger;
    }

    public async Task<string> SeedAsync(CancellationToken ct = default)
    {
        if (await _repo.AnyAsync(ct))
        {
            _logger.LogInformation("Database already seeded — skipping.");
            return "Database already contains data. No seed applied.";
        }

        var cars = BuildCatalogue();
        await _repo.BulkInsertAsync(cars, ct);
        _logger.LogInformation("Seeded {Count} cars.", cars.Count);
        return $"Seeded {cars.Count} cars successfully.";
    }

    private static List<Car> BuildCatalogue() =>
    [
        // ── New Cars ──────────────────────────────────────────────────────
        new Car
        {
            Slug = "maruti-brezza-2024", Name = "Maruti Brezza", Brand = "Maruti", Model = "Brezza",
            Year = 2024, Price = 899000, Image = "/cars/brezza.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 19.8, Seating = 5, EngineCC = 1462, Power = 103, Torque = 137, Airbags = 6, Rating = 4.2,
            Pros = ["Best-in-class mileage", "Low maintenance", "Wide service network"],
            Cons = ["No 4WD option", "Slightly small boot"],
            Tags = [UsageTag.City, UsageTag.Family], IsFeatured = true
        },
        new Car
        {
            Slug = "tata-nexon-ev-2024", Name = "Tata Nexon EV", Brand = "Tata", Model = "Nexon EV",
            Year = 2024, Price = 1399000, Image = "/cars/nexon-ev.jpg",
            FuelType = FuelType.Electric, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 0, Seating = 5, EngineCC = 0, Power = 143, Torque = 250, Airbags = 6, Rating = 4.4,
            Pros = ["₹0 fuel cost", "Smooth drive", "5-star NCAP safety"],
            Cons = ["Charging infrastructure limited", "Long charge time"],
            Tags = [UsageTag.City, UsageTag.Highway], IsFeatured = true
        },
        new Car
        {
            Slug = "hyundai-creta-2024", Name = "Hyundai Creta", Brand = "Hyundai", Model = "Creta",
            Year = 2024, Price = 1100000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 17.0, Seating = 5, EngineCC = 1497, Power = 115, Torque = 144, Airbags = 6, Rating = 4.3,
            Pros = ["Premium interior", "Feature-loaded", "Panoramic sunroof"],
            Cons = ["Price premium vs rivals", "Turbo variant pricey"],
            Tags = [UsageTag.City, UsageTag.Family, UsageTag.Highway], IsFeatured = true
        },
        new Car
        {
            Slug = "maruti-swift-2024", Name = "Maruti Swift", Brand = "Maruti", Model = "Swift",
            Year = 2024, Price = 699000, Image = "/cars/swift.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.Hatchback,
            Mileage = 24.8, Seating = 5, EngineCC = 1197, Power = 82, Torque = 112, Airbags = 2, Rating = 4.0,
            Pros = ["Excellent fuel economy", "Fun to drive", "Low cost"],
            Cons = ["Rear space tight", "Basic features"],
            Tags = [UsageTag.City, UsageTag.Budget], IsFeatured = true
        },
        new Car
        {
            Slug = "honda-city-2024", Name = "Honda City", Brand = "Honda", Model = "City",
            Year = 2024, Price = 1200000, Image = "/cars/city.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.Sedan,
            Mileage = 18.3, Seating = 5, EngineCC = 1498, Power = 121, Torque = 145, Airbags = 6, Rating = 4.3,
            Pros = ["Spacious cabin", "Refined engine", "Good resale value"],
            Cons = ["No sunroof in base", "Ground clearance low"],
            Tags = [UsageTag.City, UsageTag.Highway, UsageTag.Family], IsFeatured = true
        },
        new Car
        {
            Slug = "mahindra-scorpio-n-2024", Name = "Mahindra Scorpio N", Brand = "Mahindra", Model = "Scorpio N",
            Year = 2024, Price = 1350000, Image = "/cars/scorpio-n.jpg",
            FuelType = FuelType.Diesel, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 15.2, Seating = 7, EngineCC = 2184, Power = 174, Torque = 400, Airbags = 6, Rating = 4.5,
            Pros = ["Powerful diesel", "7-seater", "4WD option", "5-star NCAP"],
            Cons = ["NVH could be better", "Large footprint for city"],
            Tags = [UsageTag.Highway, UsageTag.OffRoad, UsageTag.Family], IsFeatured = true
        },
        new Car
        {
            Slug = "toyota-innova-crysta-2024", Name = "Toyota Innova Crysta", Brand = "Toyota", Model = "Innova Crysta",
            Year = 2024, Price = 2000000, Image = "/cars/innova.jpg",
            FuelType = FuelType.Diesel, Transmission = TransmissionType.Manual, BodyType = BodyType.MPV,
            Mileage = 14.8, Seating = 8, EngineCC = 2393, Power = 148, Torque = 343, Airbags = 7, Rating = 4.6,
            Pros = ["Legendary reliability", "8-seater", "Resale king"],
            Cons = ["Expensive price", "No petrol auto"],
            Tags = [UsageTag.Family, UsageTag.Highway]
        },
        new Car
        {
            Slug = "kia-seltos-2024", Name = "Kia Seltos", Brand = "Kia", Model = "Seltos",
            Year = 2024, Price = 1050000, Image = "/cars/seltos.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 16.5, Seating = 5, EngineCC = 1497, Power = 115, Torque = 144, Airbags = 6, Rating = 4.3,
            Pros = ["360 camera", "Large touchscreen", "Build quality"],
            Cons = ["Expensive top variants", "Boot space average"],
            Tags = [UsageTag.City, UsageTag.Highway]
        },
        new Car
        {
            Slug = "tata-punch-2024", Name = "Tata Punch", Brand = "Tata", Model = "Punch",
            Year = 2024, Price = 625000, Image = "/cars/punch.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.SUV,
            Mileage = 20.1, Seating = 5, EngineCC = 1199, Power = 88, Torque = 115, Airbags = 2, Rating = 4.1,
            Pros = ["5-star NCAP safety", "SUV stance for less", "Great mileage"],
            Cons = ["Small engine", "Limited features base"],
            Tags = [UsageTag.City, UsageTag.Budget]
        },
        new Car
        {
            Slug = "volkswagen-virtus-2024", Name = "Volkswagen Virtus", Brand = "Volkswagen", Model = "Virtus",
            Year = 2024, Price = 1150000, Image = "/cars/virtus.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.Sedan,
            Mileage = 19.4, Seating = 5, EngineCC = 1498, Power = 150, Torque = 250, Airbags = 6, Rating = 4.4,
            Pros = ["European build quality", "Punchy 1.5 TSI", "Best-in-class handling"],
            Cons = ["Expensive service", "Boot lip high"],
            Tags = [UsageTag.Highway, UsageTag.City]
        },

        // ── Used Cars ─────────────────────────────────────────────────────
        new Car
        {
            Slug = "used-swift-2021", Name = "Maruti Swift", Brand = "Maruti", Model = "Swift",
            Year = 2021, Price = 500000, Image = "/cars/swift.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.Hatchback,
            Mileage = 22.0, Seating = 5, EngineCC = 1197, Power = 82, Torque = 112, Airbags = 2, Rating = 3.9,
            Pros = ["Low price", "Low km driven"], Cons = ["Older model"],
            Tags = [UsageTag.City, UsageTag.Budget], IsUsed = true, KmDriven = 32000, Owners = 1
        },
        new Car
        {
            Slug = "used-creta-2022", Name = "Hyundai Creta", Brand = "Hyundai", Model = "Creta",
            Year = 2022, Price = 950000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 16.5, Seating = 5, EngineCC = 1497, Power = 115, Torque = 144, Airbags = 6, Rating = 4.2,
            Pros = ["Well-maintained", "Single owner", "Full service history"], Cons = ["2 years old"],
            Tags = [UsageTag.City, UsageTag.Family], IsUsed = true, KmDriven = 28000, Owners = 1
        },
        new Car
        {
            Slug = "used-innova-2020", Name = "Toyota Innova Crysta", Brand = "Toyota", Model = "Innova Crysta",
            Year = 2020, Price = 1600000, Image = "/cars/innova.jpg",
            FuelType = FuelType.Diesel, Transmission = TransmissionType.Manual, BodyType = BodyType.MPV,
            Mileage = 14.0, Seating = 8, EngineCC = 2393, Power = 148, Torque = 343, Airbags = 7, Rating = 4.5,
            Pros = ["Excellent reliability", "Low operational cost"], Cons = ["Higher km driven"],
            Tags = [UsageTag.Family, UsageTag.Highway], IsUsed = true, KmDriven = 65000, Owners = 1
        },

        // ── Creta Variants ────────────────────────────────────────────────
        new Car
        {
            Slug = "creta-e-petrol-mt", Name = "Hyundai Creta E Petrol MT", Brand = "Hyundai",
            Model = "Creta", Variant = "E Petrol MT", Year = 2024, Price = 1099000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.SUV,
            Mileage = 17.4, Seating = 5, EngineCC = 1497, Power = 115, Torque = 144, Airbags = 6, Rating = 4.0,
            Pros = ["Lowest price entry", "Best mileage in Creta range"], Cons = ["No sunroof", "Manual only"],
            Tags = [UsageTag.City, UsageTag.Budget]
        },
        new Car
        {
            Slug = "creta-s-petrol-at", Name = "Hyundai Creta S Petrol AT", Brand = "Hyundai",
            Model = "Creta", Variant = "S Petrol AT", Year = 2024, Price = 1295000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 17.0, Seating = 5, EngineCC = 1497, Power = 115, Torque = 144, Airbags = 6, Rating = 4.3,
            Pros = ["Auto transmission", "Good features", "Sunroof"], Cons = ["Mid-range price"],
            Tags = [UsageTag.City, UsageTag.Family]
        },
        new Car
        {
            Slug = "creta-sx-diesel-at", Name = "Hyundai Creta SX Diesel AT", Brand = "Hyundai",
            Model = "Creta", Variant = "SX Diesel AT", Year = 2024, Price = 1650000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Diesel, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 21.4, Seating = 5, EngineCC = 1493, Power = 115, Torque = 250, Airbags = 6, Rating = 4.4,
            Pros = ["Outstanding diesel mileage", "Most torque", "Loaded features"], Cons = ["Expensive", "Diesel NVH"],
            Tags = [UsageTag.Highway, UsageTag.Family]
        },
        new Car
        {
            Slug = "creta-sxo-turbo-petrol-dct", Name = "Hyundai Creta SX(O) Turbo Petrol DCT", Brand = "Hyundai",
            Model = "Creta", Variant = "SX(O) Turbo Petrol DCT", Year = 2024, Price = 1950000, Image = "/cars/creta.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 16.8, Seating = 5, EngineCC = 1482, Power = 158, Torque = 253, Airbags = 6, Rating = 4.6,
            Pros = ["Sporty turbo engine", "Panoramic sunroof", "ADAS", "Best in class features"],
            Cons = ["Most expensive Creta", "Lower mileage"],
            Tags = [UsageTag.City, UsageTag.Highway]
        },

        // ── Nexon EV Variants ─────────────────────────────────────────────
        new Car
        {
            Slug = "nexon-ev-medium-range", Name = "Tata Nexon EV Medium Range", Brand = "Tata",
            Model = "Nexon EV", Variant = "Medium Range (45 kWh)", Year = 2024, Price = 1399000, Image = "/cars/nexon-ev.jpg",
            FuelType = FuelType.Electric, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 0, Seating = 5, EngineCC = 0, Power = 143, Torque = 250, Airbags = 6, Rating = 4.3,
            Pros = ["Accessible price", "Good city range", "5-star safety"],
            Cons = ["Smaller battery", "AC range drops significantly"],
            Tags = [UsageTag.City, UsageTag.Highway]
        },
        new Car
        {
            Slug = "nexon-ev-long-range", Name = "Tata Nexon EV Long Range", Brand = "Tata",
            Model = "Nexon EV", Variant = "Long Range (60 kWh)", Year = 2024, Price = 1799000, Image = "/cars/nexon-ev.jpg",
            FuelType = FuelType.Electric, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 0, Seating = 5, EngineCC = 0, Power = 167, Torque = 280, Airbags = 6, Rating = 4.5,
            Pros = ["500+ km range", "Fast charge support", "More power"],
            Cons = ["₹4L more than MR", "Heavier battery"],
            Tags = [UsageTag.City, UsageTag.Highway]
        },

        // ── Swift Variants ────────────────────────────────────────────────
        new Car
        {
            Slug = "swift-lxi-petrol-mt", Name = "Maruti Swift LXi Petrol MT", Brand = "Maruti",
            Model = "Swift", Variant = "LXi Petrol MT", Year = 2024, Price = 647000, Image = "/cars/swift.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.Hatchback,
            Mileage = 24.8, Seating = 5, EngineCC = 1197, Power = 82, Torque = 112, Airbags = 2, Rating = 3.9,
            Pros = ["Most affordable Swift", "Highest mileage"], Cons = ["Basic features", "Only 2 airbags"],
            Tags = [UsageTag.City, UsageTag.Budget]
        },
        new Car
        {
            Slug = "swift-vxi-petrol-mt", Name = "Maruti Swift VXi Petrol MT", Brand = "Maruti",
            Model = "Swift", Variant = "VXi Petrol MT", Year = 2024, Price = 730000, Image = "/cars/swift.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.Hatchback,
            Mileage = 24.8, Seating = 5, EngineCC = 1197, Power = 82, Torque = 112, Airbags = 6, Rating = 4.1,
            Pros = ["6 airbags", "Touchscreen", "360 camera"], Cons = ["Manual only in this trim"],
            Tags = [UsageTag.City, UsageTag.Budget]
        },
        new Car
        {
            Slug = "swift-zxi-plus-cng", Name = "Maruti Swift ZXi+ CNG", Brand = "Maruti",
            Model = "Swift", Variant = "ZXi+ CNG", Year = 2024, Price = 860000, Image = "/cars/swift.jpg",
            FuelType = FuelType.CNG, Transmission = TransmissionType.Manual, BodyType = BodyType.Hatchback,
            Mileage = 32.85, Seating = 5, EngineCC = 1197, Power = 69, Torque = 95, Airbags = 6, Rating = 4.0,
            Pros = ["Best-in-class CNG mileage", "Low running cost"],
            Cons = ["Boot space reduced by CNG kit", "Slightly less power"],
            Tags = [UsageTag.City, UsageTag.Budget]
        },
        new Car
        {
            Slug = "swift-zxi-plus-at", Name = "Maruti Swift ZXi+ AT", Brand = "Maruti",
            Model = "Swift", Variant = "ZXi+ Petrol AT", Year = 2024, Price = 895000, Image = "/cars/swift.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Automatic, BodyType = BodyType.Hatchback,
            Mileage = 22.1, Seating = 5, EngineCC = 1197, Power = 82, Torque = 112, Airbags = 6, Rating = 4.2,
            Pros = ["Auto gearbox", "Full features", "Fun to drive"],
            Cons = ["Top price Swift", "Slight mileage drop vs MT"],
            Tags = [UsageTag.City]
        },

        // ── Scorpio N Variants ────────────────────────────────────────────
        new Car
        {
            Slug = "scorpio-n-z2-petrol-mt", Name = "Mahindra Scorpio N Z2 Petrol MT", Brand = "Mahindra",
            Model = "Scorpio N", Variant = "Z2 Petrol MT", Year = 2024, Price = 1349000, Image = "/cars/scorpio-n.jpg",
            FuelType = FuelType.Petrol, Transmission = TransmissionType.Manual, BodyType = BodyType.SUV,
            Mileage = 15.2, Seating = 6, EngineCC = 1997, Power = 200, Torque = 380, Airbags = 6, Rating = 4.3,
            Pros = ["Powerful petrol", "Entry price", "6-seater"], Cons = ["No 4WD", "Less features"],
            Tags = [UsageTag.City, UsageTag.Highway]
        },
        new Car
        {
            Slug = "scorpio-n-z8-diesel-at-4wd", Name = "Mahindra Scorpio N Z8 Diesel AT 4WD", Brand = "Mahindra",
            Model = "Scorpio N", Variant = "Z8 Diesel AT 4WD", Year = 2024, Price = 2499000, Image = "/cars/scorpio-n.jpg",
            FuelType = FuelType.Diesel, Transmission = TransmissionType.Automatic, BodyType = BodyType.SUV,
            Mileage = 15.2, Seating = 7, EngineCC = 2184, Power = 174, Torque = 400, Airbags = 6, Rating = 4.6,
            Pros = ["Real 4WD off-road", "7-seater", "5-star NCAP", "All bells & whistles"],
            Cons = ["Expensive", "Large city footprint"],
            Tags = [UsageTag.Highway, UsageTag.OffRoad, UsageTag.Family]
        },
    ];
}
