namespace SmartSlot.API.DTOs.Slot;

public class CreateSlotDto
{
    public Guid OfferId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int Capacity { get; set; }
}