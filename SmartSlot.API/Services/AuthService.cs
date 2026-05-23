using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Auth;
using SmartSlot.API.Entities;
using SmartSlot.API.Helpers;
using SmartSlot.API.Interfaces;
using SmartSlot.API.Enums;

namespace SmartSlot.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtHelper _jwtHelper;

    public AuthService(
        AppDbContext context,
        JwtHelper jwtHelper
    )
    {
        _context = context;
        _jwtHelper = jwtHelper;
    }

    public async Task RegisterAsync(RegisterRequestDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (existingUser != null)
        {
            throw new Exception("User already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Role = UserRole.Admin
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
        {
            return null;
        }

        var isPasswordValid = PasswordHasher.VerifyPassword(
            dto.Password,
            user.PasswordHash
        );

        if (!isPasswordValid)
        {
            return null;
        }

        var token = _jwtHelper.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}