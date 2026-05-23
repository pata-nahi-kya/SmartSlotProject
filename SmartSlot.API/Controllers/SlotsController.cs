using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult>
        GetSlotsByOffer(Guid offerId)
    {
        var slots =
            await _slotService
                .GetSlotsByOfferAsync(offerId);

        return Ok(slots);
    }
}