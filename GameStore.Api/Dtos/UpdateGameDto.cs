namespace GameStore.Api.Dtos;
public record UpdateCreateGameDto(
    string Name,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);