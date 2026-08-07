export interface TeamSeed {
  name: string;
  short: string;
  abbr: string;
  city: string;
  country: string;
  founded: number;
  stadium: string;
  capacity: number;
  colors: [string, string];
  coach: string;
}

export interface LeagueSeed {
  slug: string;
  name: string;
  short: string;
  sport: string;
  country: string;
  tier: number;
  season: string;
  teams: TeamSeed[];
}

const t = (
  name: string,
  short: string,
  abbr: string,
  city: string,
  country: string,
  founded: number,
  stadium: string,
  capacity: number,
  colors: [string, string],
  coach: string,
): TeamSeed => ({ name, short, abbr, city, country, founded, stadium, capacity, colors, coach });

export const LEAGUE_SEEDS: LeagueSeed[] = [
  {
    slug: "premier-league",
    name: "Premier League",
    short: "EPL",
    sport: "soccer",
    country: "England",
    tier: 1,
    season: "2025/26",
    teams: [
      t("Arsenal", "Arsenal", "ARS", "London", "England", 1886, "Emirates Stadium", 60704, ["#EF0107", "#FFFFFF"], "Mikel Arteta"),
      t("Manchester City", "Man City", "MCI", "Manchester", "England", 1880, "Etihad Stadium", 53400, ["#6CABDD", "#1C2C5B"], "Pep Guardiola"),
      t("Liverpool", "Liverpool", "LIV", "Liverpool", "England", 1892, "Anfield", 61276, ["#C8102E", "#00B2A9"], "Arne Slot"),
      t("Chelsea", "Chelsea", "CHE", "London", "England", 1905, "Stamford Bridge", 40343, ["#034694", "#FFFFFF"], "Enzo Maresca"),
      t("Tottenham Hotspur", "Spurs", "TOT", "London", "England", 1882, "Tottenham Hotspur Stadium", 62850, ["#132257", "#FFFFFF"], "Thomas Frank"),
      t("Manchester United", "Man Utd", "MUN", "Manchester", "England", 1878, "Old Trafford", 74310, ["#DA291C", "#FBE122"], "Rúben Amorim"),
      t("Newcastle United", "Newcastle", "NEW", "Newcastle", "England", 1892, "St James' Park", 52305, ["#241F20", "#FFFFFF"], "Eddie Howe"),
      t("Aston Villa", "Villa", "AVL", "Birmingham", "England", 1874, "Villa Park", 42657, ["#95BFE5", "#670E36"], "Unai Emery"),
      t("Brighton & Hove Albion", "Brighton", "BHA", "Brighton", "England", 1901, "Amex Stadium", 31800, ["#0057B8", "#FFCD00"], "Fabian Hürzeler"),
      t("West Ham United", "West Ham", "WHU", "London", "England", 1895, "London Stadium", 62500, ["#7A263A", "#1BB1E7"], "Graham Potter"),
      t("Crystal Palace", "Palace", "CRY", "London", "England", 1905, "Selhurst Park", 25486, ["#1B458F", "#C4122E"], "Oliver Glasner"),
      t("Everton", "Everton", "EVE", "Liverpool", "England", 1878, "Hill Dickinson Stadium", 52888, ["#003399", "#FFFFFF"], "David Moyes"),
      t("Fulham", "Fulham", "FUL", "London", "England", 1879, "Craven Cottage", 29589, ["#FFFFFF", "#000000"], "Marco Silva"),
      t("Brentford", "Brentford", "BRE", "London", "England", 1889, "Gtech Community Stadium", 17250, ["#E30613", "#FFFFFF"], "Keith Andrews"),
      t("Nottingham Forest", "Forest", "NFO", "Nottingham", "England", 1865, "City Ground", 30455, ["#DD0000", "#FFFFFF"], "Nuno Espírito Santo"),
      t("Wolverhampton Wanderers", "Wolves", "WOL", "Wolverhampton", "England", 1877, "Molineux", 31750, ["#FDB913", "#231F20"], "Vítor Pereira"),
      t("AFC Bournemouth", "Bournemouth", "BOU", "Bournemouth", "England", 1899, "Vitality Stadium", 11307, ["#DA291C", "#000000"], "Andoni Iraola"),
      t("Leeds United", "Leeds", "LEE", "Leeds", "England", 1919, "Elland Road", 37645, ["#FFFFFF", "#1D428A"], "Daniel Farke"),
      t("Burnley", "Burnley", "BUR", "Burnley", "England", 1882, "Turf Moor", 21944, ["#6C1D45", "#99D6EA"], "Scott Parker"),
      t("Sunderland", "Sunderland", "SUN", "Sunderland", "England", 1879, "Stadium of Light", 49000, ["#EB172B", "#FFFFFF"], "Régis Le Bris"),
    ],
  },
  {
    slug: "la-liga",
    name: "LaLiga",
    short: "LAL",
    sport: "soccer",
    country: "Spain",
    tier: 1,
    season: "2025/26",
    teams: [
      t("Real Madrid", "Real Madrid", "RMA", "Madrid", "Spain", 1902, "Santiago Bernabéu", 81044, ["#FFFFFF", "#FEBE10"], "Xabi Alonso"),
      t("FC Barcelona", "Barcelona", "BAR", "Barcelona", "Spain", 1899, "Spotify Camp Nou", 99354, ["#A50044", "#004D98"], "Hansi Flick"),
      t("Atlético Madrid", "Atlético", "ATM", "Madrid", "Spain", 1903, "Riyadh Air Metropolitano", 70460, ["#CB3524", "#FFFFFF"], "Diego Simeone"),
      t("Athletic Club", "Athletic", "ATH", "Bilbao", "Spain", 1898, "San Mamés", 53289, ["#EE2523", "#FFFFFF"], "Ernesto Valverde"),
      t("Villarreal", "Villarreal", "VIL", "Villarreal", "Spain", 1923, "Estadio de la Cerámica", 23500, ["#FFE667", "#005187"], "Marcelino"),
      t("Real Betis", "Betis", "BET", "Seville", "Spain", 1907, "Benito Villamarín", 60721, ["#00954C", "#FFFFFF"], "Manuel Pellegrini"),
      t("Real Sociedad", "Sociedad", "RSO", "San Sebastián", "Spain", 1909, "Reale Arena", 39500, ["#0067B1", "#FFFFFF"], "Sergio Francisco"),
      t("Sevilla", "Sevilla", "SEV", "Seville", "Spain", 1890, "Ramón Sánchez-Pizjuán", 43883, ["#FFFFFF", "#D40000"], "Matías Almeyda"),
      t("Valencia", "Valencia", "VAL", "Valencia", "Spain", 1919, "Mestalla", 49430, ["#FFFFFF", "#F18E00"], "Carlos Corberán"),
      t("Girona", "Girona", "GIR", "Girona", "Spain", 1930, "Montilivi", 14624, ["#CD2534", "#FFFFFF"], "Míchel"),
    ],
  },
  {
    slug: "serie-a",
    name: "Serie A",
    short: "SA",
    sport: "soccer",
    country: "Italy",
    tier: 1,
    season: "2025/26",
    teams: [
      t("Inter", "Inter", "INT", "Milan", "Italy", 1908, "San Siro", 75923, ["#0068A8", "#000000"], "Cristian Chivu"),
      t("AC Milan", "Milan", "MIL", "Milan", "Italy", 1899, "San Siro", 75923, ["#FB090B", "#000000"], "Massimiliano Allegri"),
      t("Juventus", "Juventus", "JUV", "Turin", "Italy", 1897, "Allianz Stadium", 41507, ["#000000", "#FFFFFF"], "Igor Tudor"),
      t("Napoli", "Napoli", "NAP", "Naples", "Italy", 1926, "Stadio Diego Armando Maradona", 54726, ["#12A0D7", "#FFFFFF"], "Antonio Conte"),
      t("AS Roma", "Roma", "ROM", "Rome", "Italy", 1927, "Stadio Olimpico", 70634, ["#8E1F2F", "#F0BC42"], "Gian Piero Gasperini"),
      t("Atalanta", "Atalanta", "ATA", "Bergamo", "Italy", 1907, "Gewiss Stadium", 21747, ["#1D6EB5", "#000000"], "Ivan Jurić"),
      t("Lazio", "Lazio", "LAZ", "Rome", "Italy", 1900, "Stadio Olimpico", 70634, ["#87D8F7", "#FFFFFF"], "Maurizio Sarri"),
      t("Fiorentina", "Fiorentina", "FIO", "Florence", "Italy", 1926, "Artemio Franchi", 43147, ["#592C82", "#FFFFFF"], "Stefano Pioli"),
    ],
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    short: "BUN",
    sport: "soccer",
    country: "Germany",
    tier: 1,
    season: "2025/26",
    teams: [
      t("Bayern Munich", "Bayern", "BAY", "Munich", "Germany", 1900, "Allianz Arena", 75024, ["#DC052D", "#FFFFFF"], "Vincent Kompany"),
      t("Bayer Leverkusen", "Leverkusen", "B04", "Leverkusen", "Germany", 1904, "BayArena", 30210, ["#E32221", "#000000"], "Kasper Hjulmand"),
      t("Borussia Dortmund", "Dortmund", "BVB", "Dortmund", "Germany", 1909, "Signal Iduna Park", 81365, ["#FDE100", "#000000"], "Niko Kovač"),
      t("RB Leipzig", "Leipzig", "RBL", "Leipzig", "Germany", 2009, "Red Bull Arena", 47069, ["#DD0741", "#FFFFFF"], "Ole Werner"),
      t("VfB Stuttgart", "Stuttgart", "VFB", "Stuttgart", "Germany", 1893, "MHPArena", 60449, ["#FFFFFF", "#E32219"], "Sebastian Hoeneß"),
      t("Eintracht Frankfurt", "Frankfurt", "SGE", "Frankfurt", "Germany", 1899, "Deutsche Bank Park", 58000, ["#000000", "#E1000F"], "Dino Toppmöller"),
    ],
  },
  {
    slug: "nba",
    name: "NBA",
    short: "NBA",
    sport: "basketball",
    country: "USA",
    tier: 1,
    season: "2025-26",
    teams: [
      t("Boston Celtics", "Celtics", "BOS", "Boston", "USA", 1946, "TD Garden", 19156, ["#007A33", "#BA9653"], "Joe Mazzulla"),
      t("Denver Nuggets", "Nuggets", "DEN", "Denver", "USA", 1967, "Ball Arena", 19520, ["#0E2240", "#FEC524"], "David Adelman"),
      t("Oklahoma City Thunder", "Thunder", "OKC", "Oklahoma City", "USA", 1967, "Paycom Center", 18203, ["#007AC1", "#EF3B24"], "Mark Daigneault"),
      t("New York Knicks", "Knicks", "NYK", "New York", "USA", 1946, "Madison Square Garden", 19812, ["#006BB6", "#F58426"], "Mike Brown"),
      t("Los Angeles Lakers", "Lakers", "LAL", "Los Angeles", "USA", 1947, "Crypto.com Arena", 18997, ["#552583", "#FDB927"], "JJ Redick"),
      t("Golden State Warriors", "Warriors", "GSW", "San Francisco", "USA", 1946, "Chase Center", 18064, ["#1D428A", "#FFC72C"], "Steve Kerr"),
      t("Milwaukee Bucks", "Bucks", "MIL", "Milwaukee", "USA", 1968, "Fiserv Forum", 17341, ["#00471B", "#EEE1C6"], "Doc Rivers"),
      t("Philadelphia 76ers", "76ers", "PHI", "Philadelphia", "USA", 1946, "Xfinity Mobile Arena", 20478, ["#006BB6", "#ED174C"], "Nick Nurse"),
      t("Dallas Mavericks", "Mavericks", "DAL", "Dallas", "USA", 1980, "American Airlines Center", 19200, ["#00538C", "#B8C4CA"], "Jason Kidd"),
      t("Minnesota Timberwolves", "Timberwolves", "MIN", "Minneapolis", "USA", 1989, "Target Center", 18978, ["#0C2340", "#236192"], "Chris Finch"),
      t("Cleveland Cavaliers", "Cavaliers", "CLE", "Cleveland", "USA", 1970, "Rocket Arena", 19432, ["#860038", "#FDBB30"], "Kenny Atkinson"),
      t("Phoenix Suns", "Suns", "PHX", "Phoenix", "USA", 1968, "PHX Arena", 17071, ["#1D1160", "#E56020"], "Jordan Ott"),
      t("Miami Heat", "Heat", "MIA", "Miami", "USA", 1988, "Kaseya Center", 19600, ["#98002E", "#F9A01B"], "Erik Spoelstra"),
      t("Houston Rockets", "Rockets", "HOU", "Houston", "USA", 1967, "Toyota Center", 18055, ["#CE1141", "#000000"], "Ime Udoka"),
      t("Orlando Magic", "Magic", "ORL", "Orlando", "USA", 1989, "Kia Center", 18846, ["#0077C0", "#C4CED4"], "Jamahl Mosley"),
      t("Indiana Pacers", "Pacers", "IND", "Indianapolis", "USA", 1967, "Gainbridge Fieldhouse", 17274, ["#002D62", "#FDBB30"], "Rick Carlisle"),
    ],
  },
  {
    slug: "euroleague",
    name: "EuroLeague",
    short: "EL",
    sport: "basketball",
    country: "Europe",
    tier: 1,
    season: "2025-26",
    teams: [
      t("Real Madrid Baloncesto", "Real Madrid", "RMB", "Madrid", "Spain", 1931, "Movistar Arena", 15500, ["#FFFFFF", "#6C4B9C"], "Sergio Scariolo"),
      t("Panathinaikos", "Panathinaikos", "PAO", "Athens", "Greece", 1908, "OAKA", 18300, ["#007A33", "#FFFFFF"], "Ergin Ataman"),
      t("Fenerbahçe Beko", "Fenerbahçe", "FEN", "Istanbul", "Turkey", 1913, "Ülker Sports Arena", 13059, ["#FFED00", "#00246B"], "Šarūnas Jasikevičius"),
      t("Olympiacos", "Olympiacos", "OLY", "Piraeus", "Greece", 1925, "Peace and Friendship Stadium", 12500, ["#DA1E37", "#FFFFFF"], "Georgios Bartzokas"),
      t("FC Barcelona Bàsquet", "Barcelona", "BCB", "Barcelona", "Spain", 1926, "Palau Blaugrana", 7585, ["#A50044", "#004D98"], "Joan Peñarroya"),
      t("Virtus Bologna", "Virtus", "VIR", "Bologna", "Italy", 1929, "Segafredo Arena", 9800, ["#000000", "#FFFFFF"], "Dušan Alimpijević"),
    ],
  },
  {
    slug: "nfl",
    name: "NFL",
    short: "NFL",
    sport: "american-football",
    country: "USA",
    tier: 1,
    season: "2025",
    teams: [
      t("Kansas City Chiefs", "Chiefs", "KC", "Kansas City", "USA", 1960, "GEHA Field at Arrowhead", 76416, ["#E31837", "#FFB81C"], "Andy Reid"),
      t("Philadelphia Eagles", "Eagles", "PHI", "Philadelphia", "USA", 1933, "Lincoln Financial Field", 69796, ["#004C54", "#A5ACAF"], "Nick Sirianni"),
      t("Baltimore Ravens", "Ravens", "BAL", "Baltimore", "USA", 1996, "M&T Bank Stadium", 71008, ["#241773", "#9E7C0C"], "John Harbaugh"),
      t("San Francisco 49ers", "49ers", "SF", "Santa Clara", "USA", 1946, "Levi's Stadium", 68500, ["#AA0000", "#B3995D"], "Kyle Shanahan"),
      t("Buffalo Bills", "Bills", "BUF", "Orchard Park", "USA", 1960, "Highmark Stadium", 71608, ["#00338D", "#C60C30"], "Sean McDermott"),
      t("Detroit Lions", "Lions", "DET", "Detroit", "USA", 1930, "Ford Field", 65000, ["#0076B6", "#B0B7BC"], "Dan Campbell"),
    ],
  },
  {
    slug: "mlb",
    name: "MLB",
    short: "MLB",
    sport: "baseball",
    country: "USA",
    tier: 1,
    season: "2026",
    teams: [
      t("Los Angeles Dodgers", "Dodgers", "LAD", "Los Angeles", "USA", 1883, "Dodger Stadium", 56000, ["#005A9C", "#FFFFFF"], "Dave Roberts"),
      t("New York Yankees", "Yankees", "NYY", "New York", "USA", 1901, "Yankee Stadium", 46537, ["#0C2340", "#FFFFFF"], "Aaron Boone"),
      t("Atlanta Braves", "Braves", "ATL", "Atlanta", "USA", 1871, "Truist Park", 41084, ["#CE1141", "#13274F"], "Brian Snitker"),
      t("Houston Astros", "Astros", "HOU", "Houston", "USA", 1962, "Daikin Park", 41168, ["#EB6E1F", "#002D62"], "Joe Espada"),
      t("Philadelphia Phillies", "Phillies", "PHI", "Philadelphia", "USA", 1883, "Citizens Bank Park", 42901, ["#E81828", "#002D72"], "Rob Thomson"),
      t("Seattle Mariners", "Mariners", "SEA", "Seattle", "USA", 1977, "T-Mobile Park", 47929, ["#0C2C56", "#005C5C"], "Dan Wilson"),
    ],
  },
  {
    slug: "ipl",
    name: "Indian Premier League",
    short: "IPL",
    sport: "cricket",
    country: "India",
    tier: 1,
    season: "2026",
    teams: [
      t("Mumbai Indians", "Mumbai", "MI", "Mumbai", "India", 2008, "Wankhede Stadium", 33108, ["#004BA0", "#D1AB3E"], "Mahela Jayawardene"),
      t("Chennai Super Kings", "Chennai", "CSK", "Chennai", "India", 2008, "M. A. Chidambaram Stadium", 50000, ["#FFFF3C", "#0081E9"], "Stephen Fleming"),
      t("Kolkata Knight Riders", "Kolkata", "KKR", "Kolkata", "India", 2008, "Eden Gardens", 68000, ["#3A225D", "#D4AF37"], "Chandrakant Pandit"),
      t("Royal Challengers Bengaluru", "Bengaluru", "RCB", "Bengaluru", "India", 2008, "M. Chinnaswamy Stadium", 40000, ["#EC1C24", "#000000"], "Andy Flower"),
    ],
  },
  {
    slug: "atp-tour",
    name: "ATP Tour",
    short: "ATP",
    sport: "tennis",
    country: "World",
    tier: 1,
    season: "2026",
    teams: [
      t("Australian Open", "AO", "AO", "Melbourne", "Australia", 1905, "Rod Laver Arena", 14820, ["#0091D2", "#FFFFFF"], "Hard"),
      t("Roland-Garros", "RG", "RG", "Paris", "France", 1891, "Court Philippe-Chatrier", 15225, ["#C84B31", "#FFFFFF"], "Clay"),
      t("Wimbledon", "Wimbledon", "WIM", "London", "England", 1877, "Centre Court", 14979, ["#006633", "#4B0082"], "Grass"),
      t("US Open", "US Open", "USO", "New York", "USA", 1881, "Arthur Ashe Stadium", 23771, ["#0A2240", "#FFD400"], "Hard"),
    ],
  },
  {
    slug: "nhl",
    name: "NHL",
    short: "NHL",
    sport: "hockey",
    country: "North America",
    tier: 1,
    season: "2025-26",
    teams: [
      t("Florida Panthers", "Panthers", "FLA", "Sunrise", "USA", 1993, "Amerant Bank Arena", 19250, ["#C8102E", "#B9975B"], "Paul Maurice"),
      t("Edmonton Oilers", "Oilers", "EDM", "Edmonton", "Canada", 1972, "Rogers Place", 18347, ["#041E42", "#FF4C00"], "Kris Knoblauch"),
      t("Colorado Avalanche", "Avalanche", "COL", "Denver", "USA", 1972, "Ball Arena", 18086, ["#6F263D", "#236192"], "Jared Bednar"),
      t("Toronto Maple Leafs", "Maple Leafs", "TOR", "Toronto", "Canada", 1917, "Scotiabank Arena", 18800, ["#00205B", "#FFFFFF"], "Craig Berube"),
      t("Vegas Golden Knights", "Golden Knights", "VGK", "Las Vegas", "USA", 2017, "T-Mobile Arena", 17500, ["#B4975A", "#333F42"], "Bruce Cassidy"),
      t("Boston Bruins", "Bruins", "BOS", "Boston", "USA", 1924, "TD Garden", 17850, ["#FFB81C", "#000000"], "Marco Sturm"),
    ],
  },
];

