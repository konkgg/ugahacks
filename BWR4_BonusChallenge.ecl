IMPORT STD;
IMPORT $;
MozMusic := $.File_Music.MozDS;
MSDMusic := $.File_Music.MSDDS;
SpotMusic := $.File_Music.SpotDS;

// Common record format
CombMusicLayout := RECORD
    UNSIGNED RECID;
    STRING SongTitle;
    STRING AlbumTitle;
    STRING Artist;
    STRING Genre;
    STRING4 ReleaseYear;
    STRING4 Source;
END;

// Transform for MozMusic
CombMusicLayout XformMoz(MozMusic L, UNSIGNED C) := TRANSFORM
    SELF.RECID := C;
    SELF.SongTitle := L.title;
    SELF.AlbumTitle := L.title;
    SELF.Artist := L.name;
    SELF.Genre := L.genre;
    SELF.ReleaseYear := IF(L.releasedate <> '', (STRING4)L.releasedate[..4], '');
    SELF.Source := 'MOZ';
END;

// Transform for MSDMusic
CombMusicLayout XformMSD(MSDMusic L, UNSIGNED C) := TRANSFORM
    SELF.RECID := C;
    SELF.SongTitle := IF(L.title <> '', L.title, 'Unknown');
    SELF.AlbumTitle := IF(L.release_name <> '', L.release_name, 'Unknown');
    SELF.Artist := IF(L.artist_name <> '', L.artist_name, 'Unknown');
    SELF.Genre := 'Unknown'; // MSD doesn't have genre field
    SELF.ReleaseYear := IF(L.year > 0, (STRING4)L.year, '');
    SELF.Source := 'MSD';
END;

// Transform for SpotMusic
CombMusicLayout XformSpot(SpotMusic L, UNSIGNED C) := TRANSFORM
    SELF.RECID := C;
    SELF.SongTitle := IF(L.track_name <> '', L.track_name, 'Unknown');
    SELF.AlbumTitle := 'Unknown'; 
    SELF.Artist := IF(L.artist_name <> '', L.artist_name, 'Unknown');
    SELF.Genre := IF(L.genre <> '', L.genre, 'Unknown');
    SELF.ReleaseYear := IF(L.year > 0, (STRING4)L.year, '');
    SELF.Source := 'SPOT';
END;

// Project each dataset into common format
MozRecs := PROJECT(MozMusic, XformMoz(LEFT, COUNTER));
MSDRecs := PROJECT(MSDMusic, XformMSD(LEFT, COUNTER));
SpotRecs := PROJECT(SpotMusic, XformSpot(LEFT, COUNTER));

// Combine all records
CombinedMusic := MozRecs + MSDRecs + SpotRecs;

// Example playlists
// By Year
Year2020 := CombinedMusic(ReleaseYear = '2020');
OUTPUT(Year2020, NAMED('Songs_2020'));

// By Genre
RockSongs := CombinedMusic(Genre = 'Rock');
OUTPUT(RockSongs, NAMED('Rock_Playlist'));

// By Year and Genre with case-insensitive genre matching
Rock2020 := CombinedMusic(ReleaseYear = '2020' AND 
    (STD.Str.ToUpperCase(TRIM(Genre)) IN ['ROCK', 'ROCK & ROLL', 'ALTERNATIVE ROCK', 'INDIE ROCK']));
OUTPUT(Rock2020, NAMED('Rock_2020'));

// Output statistics
RecordsBySource := TABLE(CombinedMusic, {Source, UNSIGNED cnt := COUNT(GROUP)}, Source);
RecordsByYear := TABLE(CombinedMusic, {ReleaseYear, UNSIGNED cnt := COUNT(GROUP)}, ReleaseYear);

OUTPUT(COUNT(CombinedMusic), NAMED('Total_Records'));
OUTPUT(RecordsBySource, NAMED('Records_By_Source'));
OUTPUT(RecordsByYear, NAMED('Records_By_Year'));

// Output combined dataset
OUTPUT(CombinedMusic, NAMED('All_Music'));