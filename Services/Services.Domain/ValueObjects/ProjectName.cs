namespace Services.Domain.ValueObjects;

public sealed record ProjectName
{
    public const int MaxLength = 150;

    public string Value { get; }

    private ProjectName(string value)
    {
        Value = value;
    }

    public static ProjectName Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException(
                "El nombre del proyecto es obligatorio.",
                nameof(value));
        }

        var normalized = value.Trim();

        if (normalized.Length > MaxLength)
        {
            throw new ArgumentException(
                $"El nombre del proyecto no puede superar los {MaxLength} caracteres.",
                nameof(value));
        }

        return new ProjectName(normalized);
    }

    public override string ToString() => Value;
}
