using Microsoft.AspNetCore.Mvc;
using SmartSlot.API.DTOs.Auth;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequestDto dto
    )
    {
        await _authService.RegisterAsync(dto);

        return Ok(new
        {
            message = "User registered successfully"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequestDto dto
    )
    {
        var response = await _authService.LoginAsync(dto);

        if (response == null)
        {
            return Unauthorized(new
            {
                message = "Invalid credentials"
            });
        }

        return Ok(response);
    }
}