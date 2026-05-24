using System.Text.RegularExpressions;
using SmartSlot.API.Exceptions;

namespace SmartSlot.API.Helpers;

public static partial class PasswordValidator
{
    private const int MinLength = 8;
    private const int MaxLength = 128;

    public static void Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ValidationAppException("Password is required.");
        }

        if (password.Length < MinLength || password.Length > MaxLength)
        {
            throw new ValidationAppException($"Password must be between {MinLength} and {MaxLength} characters.");
        }

        if (!password.Any(char.IsUpper))
        {
            throw new ValidationAppException("Password must contain at least one uppercase letter.");
        }

        if (!password.Any(char.IsLower))
        {
            throw new ValidationAppException("Password must contain at least one lowercase letter.");
        }

        if (!password.Any(char.IsDigit))
        {
            throw new ValidationAppException("Password must contain at least one digit.");
        }
    }

    public static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email) || email.Length > 256)
        {
            return false;
        }

        return EmailRegex().IsMatch(email);
    }

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();
}
