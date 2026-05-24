using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.DTOs.Slot; // Ensure this namespace is imported for CreateSlotDto
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotController : ControllerBase
{
    private readonly ISlotService _slotService;

    public SlotController(
        ISlotService slotService
    )
    {
        _slotService = slotService;
    }

    [HttpGet("offer/{offerId}")]
    public async Task<IActionResult> GetSlotsByOffer(Guid offerId)
    {
        var slots = await _slotService.GetSlotsByOfferAsync(offerId);
        return Ok(slots);
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> CreateSlot([FromBody] CreateSlotDto dto)
    {
        // This assumes your ISlotService interface implements a method named CreateSlotAsync
        var slot = await _slotService.CreateSlotAsync(dto);

        // Returns HTTP 200 OK along with the newly created slot object data
        return Ok(slot);
    }
}
