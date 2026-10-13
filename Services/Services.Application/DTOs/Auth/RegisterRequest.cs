namespace Services.Application.DTOs.Auth;

public sealed record RegisterRequest(
    string Email,
    string Password);