namespace MusicService.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string ProfilePhotoPublicId { get; set; } // Cloudinary şəkil id
    }
}
