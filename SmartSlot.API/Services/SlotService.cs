using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Slot;
using SmartSlot.API.Enums;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class SlotService : ISlotService
{
    private readonly AppDbContext _context;

    public SlotService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SlotResponseDto>> GetSlotsByOfferAsync(Guid offerId)
    {
        var slots = await _context.Slots
            .Include(s => s.Bookings)
            .Where(s => s.OfferId == offerId)
            .ToListAsync();

        return slots.Select(slot =>
        {
            var bookedCount = slot.Bookings
                .Where(b => b.Status != BookingStatus.Cancelled)
                .Sum(b => b.PeopleCount);

            return new SlotResponseDto
            {
                Id = slot.Id,
                OfferId = slot.OfferId,
                
                // Fixed: Combined your SlotDate with your Start/End TimeSpan structures
                StartTime = slot.SlotDate.Date + slot.StartTime,
                EndTime = slot.SlotDate.Date + slot.EndTime,
                
                Capacity = slot.Capacity,
                IsAvailable = bookedCount < slot.Capacity
            };
        }).ToList();
    }
}
