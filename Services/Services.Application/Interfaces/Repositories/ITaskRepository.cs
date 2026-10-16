using Services.Application.DTOs.Tasks;
using Services.Domain.Entities;

namespace Services.Application.Interfaces.Repositories;

public interface ITaskRepository
{
    Task AddAsync(
        TaskItem task,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskItem>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<TaskItem?> GetByIdAsync(
        Guid taskId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        TaskItem task,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        TaskItem task,
        CancellationToken cancellationToken = default);

    Task<bool> ProjectExistsAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedByUserIdAsync(
        Guid userId,
        TaskQueryRequest query,
        CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<TaskItem> Items, int TotalCount)> GetPagedByProjectIdAsync(
        Guid projectId,
        Guid userId,
        TaskQueryRequest query,
        CancellationToken cancellationToken = default);
}