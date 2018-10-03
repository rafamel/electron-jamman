export default `CREATE TABLE jamlists (id INTEGER PRIMARY KEY, color INTEGER(1) NOT NULL, name VARCHAR(30) NOT NULL);

CREATE TABLE loops (id INTEGER PRIMARY KEY, jamlistid INTEGER, isvalid VARCHAR NOT NULL CHECK(inlibrary='true' OR inlibrary='false'), deviceid VARCHAR, devicename VARCHAR, storagepath VARCHAR CHECK(storagepath='internal' OR storagepath='external' OR storagepath=NULL), inlibrary VARCHAR NOT NULL CHECK(inlibrary='true' OR inlibrary='false'), 'Loop #' INTEGER, Name VARCHAR(30), Length TIME, Rating INTEGER(1), Description VARCHAR(30), Artist VARCHAR(30), Genre VARCHAR(30), Tags VARCHAR(30), StopMode VARCHAR, RhythmType VARCHAR, bpMeasure INTEGER, bpMinute INTEGER, isReversed BOOL, isLoop BOOL, settingsVersion INTEGER, audioVersion INTEGER, guidoriginal VARCHAR, guidpatch VARCHAR, guidphrase VARCHAR, filechecksum INTEGER, propchecksum INTEGER, temppath VARCHAR(256), filepath VARCHAR(256));`;