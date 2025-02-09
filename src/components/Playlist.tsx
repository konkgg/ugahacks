import React, { useEffect, useState } from 'react';
import { getArtistImage } from '../services/spotify';
import type { Song } from '../types';
import { Music, ExternalLink } from 'lucide-react';

interface PlaylistProps {
  tracks: Song[];
}

const Playlist: React.FC<PlaylistProps> = ({ tracks }) => {
  const [enrichedTracks, setEnrichedTracks] = useState<Song[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const enrichTracks = async () => {
      setLoadingImages(true);
      try {
        const tracksWithImages = await Promise.all(
          tracks.map(async (track) => {
            try {
              const artistImage = await getArtistImage(track.artist);
              return { ...track, artistImage };
            } catch (error) {
              console.error(`Error loading image for ${track.artist}:`, error);
              return { ...track, artistImage: null };
            }
          })
        );
        setEnrichedTracks(tracksWithImages);
      } catch (error) {
        console.error('Error enriching tracks:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    if (tracks.length > 0) {
      enrichTracks();
    } else {
      setEnrichedTracks([]);
      setLoadingImages(false);
    }
  }, [tracks]);

  const renderArtistImage = (track: Song) => {
    if (loadingImages) {
      return (
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      );
    }

    if (!track.artistImage) {
      return (
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <Music className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      );
    }

    return (
      <img 
        src={track.artistImage} 
        alt={track.artist}
        className="w-16 h-16 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/music-placeholder.svg';
          target.onerror = null;
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      {enrichedTracks.map((track, index) => (
        <div 
          key={track.id || index} 
          className="flex items-center space-x-4 bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm 
                   hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50 
                   transition-all duration-200 group"
        >
          {renderArtistImage(track)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate pr-2">
                {track.title}
              </h3>
              <a 
                href={`https://open.spotify.com/search/${encodeURIComponent(track.title + ' ' + track.artist)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {track.artist}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
              {track.reason}
            </p>
          </div>
        </div>
      ))}
      {!loadingImages && !enrichedTracks.length && (
        <div className="text-center py-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm">
          <Music className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No songs in your financial mood mix yet
          </p>
        </div>
      )}
    </div>
  );
};

export default Playlist; 