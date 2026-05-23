using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Business;
using SmartSlot.API.Entities;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class BusinessService : IBusinessService
{
    private readonly AppDbContext _context;

    public BusinessService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BusinessResponseDto> CreateBusinessAsync(
        CreateBusinessDto dto
    )
    {
        var business = new Business
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            BusinessType = dto.BusinessType,
            OwnerName = dto.OwnerName,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            City = dto.City,
            OpeningTime = dto.OpeningTime,
            ClosingTime = dto.ClosingTime
        };

        _context.Businesses.Add(business);

        await _context.SaveChangesAsync();

        return new BusinessResponseDto
        {
            Id = business.Id,
            Name = business.Name,
            BusinessType = business.BusinessType,
            OwnerName = business.OwnerName,
            Phone = business.Phone,
            Email = business.Email,
            Address = business.Address,
            City = business.City
        };
    }

    public async Task<List<BusinessResponseDto>>
        GetAllBusinessesAsync()
    {
        return await _context.Businesses
            .Select(b => new BusinessResponseDto
            {
                Id = b.Id,
                Name = b.Name,
                BusinessType = b.BusinessType,
                OwnerName = b.OwnerName,
                Phone = b.Phone,
                Email = b.Email,
                Address = b.Address,
                City = b.City
            })
            .ToListAsync();
    }

    public async Task<BusinessResponseDto?>
        GetBusinessByIdAsync(Guid id)
    {
        return await _context.Businesses
            .Where(b => b.Id == id)
            .Select(b => new BusinessResponseDto
            {
                Id = b.Id,
                Name = b.Name,
                BusinessType = b.BusinessType,
                OwnerName = b.OwnerName,
                Phone = b.Phone,
                Email = b.Email,
                Address = b.Address,
                City = b.City
            })
            .FirstOrDefaultAsync();
    }
}