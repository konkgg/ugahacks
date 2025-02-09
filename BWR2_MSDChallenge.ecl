// Initial setup
IMPORT $;
MSDMusic := $.File_Music.MSDDS;

//display the first 150 records
OUTPUT(CHOOSEN(MSDMusic, 150), NAMED('Raw_MusicDS'));

// CATEGORY ONE
//Reverse sort by "year"
SortedByYear := SORT(MSDMusic, -year);

//display the first 50
OUTPUT(CHOOSEN(SortedByYear, 50));

//Count and display result
OUTPUT(COUNT(MSDMusic));

//Filter for 2010 and display the first 50
Songs2010 := MSDMusic(year = 2010);
OUTPUT(CHOOSEN(Songs2010, 50));

//Count total songs released in 2010:
OUTPUT(COUNT(Songs2010));

//Filter ds for "Prince" AND 1982
PrinceSongs := MSDMusic(artist_name = 'Prince' AND year = 1982);

//Count and print total
OUTPUT(COUNT(PrinceSongs));

//Filter for "Into Temptation"
TemptationSongs := MSDMusic(title = 'Into Temptation');

//Display result
OUTPUT(TemptationSongs);

//Sort dataset by Artist, and Title
SortedSongs := SORT(MSDMusic, artist_name, title);

//Output the first 100
OUTPUT(CHOOSEN(SortedSongs, 100));

//Get the datasets maximum hotness value and display
MaxHotness := MAX(MSDMusic, song_hotness);
HottestSongs := MSDMusic(song_hotness = MaxHotness AND year <> 0);
OUTPUT(SORT(HottestSongs, year));

// CATEGORY TWO
//Get songs by defined conditions and sort
ColdplayHot := MSDMusic(artist_name = 'Coldplay' AND song_hotness >= 0.75);
SortedColdplay := SORT(ColdplayHot, title);

//Output the result
OUTPUT(SortedColdplay);

//Count and output result
OUTPUT(COUNT(ColdplayHot));

//Filter for required conditions
FilteredSongs := MSDMusic(duration BETWEEN 200 AND 250 AND
                         song_hotness <> 0 AND
                         familiarity > 0.9);

//Count and display result
OUTPUT(COUNT(FilteredSongs));
OUTPUT(FilteredSongs);

//Create new RECORD layout and PROJECT
BasicLayout := RECORD
    STRING title := MSDMusic.title;
    STRING artist_name := MSDMusic.artist_name;
    STRING release := MSDMusic.release_name;
    INTEGER year := MSDMusic.year;
END;

BasicDS := PROJECT(MSDMusic,
                  TRANSFORM(BasicLayout,
                          SELF.title := LEFT.title;
                          SELF.artist_name := LEFT.artist_name;
                          SELF.release := LEFT.release_name;
                          SELF.year := LEFT.year));

// Display result
OUTPUT(CHOOSEN(BasicDS, 50));

//Correlation Analysis
OUTPUT(CORRELATION(MSDMusic, song_hotness, artist_hotness));
OUTPUT(CORRELATION(MSDMusic, barsstartdev, beatsstartdev));

// CATEGORY THREE
//Create the RECORD layout and PROJECT for Enhanced view
EnhancedLayout := RECORD
    STRING song;
    STRING artist;
    BOOLEAN isPopular;
    BOOLEAN isTooLoud;
END;

EnhancedDS := PROJECT(MSDMusic,
                     TRANSFORM(EnhancedLayout,
                             SELF.song := LEFT.title;
                             SELF.artist := LEFT.artist_name;
                             SELF.isPopular := LEFT.song_hotness > 0.80;
                             SELF.isTooLoud := LEFT.loudness > 0));

//Display the result
OUTPUT(CHOOSEN(EnhancedDS, 50));

// Display number of songs per Year
YearStats := TABLE(MSDMusic, 
                  {year, 
                   INTEGER totalSongs := COUNT(GROUP)}, 
                  year);
                  
// Display the result
OUTPUT(YearStats);

// Count total number of years
OUTPUT(COUNT(YearStats));

// Hottest songs between 2006-2007
FilteredYears := MSDMusic(year IN [2006, 2007]);

// Create Cross-Tab TABLE for average hotness by artist
ArtistHotness := TABLE(FilteredYears,
                      {artist_name,
                       REAL hotRate := AVE(GROUP, song_hotness)},
                      artist_name);

// Display top 10 results sorted by hotRate
OUTPUT(TOPN(ArtistHotness, 10, -hotRate));