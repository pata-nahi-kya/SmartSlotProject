using SmartSlot.API.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSlot.API.Entities;

public class Offer
{
    public Guid Id { get; set; }

    public Guid BusinessId { get; set; }

    public Business Business { get; set; } = null!;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal OriginalPrice { get; set; }
    [Column(TypeName = "decimal(18,2)")]    
    public decimal OfferPrice { get; set; }

    public double DiscountPercentage { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string TermsAndConditions { get; set; } = string.Empty;

    public OfferStatus Status { get; set; }

    public ICollection<Slot> Slots { get; set; } = new List<Slot>();
}