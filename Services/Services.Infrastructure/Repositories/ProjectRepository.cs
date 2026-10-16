using Microsoft.EntityFrameworkCore;
using Services.Application.Interfaces.Repositories;
using Services.Domain.Entities;
using Services.Infrastructure.Persistence;

namespace Services.Infrastructure.Repositories;

public sealed class ProjectRepository(
    AppDbContext dbContext
) : IProjectRepository
{
    public async Task AddAsync(
        Project project,
        CancellationToken cancellationToken = default)
    {
        await dbContext.Projects.AddAsync(
            project,
            cancellationToken
        );

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Project>> GetAllByUserIdAsync(
    Guid userId,
    CancellationToken cancellationToken = default)
    {
        return await dbContext.Projects
            .AsNoTracking()
            .Where(project => project.UserId == userId)
            .OrderBy(project => project.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(
        Guid projectId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Projects
            .FirstOrDefaultAsync(
                project => project.Id == projectId
                    && project.UserId == userId,
                cancellationToken
            );
    }

    public async Task<bool> HasTasksAsync(
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Tasks
            .AnyAsync(
                task => task.ProjectId == projectId,
                cancellationToken
            );
    }

    public async Task UpdateAsync(
        Project project,
        CancellationToken cancellationToken = default)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(
        Project project,
        CancellationToken cancellationToken = default)
    {
        dbContext.Projects.Remove(project);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}