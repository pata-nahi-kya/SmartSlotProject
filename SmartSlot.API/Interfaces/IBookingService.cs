using SmartSlot.API.DTOs.Booking;

namespace SmartSlot.API.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(
        CreateBookingDto dto
    );

    Task<List<BookingResponseDto>> GetAllBookingsAsync();
}