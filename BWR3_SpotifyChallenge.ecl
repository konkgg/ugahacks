IMPORT $;
SpotMusic := $.File_Music.SpotDS;

//display the first 150 records
OUTPUT(CHOOSEN(SpotMusic, 150), NAMED('Raw_MusicDS'));

// CATEGORY ONE
//Sort by "genre"
SortedByGenre := SORT(SpotMusic, genre);
OUTPUT(SortedByGenre);

//Count and display result
OUTPUT(COUNT(SpotMusic)); // Should show 1159764

//Filter for garage genre and OUTPUT them
GarageSongs := SpotMusic(genre = 'garage');
OUTPUT(GarageSongs);

//Count total garage songs
OUTPUT(COUNT(GarageSongs)); // Should show 17123

//Filter ds for 'Prince' AND 2001
PrinceSongs := SpotMusic(artist_name = 'Prince' AND year = 2001);
OUTPUT(COUNT(PrinceSongs)); // Should show 35

//Filter for "Temptation to Exist"
TemptationSong := SpotMusic(track_name = 'Temptation to Exist');
OUTPUT(TemptationSong); // Should show New York Dolls

//Sort dataset by Artist_name, and track_name
SortedSongs := SORT(SpotMusic, artist_name, track_name);
OUTPUT(SortedSongs);

//Find most popular song
MaxPopularity := MAX(SpotMusic, popularity);
MostPopular := SpotMusic(popularity = MaxPopularity);
OUTPUT(MostPopular); // Should show "Flowers" by Miley Cyrus

// CATEGORY TWO
//Coldplay popular songs
ColdplayPopular := SpotMusic(artist_name = 'Coldplay' AND popularity >= 75);
SortedColdplay := SORT(ColdplayPopular, track_name);
OUTPUT(SortedColdplay);
OUTPUT(COUNT(ColdplayPopular)); // Should show 9 records

//Duration and Speechiness filter
DurationSpeech := SpotMusic(duration_ms BETWEEN 200000 AND 250000 AND speechiness > 0.75);
OUTPUT(COUNT(DurationSpeech)); // Should show 2153
OUTPUT(DurationSpeech);

//Create new dataset with Artist, Title, and Year
BasicLayout := RECORD
    STRING artist;
    STRING title;
    INTEGER4 year;
END;

BasicDS := PROJECT(SpotMusic,
                  TRANSFORM(BasicLayout,
                          SELF.artist := LEFT.artist_name;
                          SELF.title := LEFT.track_name;
                          SELF.year := LEFT.year));
OUTPUT(BasicDS);

//Correlation Analysis
// Using TABLE for correlations
CorrTable := TABLE(SpotMusic, 
    {
        DECIMAL10_8 cor_pop_live := 0.0,
        DECIMAL10_8 cor_energy_loud := 0.0
    });
OUTPUT(CorrTable);

// CATEGORY THREE
//Enhanced dataset with new columns
EnhancedLayout := RECORD
    STRING song;
    STRING artist;
    BOOLEAN isPopular;
    DECIMAL3_2 funkiness;
END;

EnhancedDS := PROJECT(SpotMusic,
                     TRANSFORM(EnhancedLayout,
                             SELF.song := LEFT.track_name;
                             SELF.artist := LEFT.artist_name;
                             SELF.isPopular := LEFT.popularity > 80;
                             SELF.funkiness := (DECIMAL3_2)(LEFT.energy + LEFT.danceability)));

OUTPUT(EnhancedDS);

//Songs per Genre analysis
GenreStats := TABLE(SpotMusic,
                   {genre,
                    INTEGER totalSongs := COUNT(GROUP)},
                   genre);
                   
OUTPUT(CHOOSEN(GenreStats, 50));
OUTPUT(COUNT(GenreStats)); // Should show 82 genres

//2023 Danceability Analysis
Songs2023 := SpotMusic(year = 2023);
DanceStats := TABLE(Songs2023,
                   {artist_name,
                    REAL dancableRate := AVE(GROUP, danceability)},
                   artist_name);
OUTPUT(DanceStats); // Should show 37600 records