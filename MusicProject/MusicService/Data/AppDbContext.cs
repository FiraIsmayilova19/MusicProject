using Microsoft.EntityFrameworkCore;
using MusicService.Models;
using System.Collections.Generic;

namespace MusicService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Music> Musics { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}
