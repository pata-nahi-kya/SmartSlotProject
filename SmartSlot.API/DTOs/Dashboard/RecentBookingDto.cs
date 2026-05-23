namespace SmartSlot.API.DTOs.Dashboard;

public class RecentBookingDto
{
    public string BookingReference { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string OfferTitle { get; set; } = string.Empty;

    public int PeopleCount { get; set; }

    public DateTime CreatedAt { get; set; }
}