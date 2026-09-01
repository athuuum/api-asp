using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;
public record CreateGameDto(
    [Required] [StringLength(50)] string Name,
    [Range(1, double.MaxValue)] int GenreId,
    [Range(0, double.MaxValue)] decimal Price,
    DateOnly ReleaseDate
);