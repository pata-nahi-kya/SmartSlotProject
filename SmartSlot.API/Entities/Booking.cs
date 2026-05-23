using SmartSlot.API.Enums;

namespace SmartSlot.API.Entities;

public class Booking
{
    public Guid Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    public Guid OfferId { get; set; }

    public Offer Offer { get; set; } = null!;

    public Guid SlotId { get; set; }

    public Slot Slot { get; set; } = null!;

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public string? CustomerEmail { get; set; }

    public int PeopleCount { get; set; }

    public string? SpecialNote { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}