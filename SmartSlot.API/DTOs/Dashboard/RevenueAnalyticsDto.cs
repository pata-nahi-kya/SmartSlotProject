namespace SmartSlot.API.DTOs.Dashboard;

public class RevenueAnalyticsDto
{
    public string OfferTitle { get; set; } = string.Empty;

    public int TotalBookings { get; set; }

    public decimal Revenue { get; set; }
}