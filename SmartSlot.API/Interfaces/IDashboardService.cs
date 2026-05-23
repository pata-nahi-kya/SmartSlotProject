using SmartSlot.API.DTOs.Dashboard;

namespace SmartSlot.API.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();

    Task<List<RevenueAnalyticsDto>> GetRevenueAnalyticsAsync();

    Task<List<RecentBookingDto>> GetRecentBookingsAsync();
}