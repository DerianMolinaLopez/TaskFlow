namespace Services.Domain.ValueObjects;

public sealed record TaskDescription
{
    public const int MaxLength = 2000;

    public string Value { get; }

    private TaskDescription(string value)
    {
        Value = value;
    }

    public static TaskDescription Create(string value)
    {
        var normalized = value.Trim();

        if (normalized.Length > MaxLength)
        {
            throw new ArgumentException(
                $"La descripción no puede superar los {MaxLength} caracteres.",
                nameof(value));
        }

        return new TaskDescription(normalized);
    }

    public override string ToString() => Value;
}
