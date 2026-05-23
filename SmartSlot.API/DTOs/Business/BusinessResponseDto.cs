namespace SmartSlot.API.DTOs.Business;

public class BusinessResponseDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string BusinessType { get; set; } = string.Empty;

    public string OwnerName { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;
}