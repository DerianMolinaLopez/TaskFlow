namespace Services.Application.DTOs.Projects;

public sealed record ProjectResponse(
    Guid Id,
    string Name,
    string? Description,
    string Color,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt
);