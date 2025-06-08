namespace MusicService.Dtos
{
    public class MusicCreateDto
    {
        public string? Title { get; set; }
        public string? Artist { get; set; }
        public string? CloudinaryPublicId { get; set; }
        public string? CoverImagePublicId { get; set; }
        public string UserId { get; set; }
    }
}
