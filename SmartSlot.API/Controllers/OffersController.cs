using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.DTOs.Offer;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OfferController : ControllerBase
{
    private readonly IOfferService _offerService;

    public OfferController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> CreateOffer(CreateOfferDto dto)
    {
        var offer = await _offerService.CreateOfferAsync(dto);
        return Ok(offer);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOffers()
    {
        var offers = await _offerService.GetAllOffersAsync();
        return Ok(offers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOfferById(Guid id)
    {
        var offer = await _offerService.GetOfferByIdAsync(id);

        if (offer == null)
        {
            return NotFound(new { message = "Offer not found" });
        }

        return Ok(offer);
    }

    // 🚀 ADD ONLY THIS NEW METHOD AT THE BOTTOM:
    [HttpGet("search")]
    public async Task<IActionResult> SearchOffers([FromQuery] OfferSearchDto dto)
    {
        var result = await _offerService.SearchOffersAsync(dto);
        return Ok(result);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOffer(Guid id)
    {
        var deleted = await _offerService.DeleteOfferAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = "Offer not found" });
        }

        return Ok(new { message = "Offer deleted successfully" });
    }
}
