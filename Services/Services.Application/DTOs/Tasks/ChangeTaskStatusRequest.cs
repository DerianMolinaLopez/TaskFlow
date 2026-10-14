using Services.Domain.Enums;

namespace Services.Application.DTOs.Tasks;

public sealed record ChangeTaskStatusRequest(
    TaskCurrentStatus Status);