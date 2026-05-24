namespace SmartSlot.API.DTOs.Booking;

public class CustomerBookingDto
{
    public Guid Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    public Guid OfferId { get; set; }

    public string OfferTitle { get; set; } = string.Empty;

    public decimal OfferPrice { get; set; }

    public DateTime SlotStartTime { get; set; }

    public DateTime SlotEndTime { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public int PeopleCount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
