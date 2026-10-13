using Services.Domain.Entities;

namespace Services.Application.Interfaces.Repositories;

public interface ITaskRepository
{
    Task AddAsync(
        TaskItem task,
        CancellationToken cancellationToken = default);

    Task<bool> ProjectExistsAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default);
}