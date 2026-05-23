using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Offer;
using SmartSlot.API.Entities;
using SmartSlot.API.Interfaces;
using SmartSlot.API.Enums;

namespace SmartSlot.API.Services;

public class OfferService : IOfferService
{
    private readonly AppDbContext _context;

    public OfferService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OfferResponseDto> CreateOfferAsync(CreateOfferDto dto)
    {
        var businessExists = await _context.Businesses
            .AnyAsync(x => x.Id == dto.BusinessId);

        if (!businessExists)
        {
            throw new Exception("Business not found");
        }

        // Calculate a fallback discount percentage if prices allow it
        double discount = dto.OriginalPrice > 0 
            ? (double)((dto.OriginalPrice - dto.OfferPrice) / dto.OriginalPrice * 100) 
            : 0;

        var offer = new Offer
        {
            Id = Guid.NewGuid(),
            BusinessId = dto.BusinessId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category ?? "General",
            OriginalPrice = dto.OriginalPrice,
            OfferPrice = dto.OfferPrice,
            DiscountPercentage = discount,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TermsAndConditions = dto.TermsAndConditions ?? "Standard terms apply.",
            Status = OfferStatus.Active // Default enum state from your system
        };

        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return new OfferResponseDto
        {
            Id = offer.Id,
            BusinessId = offer.BusinessId,
            Title = offer.Title,
            Description = offer.Description,
            Category = offer.Category,
            OriginalPrice = offer.OriginalPrice,
            OfferPrice = offer.OfferPrice,
            DiscountPercentage = offer.DiscountPercentage,
            StartDate = offer.StartDate,
            EndDate = offer.EndDate,
            TermsAndConditions = offer.TermsAndConditions,
            Status = offer.Status.ToString()
        };
    }

    public async Task<List<OfferResponseDto>> GetAllOffersAsync()
    {
        return await _context.Offers
            .Select(o => new OfferResponseDto
            {
                Id = o.Id,
                BusinessId = o.BusinessId,
                Title = o.Title,
                Description = o.Description,
                Category = o.Category,
                OriginalPrice = o.OriginalPrice,
                OfferPrice = o.OfferPrice,
                DiscountPercentage = o.DiscountPercentage,
                StartDate = o.StartDate,
                EndDate = o.EndDate,
                TermsAndConditions = o.TermsAndConditions,
                Status = o.Status.ToString()
            })
            .ToListAsync();
    }

    public async Task<OfferResponseDto?> GetOfferByIdAsync(Guid id)
    {
        return await _context.Offers
            .Where(o => o.Id == id)
            .Select(o => new OfferResponseDto
            {
                Id = o.Id,
                BusinessId = o.BusinessId,
                Title = o.Title,
                Description = o.Description,
                Category = o.Category,
                OriginalPrice = o.OriginalPrice,
                OfferPrice = o.OfferPrice,
                DiscountPercentage = o.DiscountPercentage,
                StartDate = o.StartDate,
                EndDate = o.EndDate,
                TermsAndConditions = o.TermsAndConditions,
                Status = o.Status.ToString()
            })
            .FirstOrDefaultAsync();
    }
}
