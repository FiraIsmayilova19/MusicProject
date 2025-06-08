using MusicService.Models;
using System.Text.Json;

namespace MusicService.Services
{
    public class JsonStorageService
    {
        private readonly string _jsonFilePath = "/app/data/music_metadata.json";

        public void SaveMusicMetadata(Music music)
        {
            List<Music> list = new();
            if (File.Exists(_jsonFilePath))
            {
                var content = File.ReadAllText(_jsonFilePath);
                list = JsonSerializer.Deserialize<List<Music>>(content) ?? new();
            }

            list.Add(music);
            var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, json);
        }
    }

}
