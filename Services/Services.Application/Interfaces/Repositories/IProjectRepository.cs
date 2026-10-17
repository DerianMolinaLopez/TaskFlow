using Services.Domain.Entities;
using Services.Domain.Enums;

namespace Services.Application.Interfaces.Repositories;

public interface IProjectRepository
{
    Task AddAsync(
        Project project,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Project>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<Project?> GetByIdAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> HasTasksAsync(
        Guid projectId,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        Project project,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Project project,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyDictionary<TaskCurrentStatus, int>> GetTaskCountsByProjectAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default);
}