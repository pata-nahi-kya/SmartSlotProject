using System.ComponentModel.DataAnnotations;

namespace SmartSlot.API.DTOs.Booking;

public class CreateBookingDto
{
    [Required]
    public Guid OfferId { get; set; }

    [Required]
    public Guid SlotId { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(256)]
    public string? CustomerEmail { get; set; }

    [Range(1, 50)]
    public int PeopleCount { get; set; }

    [StringLength(500)]
    public string? SpecialNote { get; set; }
}