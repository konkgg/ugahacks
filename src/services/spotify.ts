import type { Artist } from '../types';

if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || !process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing Spotify credentials in environment variables');
}

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(
        `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
      )
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('No access token in Spotify response');
  }

  accessToken = data.access_token;
  tokenExpiry = Date.now() + ((data.expires_in || 3600) * 1000);
  return data.access_token;
}

export async function getArtistInfo(artistName: string): Promise<Artist | null> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    if (!data.artists?.items?.length) {
      return null;
    }

    const artist = data.artists.items[0];
    return {
      name: artist.name,
      images: {
        small: artist.images[2]?.url || null,
        medium: artist.images[1]?.url || null,
        large: artist.images[0]?.url || null
      },
      url: artist.external_urls?.spotify || null
    };
  } catch (error) {
    console.error('Failed to fetch artist info:', error);
    return null;
  }
}

export async function getArtistImage(artistName: string): Promise<string | null> {
  const artist = await getArtistInfo(artistName);
  return artist?.images?.medium || null;
} 