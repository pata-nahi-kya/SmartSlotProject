using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.DTOs.Booking;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(
        IBookingService bookingService
    )
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking(
        CreateBookingDto dto
    )
    {
        var booking =
            await _bookingService
                .CreateBookingAsync(dto);

        return Ok(booking);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings =
            await _bookingService
                .GetAllBookingsAsync();

        return Ok(bookings);
    }
}