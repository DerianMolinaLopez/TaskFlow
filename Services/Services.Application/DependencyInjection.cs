using Microsoft.Extensions.DependencyInjection;
using Services.Application.Interfaces.Services;
using Services.Application.Services;

namespace Services.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {

        // Services
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<ITaskService, TaskService>();

        return services;
    }
}
