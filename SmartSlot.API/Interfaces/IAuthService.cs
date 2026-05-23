using SmartSlot.API.DTOs.Auth;

namespace SmartSlot.API.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequestDto dto);

    Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
}