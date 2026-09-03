using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;
public record UpdateGameDto(
    [Required] [StringLength(50)] string Name,
    int GenreId,
    [Range(0, double.MaxValue)] decimal Price,
    DateOnly ReleaseDate
);