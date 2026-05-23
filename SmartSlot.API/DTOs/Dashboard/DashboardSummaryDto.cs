namespace SmartSlot.API.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalBusinesses { get; set; }

    public int TotalOffers { get; set; }

    public int TotalSlots { get; set; }

    public int TotalBookings { get; set; }

    public decimal TotalRevenue { get; set; }

    public int ActiveOffers { get; set; }

    public double OccupancyRate { get; set; }
}