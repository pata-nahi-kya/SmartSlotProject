using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Common;
using SmartSlot.API.DTOs.Offer;
using SmartSlot.API.Entities;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class OfferService : IOfferService
{
    private readonly AppDbContext _context;

    public OfferService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SmartSlot.API.DTOs.Offer.OfferResponseDto> CreateOfferAsync(SmartSlot.API.DTOs.Offer.CreateOfferDto dto)
    {
        var businessExists = await _context.Businesses
            .AnyAsync(x => x.Id == dto.BusinessId);

        if (!businessExists)
        {
            throw new Exception("Business not found");
        }

        // Calculate a safe fallback discount percentage inline
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
            Status = Enums.OfferStatus.Active
        };

        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();

        return new SmartSlot.API.DTOs.Offer.OfferResponseDto
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

    public async Task<List<SmartSlot.API.DTOs.Offer.OfferResponseDto>> GetAllOffersAsync()
    {
        return await _context.Offers
            .Select(o => new SmartSlot.API.DTOs.Offer.OfferResponseDto
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

    public async Task<SmartSlot.API.DTOs.Offer.OfferResponseDto?> GetOfferByIdAsync(Guid id)
    {
        return await _context.Offers
            .Where(o => o.Id == id)
            .Select(o => new SmartSlot.API.DTOs.Offer.OfferResponseDto
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

    public async Task<PaginatedResponseDto<SmartSlot.API.DTOs.Offer.OfferResponseDto>> SearchOffersAsync(OfferSearchDto dto)
    {
        var query = _context.Offers
            .Include(o => o.Business)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(dto.Search))
        {
            query = query.Where(o => o.Title.Contains(dto.Search) || o.Description.Contains(dto.Search));
        }

        if (!string.IsNullOrWhiteSpace(dto.City))
        {
            query = query.Where(o => o.Business.City == dto.City);
        }

        if (!string.IsNullOrWhiteSpace(dto.BusinessType))
        {
            query = query.Where(o => o.Business.BusinessType == dto.BusinessType);
        }

        if (dto.MinPrice.HasValue)
        {
            query = query.Where(o => o.OfferPrice >= dto.MinPrice.Value);
        }

        if (dto.MaxPrice.HasValue)
        {
            query = query.Where(o => o.OfferPrice <= dto.MaxPrice.Value);
        }

        query = dto.SortBy?.ToLower() switch
        {
            "price" => query.OrderBy(o => o.OfferPrice),
            "price_desc" => query.OrderByDescending(o => o.OfferPrice),
            "title" => query.OrderBy(o => o.Title),
            _ => query.OrderByDescending(o => o.StartDate)
        };

        var totalRecords = await query.CountAsync();
        var pageNumber = dto.Page < 1 ? 1 : dto.Page;
        var pageSize = dto.PageSize < 1 ? 10 : dto.PageSize;

        var offers = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new SmartSlot.API.DTOs.Offer.OfferResponseDto
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

        var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

        return new PaginatedResponseDto<SmartSlot.API.DTOs.Offer.OfferResponseDto>
        {
            Data = offers,
            TotalRecords = totalRecords,
            CurrentPage = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }
}
