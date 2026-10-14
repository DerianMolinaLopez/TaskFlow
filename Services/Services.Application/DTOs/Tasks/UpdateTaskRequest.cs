using Services.Domain.Enums;

namespace Services.Application.DTOs.Tasks;

public sealed record UpdateTaskRequest(
    string Title,
    string? Description,
    TaskPriority Priority,
    DateTimeOffset? DueDate,
    Guid? ProjectId);