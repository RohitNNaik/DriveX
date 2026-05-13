using DriveX.Core.DTOs;

namespace DriveX.Core.Interfaces.Services;

public interface ICarService
{
    Task<List<CarDto>> GetCarsAsync(CarFilterDto filter, CancellationToken ct = default);
    Task<CarDto?> GetCarByIdAsync(string id, CancellationToken ct = default);
    Task<List<CarDto>> GetUsedCarsAsync(UsedCarFilterDto filter, CancellationToken ct = default);
    Task<List<VariantSummaryDto>> GetVariantsAsync(string brand, string model, CancellationToken ct = default);
    Task<List<ModelVariantGroupDto>> GetVariantModelsAsync(CancellationToken ct = default);
}
