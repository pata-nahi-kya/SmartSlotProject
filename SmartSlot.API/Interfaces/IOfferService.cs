using SmartSlot.API.DTOs.Offer;

namespace SmartSlot.API.Interfaces;

public interface IOfferService
{
    Task<OfferResponseDto> CreateOfferAsync(
        CreateOfferDto dto
    );

    Task<List<OfferResponseDto>> GetAllOffersAsync();

    Task<OfferResponseDto?> GetOfferByIdAsync(
        Guid id
    );
}