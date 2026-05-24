using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Booking;
using SmartSlot.API.Entities;
using SmartSlot.API.Enums;
using SmartSlot.API.Exceptions;
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
            throw new NotFoundException("Slot not found");
        }

        if (slot.Status != SlotStatus.Available)
        {
            throw new ValidationAppException("Slot is inactive or fully occupied");
        }


        var currentBookings = slot.Bookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Sum(b => b.PeopleCount);

        var remainingCapacity = slot.Capacity - currentBookings;

        if (dto.PeopleCount > remainingCapacity)
        {
            throw new ValidationAppException($"Only {remainingCapacity} spots remaining");
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

    public async Task<BookingResponseDto?> UpdateBookingStatusAsync(Guid id, UpdateBookingStatusDto dto)
    {
        if (!Enum.TryParse<BookingStatus>(dto.Status, ignoreCase: true, out var newStatus))
        {
            throw new ValidationAppException("Invalid booking status");
        }

        var booking = await _context.Bookings
            .Include(b => b.Slot)
            .ThenInclude(s => s!.Bookings)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return null;
        }

        booking.Status = newStatus;
        await _context.SaveChangesAsync();

        if (booking.Slot != null)
        {
            var activeBookings = booking.Slot.Bookings
                .Where(b => b.Status != BookingStatus.Cancelled)
                .Sum(b => b.PeopleCount);

            booking.Slot.Status = activeBookings >= booking.Slot.Capacity
                ? SlotStatus.Full
                : SlotStatus.Available;
            await _context.SaveChangesAsync();
        }

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

    public async Task<List<CustomerBookingDto>> GetBookingsByCustomerEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var bookings = await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .Where(b => b.CustomerEmail != null &&
                        b.CustomerEmail.ToLower() == normalizedEmail)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bookings.Select(MapToCustomerBookingDto).ToList();
    }

    public async Task<CustomerBookingDto?> CancelBookingForCustomerAsync(Guid id, string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var booking = await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .ThenInclude(s => s!.Bookings)
            .FirstOrDefaultAsync(b =>
                b.Id == id &&
                b.CustomerEmail != null &&
                b.CustomerEmail.ToLower() == normalizedEmail);

        if (booking == null)
        {
            return null;
        }

        if (booking.Status == BookingStatus.Cancelled ||
            booking.Status == BookingStatus.Completed)
        {
            throw new ValidationAppException("This booking cannot be cancelled");
        }

        booking.Status = BookingStatus.Cancelled;
        await _context.SaveChangesAsync();

        if (booking.Slot != null)
        {
            var activeBookings = booking.Slot.Bookings
                .Where(b => b.Status != BookingStatus.Cancelled)
                .Sum(b => b.PeopleCount);

            booking.Slot.Status = activeBookings >= booking.Slot.Capacity
                ? SlotStatus.Full
                : SlotStatus.Available;
            await _context.SaveChangesAsync();
        }

        return MapToCustomerBookingDto(booking);
    }

    public async Task<PublicBookingTrackerDto?> GetBookingByReferenceAsync(string reference)
    {
        var booking = await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .FirstOrDefaultAsync(b =>
                b.BookingReference.ToLower() == reference.Trim().ToLower());

        if (booking == null)
        {
            return null;
        }

        var slotStart = booking.Slot.SlotDate.Date.Add(booking.Slot.StartTime);
        var slotEnd = booking.Slot.SlotDate.Date.Add(booking.Slot.EndTime);

        return new PublicBookingTrackerDto
        {
            BookingReference = booking.BookingReference,
            OfferTitle = booking.Offer.Title,
            SlotStartTime = slotStart,
            SlotEndTime = slotEnd,
            CustomerName = booking.CustomerName,
            MaskedPhone = MaskPhone(booking.CustomerPhone),
            PeopleCount = booking.PeopleCount,
            Status = booking.Status.ToString(),
            CreatedAt = booking.CreatedAt
        };
    }

    private static string MaskPhone(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone) || phone.Length < 4)
        {
            return "****";
        }

        return new string('*', phone.Length - 4) + phone[^4..];
    }

    private static CustomerBookingDto MapToCustomerBookingDto(Booking b)
    {
        var slotStart = b.Slot.SlotDate.Date.Add(b.Slot.StartTime);
        var slotEnd = b.Slot.SlotDate.Date.Add(b.Slot.EndTime);

        return new CustomerBookingDto
        {
            Id = b.Id,
            BookingReference = b.BookingReference,
            OfferId = b.OfferId,
            OfferTitle = b.Offer.Title,
            OfferPrice = b.Offer.OfferPrice,
            SlotStartTime = slotStart,
            SlotEndTime = slotEnd,
            CustomerName = b.CustomerName,
            CustomerPhone = b.CustomerPhone,
            PeopleCount = b.PeopleCount,
            Status = b.Status.ToString(),
            CreatedAt = b.CreatedAt
        };
    }

    private string GenerateBookingReference()
    {
        return $"BK-{DateTime.UtcNow.Ticks}";
    }
}
