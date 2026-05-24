using System.ComponentModel.DataAnnotations;

namespace SmartSlot.API.DTOs.Auth;

public class RegisterRequestDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(128, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [RegularExpression("^(Admin|Customer)$", ErrorMessage = "Role must be Admin or Customer.")]
    public string? Role { get; set; }
}