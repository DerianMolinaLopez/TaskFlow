using Services.Application.DTOs.Tasks;
using Services.Application.Interfaces.Repositories;
using Services.Application.Interfaces.Services;
using Services.Domain.Entities;
using Services.Domain.ValueObjects;

namespace Services.Application.Services;

public sealed class TaskService(ITaskRepository taskRepository) : ITaskService
{
    public async Task<TaskResponse> CreateAsync(
        Guid userId,
        CreateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "El identificador del usuario es obligatorio.",
                nameof(userId));
        }

        if (!Enum.IsDefined(request.Priority))
        {
            throw new ArgumentOutOfRangeException(
                nameof(request.Priority),
                "La prioridad no es válida.");
        }

        var title = TaskTitle.Create(request.Title);

        var description = string.IsNullOrWhiteSpace(request.Description)
            ? null
            : TaskDescription.Create(request.Description);

        if (request.ProjectId.HasValue)
        {
            var projectExists = await taskRepository.ProjectExistsAsync(
                request.ProjectId.Value,
                userId,
                cancellationToken);

            if (!projectExists)
            {
                throw new KeyNotFoundException(
                    "El proyecto no existe o no pertenece al usuario.");
            }
        }

        var task = TaskItem.Create(
            userId: userId,
            title: title,
            description: description,
            priority: request.Priority,
            dueDate: request.DueDate,
            projectId: request.ProjectId);

        await taskRepository.AddAsync(task, cancellationToken);

        return new TaskResponse(
            Id: task.Id,
            Title: task.Title.Value,
            Description: task.Description?.Value,
            Status: task.Status,
            Priority: task.Priority,
            DueDate: task.DueDate,
            ProjectId: task.ProjectId,
            CreatedAt: task.CreatedAt,
            UpdatedAt: task.UpdatedAt);
    }
}