using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dashboardService.GetDashboardSummaryAsync();
        return Ok(summary);
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue()
    {
        var revenue = await _dashboardService.GetRevenueAnalyticsAsync();
        return Ok(revenue);
    }

    [HttpGet("recent-bookings")]
    public async Task<IActionResult> GetRecentBookings()
    {
        var recent = await _dashboardService.GetRecentBookingsAsync();
        return Ok(recent);
    }
}
