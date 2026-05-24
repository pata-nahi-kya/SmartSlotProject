using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.DTOs.Business;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BusinessController : ControllerBase
{
    private readonly IBusinessService _businessService;

    public BusinessController(
        IBusinessService businessService
    )
    {
        _businessService = businessService;
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> CreateBusiness(
        [FromBody] CreateBusinessDto dto
    )
    {
        var business =
            await _businessService
                .CreateBusinessAsync(dto);

        return Ok(business);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBusinesses()
    {
        var businesses =
            await _businessService
                .GetAllBusinessesAsync();

        return Ok(businesses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBusinessById(
        Guid id
    )
    {
        var business =
            await _businessService
                .GetBusinessByIdAsync(id);

        if (business == null)
        {
            return NotFound(new
            {
                message = "Business not found"
            });
        }

        return Ok(business);
    }
}