using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Application.DTOs;
using Services.Application.DTOs.Tasks;
using Services.Application.Interfaces.Services;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;

namespace Services.Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public sealed class TasksController(
    ITaskService taskService
) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create(
        CreateTaskRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetCurrentUserId();

            var task = await taskService.CreateAsync(
                userId,
                request,
                cancellationToken
            );

            return CreatedAtAction(
                nameof(GetById),
                new { id = task.Id },
                task
            );
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

    [HttpGet]
    public async Task<ActionResult<PagedResponse<TaskResponse>>> GetAll(
        [FromQuery] TaskQueryRequest query,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetCurrentUserId();

            var result = await taskService.GetAllAsync(
                userId,
                query,
                cancellationToken
            );

            return Ok(result);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetCurrentUserId();

            var task = await taskService.GetByIdAsync(
                userId,
                id,
                cancellationToken
            );

            return Ok(task);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "La tarea no existe." });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> Update(
        Guid id,
        UpdateTaskRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetCurrentUserId();

            var task = await taskService.UpdateAsync(
                userId,
                id,
                request,
                cancellationToken
            );

            return Ok(task);
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

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<TaskResponse>> ChangeStatus(
        Guid id,
        ChangeTaskStatusRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = GetCurrentUserId();

            var task = await taskService.ChangeStatusAsync(
                userId,
                id,
                request,
                cancellationToken
            );

            return Ok(task);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "La tarea no existe." });
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
            var userId = GetCurrentUserId();

            await taskService.DeleteAsync(
                userId,
                id,
                cancellationToken
            );

            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "La tarea no existe." });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirst(
            JwtRegisteredClaimNames.Sub
        )?.Value;

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            throw new InvalidOperationException(
                "No se pudo obtener el usuario autenticado."
            );
        }

        return userId;
    }
}