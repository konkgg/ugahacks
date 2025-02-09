import { Song, Artist } from '../types';
import { getArtistInfo } from '../services/spotify';

export const enrichSongWithArtistInfo = async (song: Song): Promise<Song> => {
  try {
    const artistInfo = await getArtistInfo(song.artist);
    
    if (!artistInfo || !artistInfo.images.medium) {
      return song;
    }

    return {
      ...song,
      artistImage: artistInfo.images.medium
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