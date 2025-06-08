using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;
using MusicService.Dtos;

namespace MusicService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly AppDbContext _context;

    public MusicController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var musics = await _context.Musics.ToListAsync();
        return Ok(musics);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var music = await _context.Musics.FindAsync(id);
        if (music == null) return NotFound();

        return Ok(music);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MusicCreateDto dto)
    {
        var music = new Music
        {
            Title = dto.Title,
            Artist = dto.Artist,
            CloudinaryPublicId = dto.CloudinaryPublicId,
            CoverImagePublicId = dto.CoverImagePublicId,
            UserId = dto.UserId
        };

        _context.Musics.Add(music);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = music.Id }, music);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var music = await _context.Musics.FindAsync(id);
        if (music == null) return NotFound();

        _context.Musics.Remove(music);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("playlist/{userId}")]
    public async Task<IActionResult> GetPlaylistByUserId(string userId)
    {
        var playlists = await _context.Playlists
            .Where(p => p.UserId == userId)
            .Include(p => p.Musics)
            .ToListAsync();

        var musicList = playlists
            .SelectMany(p => p.Musics)
            .Distinct()
            .ToList();

        return Ok(musicList);
    }

    [HttpPost("playlist/add-music")]
    public async Task<IActionResult> AddMusicToPlaylist([FromBody] PlaylistMusicDto dto)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Musics)
            .FirstOrDefaultAsync(p => p.UserId == dto.UserId);

        if (playlist == null)
        {
            playlist = new Playlist
            {
                UserId = dto.UserId,
                Name = "MyPlaylist"
            };
            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();
        }

        var music = await _context.Musics.FindAsync(dto.MusicId);
        if (music == null) return NotFound("Music not found");

        if (!playlist.Musics.Any(m => m.Id == dto.MusicId))
        {
            playlist.Musics.Add(music);
            await _context.SaveChangesAsync();
        }

        return Ok(playlist);
    }



    [HttpPost("playlist")]
    public async Task<IActionResult> CreatePlaylist([FromBody] Playlist playlist)
    {
        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync();
        return Ok(playlist);
    }

    [HttpDelete("playlist/{userId}/{musicId}")]
    public async Task<IActionResult> RemoveMusicFromPlaylist(string userId, int musicId)
    {
        var playlist = await _context.Playlists
            .Include(p => p.Musics)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (playlist == null)
            return NotFound("Playlist tapılmadı.");

        var music = playlist.Musics.FirstOrDefault(m => m.Id == musicId);
        if (music == null)
            return NotFound("Bu mahnı playlistdə tapılmadı.");

        playlist.Musics.Remove(music);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
