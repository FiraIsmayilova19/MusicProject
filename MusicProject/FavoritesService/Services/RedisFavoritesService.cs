using FavoritesService.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace FavoritesService.Services;

public class RedisFavoritesService
{
    private readonly IDatabase _db;

    public RedisFavoritesService()
    {
        var muxer = ConnectionMultiplexer.Connect(
            new ConfigurationOptions
            {
                EndPoints = { { "redis-13822.c266.us-east-1-3.ec2.redns.redis-cloud.com", 13822 } },
                User = "default",
                Password = "aSRwK8nG9RdfKHxdasHY8JAeEBsG1vTM",
                AbortOnConnectFail = false
            });

        _db = muxer.GetDatabase();
    }

    private string GetKey(string userId) => $"favorites:{userId}";

    public async Task<List<FavoriteEntry>> GetFavoritesAsync(string userId)
    {
        var data = await _db.StringGetAsync(GetKey(userId));
        if (data.IsNullOrEmpty) return new List<FavoriteEntry>();

        return JsonSerializer.Deserialize<List<FavoriteEntry>>(data!)!;
    }

    public async Task AddFavoriteAsync(string userId, FavoriteEntry item)
    {
        var currentFavorites = await GetFavoritesAsync(userId);
        if (!currentFavorites.Any(x => x.MusicId == item.MusicId))
        {
            currentFavorites.Add(item);
            await _db.StringSetAsync(GetKey(userId), JsonSerializer.Serialize(currentFavorites));
        }
    }

    public async Task RemoveFavoriteAsync(string userId, int musicId)
    {
        var currentFavorites = await GetFavoritesAsync(userId);
        var updatedFavorites = currentFavorites.Where(x => x.MusicId != musicId).ToList();

        await _db.StringSetAsync(GetKey(userId), JsonSerializer.Serialize(updatedFavorites));
    }
}
