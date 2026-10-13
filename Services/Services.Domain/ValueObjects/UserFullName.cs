namespace Services.Domain.ValueObjects;

public sealed record UserFullName
{
    public const int MaxLength = 40;

    public string Name { get; }
    public string FirstSurname { get; }
    public string? SecondSurname { get; }

    public string FullName =>
        string.IsNullOrWhiteSpace(SecondSurname)
            ? $"{Name} {FirstSurname}"
            : $"{Name} {FirstSurname} {SecondSurname}";

    public UserFullName(string name, string firstSurname, string? secondSurname = null)
    {
        Name = name;
        FirstSurname = firstSurname;
        SecondSurname = secondSurname;
    }

    public static UserFullName Create(string name, string firstSurname, string? secondSurname = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "El nombre es obligatorio.",
                nameof(name));
        }
        else if (string.IsNullOrWhiteSpace(firstSurname))
        {
            throw new ArgumentException(
                "El primer apellido es obligatorio.",
                nameof(firstSurname));
        }

        var normalizedName = name.Trim();
        var normalizedFirstSurname = firstSurname.Trim();
        var normalizedSecondSurname = secondSurname?.Trim();

        if (normalizedName.Length > MaxLength * 1.5)
        {
            throw new ArgumentException(
                $"El nombre no puede tener más de {MaxLength * 1.5} caracteres.",
                nameof(name));
        }
        else if (normalizedFirstSurname.Length > MaxLength)
        {
            throw new ArgumentException(
                $"El primer apellido no puede tener más de {MaxLength} caracteres.",
                nameof(firstSurname));
        }
        else if (normalizedSecondSurname?.Length > MaxLength)
        {
            throw new ArgumentException(
                $"El segundo apellido no puede tener más de {MaxLength} caracteres.",
                nameof(secondSurname));
        }

        return new UserFullName(normalizedName, normalizedFirstSurname, normalizedSecondSurname);
    }

    public override string ToString() => FullName;
}
