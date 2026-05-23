using SmartSlot.API.DTOs.Slot;

namespace SmartSlot.API.Interfaces;

public interface ISlotService
{
    Task<List<SlotResponseDto>>
        GetSlotsByOfferAsync(Guid offerId);
}