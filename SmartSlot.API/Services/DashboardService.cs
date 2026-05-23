using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Dashboard;
using SmartSlot.API.Enums;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var totalBusinesses = await _context.Businesses.CountAsync();
        var totalOffers = await _context.Offers.CountAsync();
        var totalSlots = await _context.Slots.CountAsync();
        
        var activeBookings = await _context.Bookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .ToListAsync();

        var totalBookingsCount = activeBookings.Count;

        // Fixed: Changed .Price to .OfferPrice to match your true database schema column
        var totalRevenue = await _context.Bookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Include(b => b.Offer)
            .SumAsync(b => b.Offer.OfferPrice);

        var activeOffersCount = await _context.Offers
            .Where(o => o.Status == OfferStatus.Active)
            .CountAsync();

        var totalCapacity = await _context.Slots.SumAsync(s => s.Capacity);
        var totalBookedSpots = activeBookings.Sum(b => b.PeopleCount);
        double occupancyRate = totalCapacity > 0 
            ? Math.Round(((double)totalBookedSpots / totalCapacity) * 100, 2) 
            : 0;

        return new DashboardSummaryDto
        {
            TotalBusinesses = totalBusinesses,
            TotalOffers = totalOffers,
            TotalSlots = totalSlots,
            TotalBookings = totalBookingsCount,
            TotalRevenue = totalRevenue,
            ActiveOffers = activeOffersCount,
            OccupancyRate = occupancyRate // Fixed: Swapped out 'CompassRate' for 'OccupancyRate'
        };
    }

    public async Task<List<RevenueAnalyticsDto>> GetRevenueAnalyticsAsync()
    {
        // Fixed: Changed .Price to .OfferPrice and resolved the nullability warning assignment
        var revenueData = await _context.Bookings
            .Where(b => b.Status != BookingStatus.Cancelled)
            .Include(b => b.Offer)
            .GroupBy(b => b.Offer.Title)
            .Select(g => new RevenueAnalyticsDto
            {
                OfferTitle = g.Key ?? "Unknown Offer",
                TotalBookings = g.Count(),
                Revenue = g.Sum(b => b.Offer.OfferPrice)
            })
            .OrderByDescending(r => r.Revenue)
            .ToListAsync();

        return revenueData;
    }

    public async Task<List<RecentBookingDto>> GetRecentBookingsAsync()
    {
        return await _context.Bookings
            .Include(b => b.Offer)
            .OrderByDescending(b => b.CreatedAt)
            .Take(5)
            .Select(b => new RecentBookingDto
            {
                BookingReference = b.BookingReference ?? string.Empty,
                CustomerName = b.CustomerName ?? string.Empty,
                OfferTitle = b.Offer.Title ?? "Unknown Offer",
                PeopleCount = b.PeopleCount,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();
    }
}
