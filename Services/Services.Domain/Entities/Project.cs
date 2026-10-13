using Services.Domain.ValueObjects;

namespace Services.Domain.Entities;

public sealed class Project
{
    public Guid Id { get; private set; }

    public ProjectName Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public string Color { get; private set; } = "#6366F1";

    public Guid UserId { get; private set; }

    public ICollection<TaskItem> Tasks { get; private set; } =
        new List<TaskItem>();

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    private Project()
    {
        // Constructor utilizado por Entity Framework Core.
    }

    private Project(
        Guid userId,
        ProjectName name,
        string? description,
        string color)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "El identificador del usuario es obligatorio.",
                nameof(userId));
        }

        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        Description = NormalizeDescription(description);
        Color = NormalizeColor(color);
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public static Project Create(
        Guid userId,
        ProjectName name,
        string? description = null,
        string color = "#6366F1")
    {
        ArgumentNullException.ThrowIfNull(name);

        return new Project(
            userId,
            name,
            description,
            color);
    }

    public void UpdateDetails(
        ProjectName name,
        string? description,
        string color)
    {
        ArgumentNullException.ThrowIfNull(name);

        Name = name;
        Description = NormalizeDescription(description);
        Color = NormalizeColor(color);

        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static string? NormalizeDescription(string? description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return null;
        }

        var normalized = description.Trim();

        if (normalized.Length > 1000)
        {
            throw new ArgumentException(
                "La descripción del proyecto no puede superar los 1000 caracteres.",
                nameof(description));
        }

        return normalized;
    }

    private static string NormalizeColor(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            throw new ArgumentException(
                "El color del proyecto es obligatorio.",
                nameof(color));
        }

        var normalized = color.Trim();

        if (!System.Text.RegularExpressions.Regex.IsMatch(
                normalized,
                "^#[0-9A-Fa-f]{6}$"))
        {
            throw new ArgumentException(
                "El color debe estar en formato hexadecimal, por ejemplo #6366F1.",
                nameof(color));
        }

        return normalized.ToUpperInvariant();
    }
}