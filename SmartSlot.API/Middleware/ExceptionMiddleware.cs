using System.Net;
using System.Text.Json;
using SmartSlot.API.DTOs.Common;
using SmartSlot.API.Exceptions;

namespace SmartSlot.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Pass execution to the next middleware component
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        // Map common application exceptions to appropriate HTTP Status Codes
        context.Response.StatusCode = exception switch
        {
            AppException appEx => appEx.StatusCode,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            KeyNotFoundException => (int)HttpStatusCode.NotFound,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var isServerError = context.Response.StatusCode == (int)HttpStatusCode.InternalServerError;

        var response = new ErrorResponseDto
        {
            StatusCode = context.Response.StatusCode,
            Message = isServerError
                ? "An unexpected internal server error occurred."
                : exception.Message,
            // Show full stack trace only during local development debugging loops
            Details = _env.IsDevelopment() ? exception.StackTrace?.ToString() : null
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }
}
