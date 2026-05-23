namespace SmartSlot.API.DTOs.Slot;

public class SlotResponseDto
{
    public Guid Id { get; set; }
    public Guid OfferId { get; set; }
    public DateTime StartTime { get; set; } // Kept as DateTime for easy JSON serialization
    public DateTime EndTime { get; set; }   // Kept as DateTime for easy JSON serialization
    public int Capacity { get; set; }
    public bool IsAvailable { get; set; }
}
