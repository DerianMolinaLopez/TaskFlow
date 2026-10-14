using Services.Domain.Enums;

namespace Services.Application.DTOs.Tasks;

public sealed record CreateTaskRequest(
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTimeOffset? DueDate,
    Guid? ProjectId);