export const FIRST_NAMES = [
  "Marcus", "Luka", "Rafael", "Diego", "Kai", "Theo", "Nico", "Emre", "Andrés", "Joel",
  "Mateo", "Elias", "Yuri", "Tobias", "Malik", "Jonas", "Adrian", "Rasmus", "Ibrahim", "Santiago",
  "Owen", "Felix", "Dante", "Hugo", "Noah", "Levi", "Amir", "Kofi", "Lars", "Bruno",
  "Declan", "Ayo", "Sacha", "Miro", "Enzo", "Tariq", "Viktor", "Jude", "Reece", "Kylian",
];

export const LAST_NAMES = [
  "Okafor", "Silva", "Nakamura", "Bergström", "Moretti", "Kovačević", "Andersen", "Duarte",
  "Fernández", "Haaland", "Mbeki", "Petrov", "Lindqvist", "Rossi", "Castillo", "Volkov",
  "Nakagawa", "Owusu", "Kimura", "Dembélé", "Radić", "Nowak", "Costa", "Ferreira",
  "Novak", "Hassan", "Björk", "Maldini", "Ibrahimović", "Sørensen", "Tanaka", "Vermeulen",
  "Adeyemi", "Rahman", "Quintero", "Laurent", "Ashworth", "Mendes", "Karlsson", "Beaumont",
];

export const NATIONS = [
  "England", "Brazil", "Spain", "France", "Germany", "Argentina", "Portugal", "Netherlands",
  "Nigeria", "Japan", "USA", "Croatia", "Sweden", "Senegal", "Serbia", "Canada", "Australia",
  "Ghana", "Italy", "Morocco",
];