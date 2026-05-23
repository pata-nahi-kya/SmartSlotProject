using SmartSlot.API.DTOs.Common;
using SmartSlot.API.DTOs.Offer;

namespace SmartSlot.API.Interfaces;

public interface IOfferService
{
    Task<SmartSlot.API.DTOs.Offer.OfferResponseDto> CreateOfferAsync(SmartSlot.API.DTOs.Offer.CreateOfferDto dto);
    Task<List<SmartSlot.API.DTOs.Offer.OfferResponseDto>> GetAllOffersAsync();
    Task<SmartSlot.API.DTOs.Offer.OfferResponseDto?> GetOfferByIdAsync(Guid id);
    Task<PaginatedResponseDto<SmartSlot.API.DTOs.Offer.OfferResponseDto>> SearchOffersAsync(OfferSearchDto dto);
}
