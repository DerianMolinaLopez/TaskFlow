using Services.Application.DTOs.Projects;

namespace Services.Application.Interfaces.Services;

public interface IProjectService
{
    Task<ProjectResponse> CreateAsync(
        Guid userId,
        CreateProjectRequest request,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProjectResponse>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<ProjectResponse> GetByIdAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default);

    Task<ProjectResponse> UpdateAsync(
        Guid userId,
        Guid projectId,
        UpdateProjectRequest request,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default);

    Task<ProjectSummaryResponse> GetSummaryAsync(
    Guid userId,
    Guid projectId,
    CancellationToken cancellationToken = default);
}