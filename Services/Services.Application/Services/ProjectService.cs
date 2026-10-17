using Services.Application.DTOs.Projects;
using Services.Application.Interfaces.Repositories;
using Services.Application.Interfaces.Services;
using Services.Domain.Entities;
using Services.Domain.Enums;
using Services.Domain.ValueObjects;
using System.ComponentModel.DataAnnotations;

namespace Services.Application.Services;

public sealed class ProjectService(
    IProjectRepository projectRepository
) : IProjectService
{
    public async Task<ProjectResponse> CreateAsync(
        Guid userId,
        CreateProjectRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ValidateUserId(userId);

        var name = ProjectName.Create(request.Name);

        var project = Project.Create(
            userId: userId,
            name: name,
            description: request.Description,
            color: request.Color
        );

        await projectRepository.AddAsync(
            project,
            cancellationToken
        );

        return MapToResponse(project);
    }

    public async Task<IReadOnlyList<ProjectResponse>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        ValidateUserId(userId);

        var projects = await projectRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        return projects.Select(MapToResponse).ToList();
    }

    public async Task<ProjectResponse> GetByIdAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        ValidateIdentifiers(userId, projectId);

        var project = await GetOwnedProjectAsync(
            userId,
            projectId,
            cancellationToken
        );

        return MapToResponse(project);
    }

    public async Task<ProjectResponse> UpdateAsync(
        Guid userId,
        Guid projectId,
        UpdateProjectRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        ValidateIdentifiers(userId, projectId);

        var project = await GetOwnedProjectAsync(
            userId,
            projectId,
            cancellationToken
        );

        var name = ProjectName.Create(request.Name);

        project.UpdateDetails(
            name: name,
            description: request.Description,
            color: request.Color
        );

        await projectRepository.UpdateAsync(
            project,
            cancellationToken
        );

        return MapToResponse(project);
    }

    public async Task DeleteAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        ValidateIdentifiers(userId, projectId);

        var project = await GetOwnedProjectAsync(
            userId,
            projectId,
            cancellationToken
        );

        if (await projectRepository.HasTasksAsync(
            projectId,
            cancellationToken))
        {
            throw new InvalidOperationException(
                "No se puede eliminar el proyecto porque tiene tareas asociadas."
            );
        }

        await projectRepository.DeleteAsync(
            project,
            cancellationToken
        );
    }

    private async Task<Project> GetOwnedProjectAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken)
    {
        var project = await projectRepository.GetByIdAsync(
            projectId,
            userId,
            cancellationToken
        );

        return project ?? throw new KeyNotFoundException(
            "El proyecto no existe."
        );
    }

    private static void ValidateUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ValidationException(
                "El identificador del usuario no es válido."
            );
        }
    }

    private static void ValidateIdentifiers(
        Guid userId,
        Guid projectId)
    {
        ValidateUserId(userId);

        if (projectId == Guid.Empty)
        {
            throw new ValidationException(
                "El identificador del proyecto no es válido."
            );
        }
    }

    private static ProjectResponse MapToResponse(Project project)
    {
        return new ProjectResponse(
            Id: project.Id,
            Name: project.Name.Value,
            Description: project.Description,
            Color: project.Color,
            CreatedAt: project.CreatedAt,
            UpdatedAt: project.UpdatedAt
        );
    }

    public async Task<ProjectSummaryResponse> GetSummaryAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException(
                "El identificador del usuario es obligatorio.",
                nameof(userId));

        if (projectId == Guid.Empty)
            throw new ArgumentException(
                "El identificador del proyecto es obligatorio.",
                nameof(projectId));

        var project = await projectRepository.GetByIdAsync(
            projectId,
            userId,
            cancellationToken);

        if (project is null)
            throw new KeyNotFoundException(
                "El proyecto no existe o no pertenece al usuario.");

        var taskCounts = await projectRepository.GetTaskCountsByProjectAsync(
            projectId,
            userId,
            cancellationToken);

        var totalTasks = taskCounts.Values.Sum();

        var completedTasks = taskCounts.GetValueOrDefault(
            TaskCurrentStatus.Done,
            0);

        var pendingTasks = totalTasks - completedTasks;

        var progressPercentage = totalTasks == 0
            ? 0m
            : Math.Round(
                completedTasks * 100m / totalTasks,
                2);

        return new ProjectSummaryResponse(
            ProjectId: project.Id,
            ProjectName: project.Name.Value,
            TotalTasks: totalTasks,
            CompletedTasks: completedTasks,
            PendingTasks: pendingTasks,
            ProgressPercentage: progressPercentage);
    }

}