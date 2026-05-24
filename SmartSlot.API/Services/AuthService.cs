using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartSlot.API.Configuration;
using SmartSlot.API.Data;
using SmartSlot.API.DTOs.Auth;
using SmartSlot.API.Entities;
using SmartSlot.API.Enums;
using SmartSlot.API.Exceptions;
using SmartSlot.API.Helpers;
using SmartSlot.API.Interfaces;

namespace SmartSlot.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly SecurityOptions _securityOptions;

    public AuthService(
        AppDbContext context,
        JwtHelper jwtHelper,
        IOptions<SecurityOptions> securityOptions)
    {
        _context = context;
        _jwtHelper = jwtHelper;
        _securityOptions = securityOptions.Value;
    }

    public async Task RegisterAsync(RegisterRequestDto dto)
    {
        var email = PasswordValidator.NormalizeEmail(dto.Email);

        if (!PasswordValidator.IsValidEmail(email))
        {
            throw new ValidationAppException("A valid email address is required.");
        }

        PasswordValidator.Validate(dto.Password);

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (existingUser != null)
        {
            throw new ConflictException("An account with this email already exists.");
        }

        var role = UserRole.Customer;
        if (!string.IsNullOrWhiteSpace(dto.Role) &&
            Enum.TryParse<UserRole>(dto.Role, ignoreCase: true, out var parsedRole))
        {
            if (parsedRole == UserRole.Admin && !_securityOptions.AllowAdminSelfRegistration)
            {
                throw new ForbiddenException("Admin registration is not permitted.");
            }

            role = parsedRole;
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Email = email,
            PasswordHash = PasswordHasher.HashPassword(dto.Password),
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var email = PasswordValidator.NormalizeEmail(dto.Email);

        if (!PasswordValidator.IsValidEmail(email))
        {
            return null;
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

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
