export type Role = 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper';

export interface Player {
  id: string;
  name: string;
  shortName: string;
  role: Role;
  battingStyle?: string;
  bowlingStyle?: string;
}

export type DismissalType =
  | 'bowled'
  | 'caught'
  | 'caught-bowled'
  | 'lbw'
  | 'run-out'
  | 'stumped'
  | 'hit-wicket'
  | 'retired-hurt';

export interface DismissalInfo {
  type: DismissalType;
  batsmanId: string;
  batsmanName: string;
  bowlerId?: string;
  bowlerName?: string;
  fielderId?: string;
  fielderName?: string;
  over: string; // e.g. "14.2"
  runsAtFall: number;
  wicketNumber: number;
}

export type ExtraType = 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'penalty';

export interface BallDelivery {
  id: string;
  inningsNumber: 1 | 2;
  overNumber: number; // 0-indexed over (0 = 1st over)
  ballInOver: number; // 1 to 6 legal ball
  legalBall: boolean;
  strikerId: string;
  strikerName: string;
  nonStrikerId: string;
  nonStrikerName: string;
  bowlerId: string;
  bowlerName: string;
  strikerRuns: number;
  extraRuns: number;
  extraType?: ExtraType;
  totalRuns: number;
  isWicket: boolean;
  wicketInfo?: DismissalInfo;
  commentary: string;
  timestamp: number;
  scoreAtEnd: {
    runs: number;
    wickets: number;
    oversDisplay: string;
  };
}

export interface BatsmanInningsStats {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText?: string;
  isBatting: boolean;
  isStriker: boolean;
  dots: number;
  singles: number;
  twos: number;
  threes: number;
  scoringZones?: { offSide: number; legSide: number; straight: number };
}

export interface BowlerInningsStats {
  playerId: string;
  playerName: string;
  overs: string; // "3.4"
  legalBallsBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  dots: number;
  foursConceded: number;
  sixesConceded: number;
  wides: number;
  noBalls: number;
}

export interface Partnership {
  batsman1Id: string;
  batsman1Name: string;
  batsman1Runs: number;
  batsman2Id: string;
  batsman2Name: string;
  batsman2Runs: number;
  totalRuns: number;
  balls: number;
  wicketNumber: number;
}

export interface Innings {
  inningsNumber: 1 | 2;
  battingTeamId: string;
  battingTeamName: string;
  bowlingTeamId: string;
  bowlingTeamName: string;
  totalRuns: number;
  totalWickets: number;
  legalBalls: number;
  oversDisplay: string; // e.g. "17.4"
  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;
  previousBowlerId?: string;
  deliveries: BallDelivery[];
  fallOfWickets: DismissalInfo[];
  partnerships: Partnership[];
  currentPartnership: Partnership;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
    total: number;
  };
  batsmenStats: Record<string, BatsmanInningsStats>;
  bowlersStats: Record<string, BowlerInningsStats>;
  isCompleted: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  players: Player[];
}

export type MatchStatus = 'live' | 'innings_break' | 'completed';

export interface Match {
  id: string;
  name: string;
  venue: string;
  matchType: 'T20' | 'ODI' | 'Custom';
  totalOvers: number;
  team1: Team;
  team2: Team;
  tossWinnerId: string;
  tossDecision: 'bat' | 'bowl';
  currentInningsIndex: 0 | 1;
  innings: [Innings, Innings];
  status: MatchStatus;
  target?: number;
  resultSummary?: string;
}

export interface PlayerMatchAggregate {
  player: Player;
  teamName: string;
  teamShortName: string;
  batting?: BatsmanInningsStats;
  bowling?: BowlerInningsStats;
  catches: number;
  runOuts: number;
  mvpPoints: number;
}
