using System.Net.Mail;

namespace Services.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException(
                "El correo electrónico es obligatorio.",
                nameof(value));
        }

        var normalized = value.Trim().ToLowerInvariant();

        if (normalized.Length > 254)
        {
            throw new ArgumentException(
                "El correo electrónico no puede superar los 254 caracteres.",
                nameof(value));
        }

        if (!MailAddress.TryCreate(
                normalized,
                out var address) ||
            !string.Equals(
                address.Address,
                normalized,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "El correo electrónico no tiene un formato válido.",
                nameof(value));
        }

        return new Email(normalized);
    }

    public override string ToString() => Value;
}