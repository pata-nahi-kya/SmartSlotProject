namespace SmartSlot.API.DTOs.Common;

public class ErrorResponseDto
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; } // Only filled in Development mode for debugging
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
