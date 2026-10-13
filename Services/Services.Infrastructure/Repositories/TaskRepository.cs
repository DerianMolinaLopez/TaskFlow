using Microsoft.EntityFrameworkCore;
using Services.Application.Interfaces.Repositories;
using Services.Domain.Entities;
using Services.Infrastructure.Persistence;

namespace Services.Infrastructure.Repositories;

public sealed class TaskRepository(AppDbContext dbContext) : ITaskRepository
{
    public async Task AddAsync(
        TaskItem task,
        CancellationToken cancellationToken = default)
    {
        await dbContext.Tasks.AddAsync(task, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<bool> ProjectExistsAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return dbContext.Projects.AnyAsync(
            project => project.Id == projectId
                && project.UserId == userId,
            cancellationToken);
    }
}