namespace Services.Application.DTOs.Auth;

public sealed record AuthResponse(
    string AccessToken,
    DateTimeOffset ExpiresAt);