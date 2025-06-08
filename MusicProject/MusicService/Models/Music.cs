namespace MusicService.Models
{
   
    public class Music
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Artist { get; set; }
        public string? CloudinaryPublicId { get; set; } // Musiqi faylı
        public string? CoverImagePublicId { get; set; } // Cover şəkli
        public int LikeCount { get; set; } = 0;
        public string UserId { get; set; } // musiqini kim əlavə edib
    }

}
