namespace SmartSlot.API.DTOs.Booking;

/// <summary>Limited booking info for unauthenticated reference lookup.</summary>
public class PublicBookingTrackerDto
{
    public string BookingReference { get; set; } = string.Empty;

    public string OfferTitle { get; set; } = string.Empty;

    public DateTime SlotStartTime { get; set; }

    public DateTime SlotEndTime { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string MaskedPhone { get; set; } = string.Empty;

    public int PeopleCount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
