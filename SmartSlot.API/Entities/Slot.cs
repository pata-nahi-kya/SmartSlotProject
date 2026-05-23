using SmartSlot.API.Enums;

namespace SmartSlot.API.Entities;

public class Slot
{
    public Guid Id { get; set; }

    public Guid OfferId { get; set; }

    public Offer Offer { get; set; } = null!;

    public DateTime SlotDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public int Capacity { get; set; }

    public int BookedCount { get; set; }

    public SlotStatus Status { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}