export type SubPosition =
  | 'Centre-Forward'
  | 'Second Striker'
  | 'Left Winger'
  | 'Right Winger'
  | 'Attacking Midfield'
  | 'Central Midfield'
  | 'Defensive Midfield'
  | 'Left-Back'
  | 'Right-Back'
  | 'Centre-Back'
  | 'Goalkeeper';

export interface Player {
  id: string;
  name: string;
  image_url: string;
  country: string;
  country_code?: string;
  age: number;
  date_of_birth?: string;
  current_club: string;
  club_logo?: string;
  season_clubs: string;
  leagues: string;
  sub_position: SubPosition;
  market_value: number;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  g_90: number;
  a_90: number;
  ga_90: number;

  // Optional advanced metrics.
  // We will only display these when backed by real data.
  xg?: number;
  xa?: number;
  key_passes_90?: number;
  tackles_90?: number;
  interceptions_90?: number;
  progressive_passes_90?: number;
  dribbles_completed_90?: number;
  aerial_won_pct?: number;
  pass_completion_pct?: number;
  shots_on_target_pct?: number;
  scout_rating?: number;
  potential?: string;
  foot?: 'Right' | 'Left' | 'Both';
  height?: number;
  contract_until?: string;
  scout_notes?: string;
}

export interface FilterState {
  position: string;
  maxAge: number;
  maxMarketValue: number;
  minMinutes: number;
  league: string;
  searchQuery: string;
  sortBy:
    | 'ga_90'
    | 'g_90'
    | 'a_90'
    | 'market_value'
    | 'minutes'
    | 'goals'
    | 'assists'
    | 'scout_rating';
  sortOrder: 'asc' | 'desc';
}

export interface LocalhostConfig {
  url: string;
  status: 'disconnected' | 'connected' | 'checking' | 'error';
  lastSynced?: Date;
  errorMessage?: string;
  customHeaders?: Record<string, string>;
}