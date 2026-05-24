namespace SmartSlot.API.Configuration;

public class SecurityOptions
{
    public const string SectionName = "Security";

    /// <summary>When false, public registration cannot create Admin accounts.</summary>
    public bool AllowAdminSelfRegistration { get; set; }

    public bool RequireHttps { get; set; }

    public int MaxLoginAttemptsPerMinute { get; set; } = 10;
}

public class CorsOptions
{
    public const string SectionName = "Cors";

    public string[] AllowedOrigins { get; set; } = [];
}
