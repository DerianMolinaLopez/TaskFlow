namespace Services.Application.DTOs.Projects;

public sealed record ProjectSummaryResponse(
    Guid ProjectId,
    string ProjectName,
    int TotalTasks,
    int CompletedTasks,
    int PendingTasks,
    decimal ProgressPercentage);