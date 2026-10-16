using Services.Application.DTOs;
using Services.Application.DTOs.Tasks;

namespace Services.Application.Interfaces.Services;

public interface ITaskService
{
    Task<TaskResponse> CreateAsync(
        Guid userId,
        CreateTaskRequest request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TaskResponse>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<TaskResponse> GetByIdAsync(
        Guid userId,
        Guid taskId,
        CancellationToken cancellationToken = default);

    Task<TaskResponse> UpdateAsync(
        Guid userId,
        Guid taskId,
        UpdateTaskRequest request,
        CancellationToken cancellationToken = default);

    Task<TaskResponse> ChangeStatusAsync(
        Guid userId,
        Guid taskId,
        ChangeTaskStatusRequest request,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Guid userId,
        Guid taskId,
        CancellationToken cancellationToken = default);

    Task<PagedResponse<TaskResponse>> GetAllAsync(
        Guid userId,
        TaskQueryRequest query,
        CancellationToken cancellationToken = default);

    Task<PagedResponse<TaskResponse>> GetByProjectIdAsync(
        Guid userId,
        Guid projectId,
        TaskQueryRequest query,
        CancellationToken cancellationToken = default);
}