using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SmartSlot.API.DTOs.Booking;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private static readonly Regex BookingReferenceRegex = new(
        @"^BK-[0-9]{10,22}$",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    [EnableRateLimiting("booking-lookup")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
    {
        var booking = await _bookingService.CreateBookingAsync(dto);
        return Ok(booking);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(Guid id, [FromBody] UpdateBookingStatusDto dto)
    {
        var booking = await _bookingService.UpdateBookingStatusAsync(id, dto);
        if (booking == null)
        {
            return NotFound(new { message = "Booking not found" });
        }

        return Ok(booking);
    }

    [Authorize(Policy = "CustomerOnly")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyBookings()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var bookings = await _bookingService.GetBookingsByCustomerEmailAsync(email);
        return Ok(bookings);
    }

    [Authorize(Policy = "CustomerOnly")]
    [HttpPut("me/{id}/cancel")]
    public async Task<IActionResult> CancelMyBooking(Guid id)
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var booking = await _bookingService.CancelBookingForCustomerAsync(id, email);
        if (booking == null)
        {
            return NotFound(new { message = "Booking not found" });
        }

        return Ok(booking);
    }

    [HttpGet("reference/{reference}")]
    [EnableRateLimiting("booking-lookup")]
    public async Task<IActionResult> GetBookingByReference(string reference)
    {
        if (!IsValidBookingReference(reference))
        {
            return BadRequest(new { message = "Invalid booking reference format" });
        }

        var booking = await _bookingService.GetBookingByReferenceAsync(reference);
        if (booking == null)
        {
            return NotFound(new { message = "Booking not found" });
        }

        return Ok(booking);
    }

    private static bool IsValidBookingReference(string reference)
    {
        if (string.IsNullOrWhiteSpace(reference) || reference.Length > 30)
        {
            return false;
        }

        return BookingReferenceRegex.IsMatch(reference.Trim());
    }
}
