using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using SmartSlot.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SmartSlot.API.Helpers;
using SmartSlot.API.Interfaces;
using SmartSlot.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CORE API SERVICES ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- SWAGGER WITH JWT SECURITY CONFIGURATION ---
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SmartSlot API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT Token"
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});

// --- 2. DATABASE CONFIGURATION ---
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// --- 3. CORS POLICY ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- 4. DEPENDENCY INJECTION ---
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBusinessService,BusinessService>();
builder.Services.AddScoped<JwtHelper>();

// --- 5. JWT AUTHENTICATION CONFIGURATION ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        builder.Configuration["Jwt:Key"]!
                    )
                )
            };
    });

var app = builder.Build();

// --- 6. MIDDLEWARE PIPELINE ---
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    // Using a relative path "./swagger/v1/swagger.json" fixes the CORS/Fetch error instantly
    options.SwaggerEndpoint("./swagger/v1/swagger.json", "SmartSlot API v1");
    options.RoutePrefix = string.Empty; // This serves Swagger directly at the root URL (e.g., localhost:5000/)
});

app.UseCors("AllowAll");
//app.UseHttpsRedirection();

app.UseAuthentication(); // Must be placed before Authorization
app.UseAuthorization();

app.MapControllers();

app.Run();
