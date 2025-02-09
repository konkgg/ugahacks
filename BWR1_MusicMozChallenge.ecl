#OPTION('obfuscateOutput', TRUE);
IMPORT $;
IMPORT STD;
MozMusic := $.File_Music.MozDS;

// CSV Layout Record Structure
CSVLayout := RECORD
    STRING Category;
    STRING Analysis;
    STRING Result;
END;

// Basic result outputs
TotalCount := COUNT(MozMusic);
OUTPUT(DATASET([{'Category One', 'Total Records', (STRING)TotalCount}], CSVLayout),
       NAMED('CSV_Total_Count'));

// Rock songs count
RockCount := COUNT(MozMusic(genre='Rock'));
OUTPUT(DATASET([{'Category One', 'Rock Songs Count', (STRING)RockCount}], CSVLayout),
       NAMED('CSV_Rock_Count'));

// Depeche Mode 80s songs
DepecheMode_80s := COUNT(MozMusic(name='Depeche Mode' AND 
                                 (STRING)releasedate >= '1980' AND 
                                 (STRING)releasedate <= '1989'));
OUTPUT(DATASET([{'Category One', 'Depeche Mode 80s Songs', (STRING)DepecheMode_80s}], CSVLayout),
       NAMED('CSV_Depeche_Mode'));

// My Way songs count
MyWayCount := COUNT(MozMusic(tracktitle = 'My Way'));
OUTPUT(DATASET([{'Category One', 'My Way Songs', (STRING)MyWayCount}], CSVLayout),
       NAMED('CSV_My_Way'));

// Category Two
// U2 songs count
U2Count := COUNT(MozMusic(name = 'U2'));
OUTPUT(DATASET([{'Category Two', 'U2 Songs', (STRING)U2Count}], CSVLayout),
       NAMED('CSV_U2_Count'));

// Guest musicians count
GuestCount := COUNT(MozMusic(TRIM(guestmusicians) <> ''));
OUTPUT(DATASET([{'Category Two', 'Songs with Guest Musicians', (STRING)GuestCount}], CSVLayout),
       NAMED('CSV_Guest_Count'));

// Genre Summary Layout
GenreSummaryLayout := RECORD
    STRING Category := 'Category Three';
    STRING Genre;
    INTEGER Count;
END;

// Create genre summary
GenreSummary := TABLE(MozMusic, 
    {
        STRING Category := 'Category Three',
        STRING Genre := genre,
        INTEGER Count := COUNT(GROUP)
    }, 
    genre);
OUTPUT(GenreSummary, NAMED('CSV_Genre_Summary'));

// Artist Releases 2001-2010
ArtistSummary := TABLE(MozMusic((STRING)releasedate >= '2001' AND (STRING)releasedate <= '2010'),
    {
        STRING Category := 'Category Three',
        STRING Artist := name,
        INTEGER ReleaseCount := COUNT(GROUP)
    },
    name);
ArtistSummarySort := SORT(ArtistSummary, -ReleaseCount);
OUTPUT(CHOOSEN(ArtistSummarySort, 10), NAMED('CSV_Artist_Releases'));