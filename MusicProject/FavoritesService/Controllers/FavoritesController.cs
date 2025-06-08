using FavoritesService.Models;
using FavoritesService.Services;
using Microsoft.AspNetCore.Mvc;

namespace FavoritesService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly RedisFavoritesService _favoritesService;

    public FavoritesController(RedisFavoritesService favoritesService)
    {
        _favoritesService = favoritesService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFavorites(string userId)
    {
        var favorites = await _favoritesService.GetFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpPost("{userId}")]
    public async Task<IActionResult> AddToFavorites(string userId, [FromBody] FavoriteEntry item)
    {
        await _favoritesService.AddFavoriteAsync(userId, item);
        return Ok();
    }


    [HttpDelete("{userId}/{musicId}")]
    public async Task<IActionResult> RemoveFromFavorites(string userId, int musicId)
    {
        await _favoritesService.RemoveFavoriteAsync(userId, musicId);
        return NoContent();
    }
}
