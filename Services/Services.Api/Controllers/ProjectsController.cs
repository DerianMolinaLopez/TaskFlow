using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Application.DTOs;
using Services.Application.DTOs.Projects;
using Services.Application.DTOs.Tasks;
using Services.Application.Interfaces.Services;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;

namespace Services.Api.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public sealed class ProjectsController(
    IProjectService projectService,
    ITaskService taskService
) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(
        CreateProjectRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var project = await projectService.CreateAsync(
                GetCurrentUserId(),
                request,
                cancellationToken
            );

            return CreatedAtAction(
                nameof(GetById),
                new { id = project.Id },
                project
            );
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        return Ok(await projectService.GetAllAsync(
            GetCurrentUserId(),
            cancellationToken
        ));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProjectResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await projectService.GetByIdAsync(
                GetCurrentUserId(),
                id,
                cancellationToken
            ));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "El proyecto no existe." });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}/tasks")]
    public async Task<ActionResult<PagedResponse<TaskResponse>>> GetTasks(
    Guid id,
    [FromQuery] TaskQueryRequest query,
    CancellationToken cancellationToken)
    {
        try
        {
            var result = await taskService.GetByProjectIdAsync(
                GetCurrentUserId(),
                id,
                query,
                cancellationToken
            );

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectResponse>> Update(
        Guid id,
        UpdateProjectRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await projectService.UpdateAsync(
                GetCurrentUserId(),
                id,
                request,
                cancellationToken
            ));
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "El proyecto no existe." });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            await projectService.DeleteAsync(
                GetCurrentUserId(),
                id,
                cancellationToken
            );

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "El proyecto no existe." });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    private Guid GetCurrentUserId()
    {
        var value = User.FindFirst(
            JwtRegisteredClaimNames.Sub
        )?.Value;

        if (!Guid.TryParse(value, out var userId))
        {
            throw new InvalidOperationException(
                "No se pudo obtener el usuario autenticado."
            );
        }

        return userId;
    }

    [HttpGet("{id:guid}/summary")]
    public async Task<ActionResult<ProjectSummaryResponse>> GetSummary(
    Guid id,
    CancellationToken cancellationToken)
    {
        try
        {
            var summary = await projectService.GetSummaryAsync(
                GetCurrentUserId(),
                id,
                cancellationToken);

            return Ok(summary);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}