using SmartSlot.API.DTOs.Slot;
using SmartSlot.API.Entities;
namespace SmartSlot.API.Interfaces;

public interface ISlotService
{
    Task<List<SlotResponseDto>>
        GetSlotsByOfferAsync(Guid offerId);
           Task<Slot> CreateSlotAsync(CreateSlotDto dto);
}