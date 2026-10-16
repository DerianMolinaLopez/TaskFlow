namespace Services.Application.DTOs.Projects;

public sealed record UpdateProjectRequest(
    string Name,
    string? Description = null,
    string Color = "#6366F1"
);