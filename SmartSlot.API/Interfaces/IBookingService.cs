using SmartSlot.API.DTOs.Booking;

namespace SmartSlot.API.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBookingAsync(
        CreateBookingDto dto
    );

    Task<List<BookingResponseDto>> GetAllBookingsAsync();

    Task<BookingResponseDto?> UpdateBookingStatusAsync(Guid id, UpdateBookingStatusDto dto);

    Task<List<CustomerBookingDto>> GetBookingsByCustomerEmailAsync(string email);

    Task<CustomerBookingDto?> CancelBookingForCustomerAsync(Guid id, string email);

    Task<PublicBookingTrackerDto?> GetBookingByReferenceAsync(string reference);
}