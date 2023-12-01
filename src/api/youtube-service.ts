const API_KEY = "AIzaSyDu5dSEX4s4CrVoocHma17GlnmH2lq861A";
const baseSearchUrl = "https://www.googleapis.com/youtube/v3/search";

export class YoutubeService {
  static async search(query: string): Promise<string> {
    const url = `${baseSearchUrl}?part=snippet&maxResults=5&q=${query}&key=${API_KEY}&type=video`;
    const response: Response = await fetch(url);
    const res = await response.json();
    const items = res.items;
    let vid = null;
    if (items && items.length > 0) {
      vid = items[0];
    }
    return vid?.id?.videoId;
  }
}
