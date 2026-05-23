namespace SmartSlot.API.DTOs.Booking;

public class BookingResponseDto
{
    public Guid Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public int PeopleCount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}