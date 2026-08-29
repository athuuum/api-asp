using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;
public record CreateGameDto(
    [Required] [StringLength(50)] string Name,
    [Required] [StringLength(20)] string Genre,
    [Range(0, double.MaxValue)] decimal Price,
    DateOnly ReleaseDate
);