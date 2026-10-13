using Services.Application.DTOs.Tasks;

namespace Services.Application.Interfaces.Services;

public interface ITaskService
{
    Task<TaskResponse> CreateAsync(
        Guid userId,
        CreateTaskRequest request,
        CancellationToken cancellationToken = default);
}