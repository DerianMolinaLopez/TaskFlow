using Services.Domain.Enums;

namespace Services.Application.DTOs.Tasks;

public sealed record TaskQueryRequest
{
    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 10;

    public TaskCurrentStatus? Status { get; init; }

    public TaskPriority? Priority { get; init; }

    public string? Search { get; init; }

    public string SortBy { get; init; } = "createdAt";

    public string SortDirection { get; init; } = "desc";
}