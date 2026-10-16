namespace Services.Application.DTOs.Projects;

public sealed record CreateProjectRequest(
    string Name,
    string? Description = null,
    string Color = "#6366F1"
);