using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Services.Domain.Entities;
using Services.Domain.ValueObjects;

namespace Services.Infrastructure.Persistence.Configurations;
public sealed class ProjectConfiguration
    : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(project => project.Id);

        builder.Property(project => project.Id)
            .ValueGeneratedNever();

        builder.Property(project => project.Name)
            .HasConversion(
                name => name.Value,
                value => ProjectName.Create(value))
            .HasMaxLength(ProjectName.MaxLength)
            .IsRequired();

        builder.Property(project => project.Description)
            .HasMaxLength(1000);

        builder.Property(project => project.Color)
            .HasMaxLength(7)
            .IsRequired();

        builder.Property(project => project.UserId)
            .IsRequired();

        builder.Property(project => project.CreatedAt)
            .IsRequired();

        builder.Property(project => project.UpdatedAt)
            .IsRequired();

        builder.HasIndex(project => project.UserId);
    }
}