using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Booking;
using SmartSlot.API.Entities;
using SmartSlot.API.Enums;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;

    public BookingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingDto dto)
    {
        var slot = await _context.Slots
            .Include(s => s.Bookings)
            .FirstOrDefaultAsync(s => s.Id == dto.SlotId);

        if (slot == null)
        {
            throw new Exception("Slot not found");
        }

        // Fixed: Swapped out the missing '.IsActive' boolean for your actual '.Status' enum type check
        // Fixed: Using SlotStatus.Available to match your exact enum definition
if (slot.Status != SlotStatus.Available)
{
    throw new Exception("Slot is inactive or fully occupied");
}


        var currentBookings = slot.Bookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Sum(b => b.PeopleCount);

        var remainingCapacity = slot.Capacity - currentBookings;

        if (dto.PeopleCount > remainingCapacity)
        {
            throw new Exception($"Only {remainingCapacity} spots remaining");
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            BookingReference = GenerateBookingReference(),
            OfferId = dto.OfferId,
            SlotId = dto.SlotId,
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone,
            CustomerEmail = dto.CustomerEmail,
            PeopleCount = dto.PeopleCount,
            SpecialNote = dto.SpecialNote,
            Status = BookingStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return new BookingResponseDto
        {
            Id = booking.Id,
            BookingReference = booking.BookingReference,
            CustomerName = booking.CustomerName,
            CustomerPhone = booking.CustomerPhone,
            PeopleCount = booking.PeopleCount,
            Status = booking.Status.ToString(),
            CreatedAt = booking.CreatedAt
        };
    }

    public async Task<List<BookingResponseDto>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Select(b => new BookingResponseDto
            {
                Id = b.Id,
                BookingReference = b.BookingReference,
                CustomerName = b.CustomerName,
                CustomerPhone = b.CustomerPhone,
                PeopleCount = b.PeopleCount,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();
    }

    private string GenerateBookingReference()
    {
        return $"BK-{DateTime.UtcNow.Ticks}";
    }
}
