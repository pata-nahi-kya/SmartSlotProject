using SmartSlot.API.DTOs.Business;

namespace SmartSlot.API.Interfaces;

public interface IBusinessService
{
    Task<BusinessResponseDto> CreateBusinessAsync(
        CreateBusinessDto dto
    );

    Task<List<BusinessResponseDto>> GetAllBusinessesAsync();

    Task<BusinessResponseDto?> GetBusinessByIdAsync(
        Guid id
    );
}