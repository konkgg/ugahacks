import { Song, Artist } from '../types';
import { getArtistInfo } from '../services/spotify';

export const enrichSongWithArtistInfo = async (song: Song): Promise<Song> => {
  try {
    const artistInfo = await getArtistInfo(song.artist);
    
    if (!artistInfo || !artistInfo.images.length) {
      return song;
    }

    // Get medium size image or fallback to the first available
    const mediumImage = artistInfo.images.find(img => img.height === 300) || artistInfo.images[0];

    return {
      ...song,
      artistImage: mediumImage.url
    };
  } catch (error) {
    console.error(`Error enriching song with artist info for ${song.artist}:`, error);
    return song;
  }
};

export const enrichSongsWithArtistInfo = async (songs: Song[]): Promise<Song[]> => {
  const enrichedSongs = await Promise.all(
    songs.map(song => enrichSongWithArtistInfo(song))
  );
  return enrichedSongs;
}; 