import { Match, Team, Innings, BatsmanInningsStats, BowlerInningsStats, BallDelivery, DismissalInfo } from '../types/cricket';

export const teamIndia: Team = {
  id: 'team-ind',
  name: 'India',
  shortName: 'IND',
  primaryColor: '#0ea5e9',
  secondaryColor: '#f97316',
  players: [
    { id: 'ind-1', name: 'Rohit Sharma (c)', shortName: 'R. Sharma', role: 'batsman', battingStyle: 'Right-hand bat' },
    { id: 'ind-2', name: 'Yashasvi Jaiswal', shortName: 'Y. Jaiswal', role: 'batsman', battingStyle: 'Left-hand bat' },
    { id: 'ind-3', name: 'Virat Kohli', shortName: 'V. Kohli', role: 'batsman', battingStyle: 'Right-hand bat' },
    { id: 'ind-4', name: 'Suryakumar Yadav', shortName: 'SK Yadav', role: 'batsman', battingStyle: 'Right-hand bat' },
    { id: 'ind-5', name: 'Rishabh Pant (wk)', shortName: 'R. Pant', role: 'wicketkeeper', battingStyle: 'Left-hand bat' },
    { id: 'ind-6', name: 'Hardik Pandya', shortName: 'H. Pandya', role: 'all-rounder', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium fast' },
    { id: 'ind-7', name: 'Ravindra Jadeja', shortName: 'R. Jadeja', role: 'all-rounder', battingStyle: 'Left-hand bat', bowlingStyle: 'Slow left-arm orthodox' },
    { id: 'ind-8', name: 'Axar Patel', shortName: 'A. Patel', role: 'all-rounder', battingStyle: 'Left-hand bat', bowlingStyle: 'Slow left-arm orthodox' },
    { id: 'ind-9', name: 'Kuldeep Yadav', shortName: 'K. Yadav', role: 'bowler', battingStyle: 'Left-hand bat', bowlingStyle: 'Left-arm wrist spin' },
    { id: 'ind-10', name: 'Jasprit Bumrah', shortName: 'J. Bumrah', role: 'bowler', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast' },
    { id: 'ind-11', name: 'Arshdeep Singh', shortName: 'A. Singh', role: 'bowler', battingStyle: 'Left-hand bat', bowlingStyle: 'Left-arm medium fast' },
  ],
};

export const teamAustralia: Team = {
  id: 'team-aus',
  name: 'Australia',
  shortName: 'AUS',
  primaryColor: '#eab308',
  secondaryColor: '#15803d',
  players: [
    { id: 'aus-1', name: 'Travis Head', shortName: 'T. Head', role: 'batsman', battingStyle: 'Left-hand bat' },
    { id: 'aus-2', name: 'David Warner', shortName: 'D. Warner', role: 'batsman', battingStyle: 'Left-hand bat' },
    { id: 'aus-3', name: 'Mitchell Marsh (c)', shortName: 'M. Marsh', role: 'all-rounder', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium' },
    { id: 'aus-4', name: 'Glenn Maxwell', shortName: 'G. Maxwell', role: 'all-rounder', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm off-break' },
    { id: 'aus-5', name: 'Marcus Stoinis', shortName: 'M. Stoinis', role: 'all-rounder', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm medium fast' },
    { id: 'aus-6', name: 'Tim David', shortName: 'T. David', role: 'batsman', battingStyle: 'Right-hand bat' },
    { id: 'aus-7', name: 'Matthew Wade (wk)', shortName: 'M. Wade', role: 'wicketkeeper', battingStyle: 'Left-hand bat' },
    { id: 'aus-8', name: 'Pat Cummins', shortName: 'P. Cummins', role: 'bowler', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast' },
    { id: 'aus-9', name: 'Mitchell Starc', shortName: 'M. Starc', role: 'bowler', battingStyle: 'Left-hand bat', bowlingStyle: 'Left-arm fast' },
    { id: 'aus-10', name: 'Adam Zampa', shortName: 'A. Zampa', role: 'bowler', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm leg-break' },
    { id: 'aus-11', name: 'Josh Hazlewood', shortName: 'J. Hazlewood', role: 'bowler', battingStyle: 'Right-hand bat', bowlingStyle: 'Right-arm fast medium' },
  ],
};

// Innings 1: Australia batted first, scored 178/6 in 20.0 overs
const ausBatsmenStats: Record<string, BatsmanInningsStats> = {
  'aus-1': { playerId: 'aus-1', playerName: 'Travis Head', runs: 42, balls: 24, fours: 5, sixes: 2, strikeRate: 175.0, isOut: true, dismissalText: 'c Sharma b Bumrah', isBatting: false, isStriker: false, dots: 8, singles: 7, twos: 2, threes: 0, scoringZones: { offSide: 26, legSide: 12, straight: 4 } },
  'aus-2': { playerId: 'aus-2', playerName: 'David Warner', runs: 28, balls: 21, fours: 3, sixes: 1, strikeRate: 133.3, isOut: true, dismissalText: 'b Arshdeep', isBatting: false, isStriker: false, dots: 7, singles: 9, twos: 1, threes: 0, scoringZones: { offSide: 14, legSide: 10, straight: 4 } },
  'aus-3': { playerId: 'aus-3', playerName: 'Mitchell Marsh (c)', runs: 37, balls: 28, fours: 3, sixes: 2, strikeRate: 132.1, isOut: true, dismissalText: 'c Pant b Kuldeep', isBatting: false, isStriker: false, dots: 9, singles: 12, twos: 2, threes: 0, scoringZones: { offSide: 12, legSide: 20, straight: 5 } },
  'aus-4': { playerId: 'aus-4', playerName: 'Glenn Maxwell', runs: 20, balls: 12, fours: 1, sixes: 2, strikeRate: 166.7, isOut: true, dismissalText: 'c Jadeja b Patel', isBatting: false, isStriker: false, dots: 3, singles: 4, twos: 2, threes: 0, scoringZones: { offSide: 8, legSide: 12, straight: 0 } },
  'aus-5': { playerId: 'aus-5', playerName: 'Marcus Stoinis', runs: 24, balls: 18, fours: 2, sixes: 1, strikeRate: 133.3, isOut: true, dismissalText: 'c & b Pandya', isBatting: false, isStriker: false, dots: 5, singles: 9, twos: 1, threes: 0, scoringZones: { offSide: 6, legSide: 14, straight: 4 } },
  'aus-6': { playerId: 'aus-6', playerName: 'Tim David', runs: 16, balls: 11, fours: 1, sixes: 1, strikeRate: 145.5, isOut: true, dismissalText: 'run out (Pandya)', isBatting: false, isStriker: false, dots: 3, singles: 5, twos: 1, threes: 0, scoringZones: { offSide: 4, legSide: 8, straight: 4 } },
  'aus-7': { playerId: 'aus-7', playerName: 'Matthew Wade (wk)', runs: 8, balls: 6, fours: 1, sixes: 0, strikeRate: 133.3, isOut: false, dismissalText: 'not out', isBatting: true, isStriker: true, dots: 2, singles: 2, twos: 1, threes: 0, scoringZones: { offSide: 6, legSide: 2, straight: 0 } },
  'aus-8': { playerId: 'aus-8', playerName: 'Pat Cummins', runs: 3, balls: 2, fours: 0, sixes: 0, strikeRate: 150.0, isOut: false, dismissalText: 'not out', isBatting: true, isStriker: false, dots: 0, singles: 1, twos: 1, threes: 0, scoringZones: { offSide: 1, legSide: 2, straight: 0 } },
};

const indBowlersStats: Record<string, BowlerInningsStats> = {
  'ind-11': { playerId: 'ind-11', playerName: 'Arshdeep Singh', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 35, wickets: 1, economy: 8.75, dots: 10, foursConceded: 4, sixesConceded: 1, wides: 1, noBalls: 0 },
  'ind-10': { playerId: 'ind-10', playerName: 'Jasprit Bumrah', overs: '4.0', legalBallsBowled: 24, maidens: 1, runsConceded: 22, wickets: 1, economy: 5.50, dots: 14, foursConceded: 2, sixesConceded: 0, wides: 0, noBalls: 0 },
  'ind-8': { playerId: 'ind-8', playerName: 'Axar Patel', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 34, wickets: 1, economy: 8.50, dots: 8, foursConceded: 3, sixesConceded: 2, wides: 1, noBalls: 0 },
  'ind-6': { playerId: 'ind-6', playerName: 'Hardik Pandya', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 38, wickets: 1, economy: 9.50, dots: 7, foursConceded: 4, sixesConceded: 2, wides: 2, noBalls: 1 },
  'ind-9': { playerId: 'ind-9', playerName: 'Kuldeep Yadav', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 41, wickets: 1, economy: 10.25, dots: 6, foursConceded: 3, sixesConceded: 3, wides: 2, noBalls: 0 },
};

const ausFallOfWickets: DismissalInfo[] = [
  { type: 'bowled', batsmanId: 'aus-2', batsmanName: 'David Warner', bowlerId: 'ind-11', bowlerName: 'Arshdeep Singh', over: '4.3', runsAtFall: 38, wicketNumber: 1 },
  { type: 'caught', batsmanId: 'aus-1', batsmanName: 'Travis Head', bowlerId: 'ind-10', bowlerName: 'Jasprit Bumrah', fielderId: 'ind-1', fielderName: 'Rohit Sharma', over: '7.1', runsAtFall: 65, wicketNumber: 2 },
  { type: 'caught', batsmanId: 'aus-4', batsmanName: 'Glenn Maxwell', bowlerId: 'ind-8', bowlerName: 'Axar Patel', fielderId: 'ind-7', fielderName: 'Ravindra Jadeja', over: '11.4', runsAtFall: 104, wicketNumber: 3 },
  { type: 'caught', batsmanId: 'aus-3', batsmanName: 'Mitchell Marsh', bowlerId: 'ind-9', bowlerName: 'Kuldeep Yadav', fielderId: 'ind-5', fielderName: 'Rishabh Pant', over: '14.5', runsAtFall: 132, wicketNumber: 4 },
  { type: 'caught-bowled', batsmanId: 'aus-5', batsmanName: 'Marcus Stoinis', bowlerId: 'ind-6', bowlerName: 'Hardik Pandya', fielderId: 'ind-6', fielderName: 'Hardik Pandya', over: '17.2', runsAtFall: 154, wicketNumber: 5 },
  { type: 'run-out', batsmanId: 'aus-6', batsmanName: 'Tim David', fielderId: 'ind-6', fielderName: 'Hardik Pandya', over: '19.1', runsAtFall: 171, wicketNumber: 6 },
];

export const initialInnings1: Innings = {
  inningsNumber: 1,
  battingTeamId: 'team-aus',
  battingTeamName: 'Australia',
  bowlingTeamId: 'team-ind',
  bowlingTeamName: 'India',
  totalRuns: 178,
  totalWickets: 6,
  legalBalls: 120,
  oversDisplay: '20.0',
  currentStrikerId: 'aus-7',
  currentNonStrikerId: 'aus-8',
  currentBowlerId: 'ind-11',
  deliveries: [],
  fallOfWickets: ausFallOfWickets,
  partnerships: [],
  currentPartnership: {
    batsman1Id: 'aus-7',
    batsman1Name: 'Matthew Wade',
    batsman1Runs: 8,
    batsman2Id: 'aus-8',
    batsman2Name: 'Pat Cummins',
    batsman2Runs: 3,
    totalRuns: 7,
    balls: 5,
    wicketNumber: 7,
  },
  extras: { wides: 6, noBalls: 1, byes: 0, legByes: 1, penalties: 0, total: 8 },
  batsmenStats: ausBatsmenStats,
  bowlersStats: indBowlersStats,
  isCompleted: true,
};

// Innings 2: India chasing 179 - currently 156/4 in 17.3 overs
const indBatsmenStats: Record<string, BatsmanInningsStats> = {
  'ind-1': { playerId: 'ind-1', playerName: 'Rohit Sharma (c)', runs: 26, balls: 16, fours: 3, sixes: 1, strikeRate: 162.5, isOut: true, dismissalText: 'c Warner b Starc', isBatting: false, isStriker: false, dots: 5, singles: 5, twos: 2, threes: 0, scoringZones: { offSide: 12, legSide: 10, straight: 4 } },
  'ind-2': { playerId: 'ind-2', playerName: 'Yashasvi Jaiswal', runs: 18, balls: 12, fours: 2, sixes: 1, strikeRate: 150.0, isOut: true, dismissalText: 'c Wade b Hazlewood', isBatting: false, isStriker: false, dots: 4, singles: 4, twos: 1, threes: 0, scoringZones: { offSide: 14, legSide: 4, straight: 0 } },
  'ind-3': { playerId: 'ind-3', playerName: 'Virat Kohli', runs: 58, balls: 38, fours: 5, sixes: 2, strikeRate: 152.6, isOut: false, dismissalText: 'not out', isBatting: true, isStriker: true, dots: 11, singles: 14, twos: 6, threes: 0, scoringZones: { offSide: 30, legSide: 22, straight: 6 } },
  'ind-4': { playerId: 'ind-4', playerName: 'Suryakumar Yadav', runs: 22, balls: 15, fours: 2, sixes: 1, strikeRate: 146.7, isOut: true, dismissalText: 'c Maxwell b Zampa', isBatting: false, isStriker: false, dots: 3, singles: 7, twos: 2, threes: 0, scoringZones: { offSide: 8, legSide: 14, straight: 0 } },
  'ind-5': { playerId: 'ind-5', playerName: 'Rishabh Pant (wk)', runs: 4, balls: 6, fours: 0, sixes: 0, strikeRate: 66.7, isOut: true, dismissalText: 'lbw b Cummins', isBatting: false, isStriker: false, dots: 4, singles: 2, twos: 0, threes: 0, scoringZones: { offSide: 2, legSide: 2, straight: 0 } },
  'ind-6': { playerId: 'ind-6', playerName: 'Hardik Pandya', runs: 24, balls: 14, fours: 2, sixes: 1, strikeRate: 171.4, isOut: false, dismissalText: 'not out', isBatting: true, isStriker: false, dots: 3, singles: 6, twos: 2, threes: 0, scoringZones: { offSide: 6, legSide: 12, straight: 6 } },
  'ind-7': { playerId: 'ind-7', playerName: 'Ravindra Jadeja', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, isBatting: false, isStriker: false, dots: 0, singles: 0, twos: 0, threes: 0 },
  'ind-8': { playerId: 'ind-8', playerName: 'Axar Patel', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, isBatting: false, isStriker: false, dots: 0, singles: 0, twos: 0, threes: 0 },
  'ind-9': { playerId: 'ind-9', playerName: 'Kuldeep Yadav', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, isBatting: false, isStriker: false, dots: 0, singles: 0, twos: 0, threes: 0 },
  'ind-10': { playerId: 'ind-10', playerName: 'Jasprit Bumrah', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, isBatting: false, isStriker: false, dots: 0, singles: 0, twos: 0, threes: 0 },
  'ind-11': { playerId: 'ind-11', playerName: 'Arshdeep Singh', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, isBatting: false, isStriker: false, dots: 0, singles: 0, twos: 0, threes: 0 },
};

const ausBowlersStats: Record<string, BowlerInningsStats> = {
  'aus-9': { playerId: 'aus-9', playerName: 'Mitchell Starc', overs: '3.0', legalBallsBowled: 18, maidens: 0, runsConceded: 31, wickets: 1, economy: 10.33, dots: 7, foursConceded: 4, sixesConceded: 1, wides: 1, noBalls: 0 },
  'aus-11': { playerId: 'aus-11', playerName: 'Josh Hazlewood', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 29, wickets: 1, economy: 7.25, dots: 10, foursConceded: 3, sixesConceded: 0, wides: 0, noBalls: 0 },
  'aus-8': { playerId: 'aus-8', playerName: 'Pat Cummins', overs: '3.3', legalBallsBowled: 21, maidens: 0, runsConceded: 30, wickets: 1, economy: 8.57, dots: 8, foursConceded: 3, sixesConceded: 2, wides: 1, noBalls: 0 },
  'aus-10': { playerId: 'aus-10', playerName: 'Adam Zampa', overs: '4.0', legalBallsBowled: 24, maidens: 0, runsConceded: 38, wickets: 1, economy: 9.50, dots: 6, foursConceded: 3, sixesConceded: 2, wides: 2, noBalls: 0 },
  'aus-5': { playerId: 'aus-5', playerName: 'Marcus Stoinis', overs: '3.0', legalBallsBowled: 18, maidens: 0, runsConceded: 24, wickets: 0, economy: 8.00, dots: 5, foursConceded: 1, sixesConceded: 1, wides: 0, noBalls: 0 },
};

const indFallOfWickets: DismissalInfo[] = [
  { type: 'caught', batsmanId: 'ind-2', batsmanName: 'Yashasvi Jaiswal', bowlerId: 'aus-11', bowlerName: 'Josh Hazlewood', fielderId: 'aus-7', fielderName: 'Matthew Wade', over: '3.2', runsAtFall: 29, wicketNumber: 1 },
  { type: 'caught', batsmanId: 'ind-1', batsmanName: 'Rohit Sharma', bowlerId: 'aus-9', bowlerName: 'Mitchell Starc', fielderId: 'aus-2', fielderName: 'David Warner', over: '5.4', runsAtFall: 52, wicketNumber: 2 },
  { type: 'caught', batsmanId: 'ind-4', batsmanName: 'Suryakumar Yadav', bowlerId: 'aus-10', bowlerName: 'Adam Zampa', fielderId: 'aus-4', fielderName: 'Glenn Maxwell', over: '11.1', runsAtFall: 101, wicketNumber: 3 },
  { type: 'lbw', batsmanId: 'ind-5', batsmanName: 'Rishabh Pant', bowlerId: 'aus-8', bowlerName: 'Pat Cummins', over: '13.3', runsAtFall: 118, wicketNumber: 4 },
];

// Sample recent deliveries in over 17
const recentDeliveries: BallDelivery[] = [
  {
    id: 'd-103',
    inningsNumber: 2,
    overNumber: 16,
    ballInOver: 5,
    legalBall: true,
    strikerId: 'ind-3',
    strikerName: 'Virat Kohli',
    nonStrikerId: 'ind-6',
    nonStrikerName: 'Hardik Pandya',
    bowlerId: 'aus-10',
    bowlerName: 'Adam Zampa',
    strikerRuns: 1,
    extraRuns: 0,
    totalRuns: 1,
    isWicket: false,
    commentary: '16.5: Zampa to Kohli, worked softly towards mid-wicket for a sharp single.',
    timestamp: Date.now() - 120000,
    scoreAtEnd: { runs: 147, wickets: 4, oversDisplay: '16.5' },
  },
  {
    id: 'd-104',
    inningsNumber: 2,
    overNumber: 16,
    ballInOver: 6,
    legalBall: true,
    strikerId: 'ind-6',
    strikerName: 'Hardik Pandya',
    nonStrikerId: 'ind-3',
    nonStrikerName: 'Virat Kohli',
    bowlerId: 'aus-10',
    bowlerName: 'Adam Zampa',
    strikerRuns: 1,
    extraRuns: 0,
    totalRuns: 1,
    isWicket: false,
    commentary: '16.6: Zampa to Pandya, pushed down to long-on to retain the strike next over.',
    timestamp: Date.now() - 95000,
    scoreAtEnd: { runs: 148, wickets: 4, oversDisplay: '17.0' },
  },
  {
    id: 'd-105',
    inningsNumber: 2,
    overNumber: 17,
    ballInOver: 1,
    legalBall: true,
    strikerId: 'ind-3',
    strikerName: 'Virat Kohli',
    nonStrikerId: 'ind-6',
    nonStrikerName: 'Hardik Pandya',
    bowlerId: 'aus-8',
    bowlerName: 'Pat Cummins',
    strikerRuns: 2,
    extraRuns: 0,
    totalRuns: 2,
    isWicket: false,
    commentary: '17.1: Cummins to Kohli, punched into the deep cover pocket. Excellent running, they pick up two!',
    timestamp: Date.now() - 60000,
    scoreAtEnd: { runs: 150, wickets: 4, oversDisplay: '17.1' },
  },
  {
    id: 'd-106',
    inningsNumber: 2,
    overNumber: 17,
    ballInOver: 2,
    legalBall: true,
    strikerId: 'ind-3',
    strikerName: 'Virat Kohli',
    nonStrikerId: 'ind-6',
    nonStrikerName: 'Hardik Pandya',
    bowlerId: 'aus-8',
    bowlerName: 'Pat Cummins',
    strikerRuns: 4,
    extraRuns: 0,
    totalRuns: 4,
    isWicket: false,
    commentary: '17.2: Cummins to Kohli, FOUR! Glorious cricket shot! Leans into a full delivery and caresses it through extra cover!',
    timestamp: Date.now() - 40000,
    scoreAtEnd: { runs: 154, wickets: 4, oversDisplay: '17.2' },
  },
  {
    id: 'd-107',
    inningsNumber: 2,
    overNumber: 17,
    ballInOver: 3,
    legalBall: false,
    strikerId: 'ind-3',
    strikerName: 'Virat Kohli',
    nonStrikerId: 'ind-6',
    nonStrikerName: 'Hardik Pandya',
    bowlerId: 'aus-8',
    bowlerName: 'Pat Cummins',
    strikerRuns: 0,
    extraRuns: 1,
    extraType: 'wide',
    totalRuns: 1,
    isWicket: false,
    commentary: '17.2: Cummins to Kohli, WIDE! Dug in short but sails way over head height, called wide.',
    timestamp: Date.now() - 25000,
    scoreAtEnd: { runs: 155, wickets: 4, oversDisplay: '17.2' },
  },
  {
    id: 'd-108',
    inningsNumber: 2,
    overNumber: 17,
    ballInOver: 3,
    legalBall: true,
    strikerId: 'ind-3',
    strikerName: 'Virat Kohli',
    nonStrikerId: 'ind-6',
    nonStrikerName: 'Hardik Pandya',
    bowlerId: 'aus-8',
    bowlerName: 'Pat Cummins',
    strikerRuns: 1,
    extraRuns: 0,
    totalRuns: 1,
    isWicket: false,
    commentary: '17.3: Cummins to Kohli, steered to third man for an easy single.',
    timestamp: Date.now() - 10000,
    scoreAtEnd: { runs: 156, wickets: 4, oversDisplay: '17.3' },
  },
];

export const initialInnings2: Innings = {
  inningsNumber: 2,
  battingTeamId: 'team-ind',
  battingTeamName: 'India',
  bowlingTeamId: 'team-aus',
  bowlingTeamName: 'Australia',
  totalRuns: 156,
  totalWickets: 4,
  legalBalls: 105, // 17.3 overs = 17*6 + 3 = 105
  oversDisplay: '17.3',
  currentStrikerId: 'ind-6', // Pandya now on strike after single!
  currentNonStrikerId: 'ind-3', // Kohli
  currentBowlerId: 'aus-8', // Pat Cummins
  previousBowlerId: 'aus-10', // Adam Zampa
  deliveries: recentDeliveries,
  fallOfWickets: indFallOfWickets,
  partnerships: [],
  currentPartnership: {
    batsman1Id: 'ind-3',
    batsman1Name: 'Virat Kohli',
    batsman1Runs: 20,
    batsman2Id: 'ind-6',
    batsman2Name: 'Hardik Pandya',
    batsman2Runs: 18,
    totalRuns: 38,
    balls: 24,
    wicketNumber: 5,
  },
  extras: { wides: 4, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 4 },
  batsmenStats: indBatsmenStats,
  bowlersStats: ausBowlersStats,
  isCompleted: false,
};

// Clean Match Generator
export function createNewMatch(config: {
  name: string;
  venue: string;
  matchType: 'T20' | 'ODI' | 'Custom';
  totalOvers: number;
  team1Name: string;
  team1Short: string;
  team1Color: string;
  team1Players: string[];
  team2Name: string;
  team2Short: string;
  team2Color: string;
  team2Players: string[];
  tossWinner: 1 | 2;
  tossDecision: 'bat' | 'bowl';
}): Match {
  const team1: Team = {
    id: 'team-1',
    name: config.team1Name || 'Team Alpha',
    shortName: (config.team1Short || 'ALP').toUpperCase(),
    primaryColor: config.team1Color || '#0ea5e9',
    secondaryColor: '#38bdf8',
    players: config.team1Players.map((name, i) => ({
      id: `p1-${i + 1}`,
      name: name.trim() || `Player A${i + 1}`,
      shortName: name.split(' ').pop() || `A${i + 1}`,
      role: i === 0 ? 'batsman' : i < 4 ? 'batsman' : i < 6 ? 'all-rounder' : 'bowler',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
    })),
  };

  const team2: Team = {
    id: 'team-2',
    name: config.team2Name || 'Team Beta',
    shortName: (config.team2Short || 'BET').toUpperCase(),
    primaryColor: config.team2Color || '#eab308',
    secondaryColor: '#facc15',
    players: config.team2Players.map((name, i) => ({
      id: `p2-${i + 1}`,
      name: name.trim() || `Player B${i + 1}`,
      shortName: name.split(' ').pop() || `B${i + 1}`,
      role: i === 0 ? 'batsman' : i < 4 ? 'batsman' : i < 6 ? 'all-rounder' : 'bowler',
      battingStyle: 'Right-hand bat',
      bowlingStyle: 'Right-arm medium',
    })),
  };

  const tossWinnerId = config.tossWinner === 1 ? team1.id : team2.id;
  const battingFirstTeam =
    (config.tossWinner === 1 && config.tossDecision === 'bat') ||
    (config.tossWinner === 2 && config.tossDecision === 'bowl')
      ? team1
      : team2;
  const bowlingFirstTeam = battingFirstTeam.id === team1.id ? team2 : team1;

  // Initialize batsmen stats for batting first team
  const initialBatsmenStats: Record<string, BatsmanInningsStats> = {};
  battingFirstTeam.players.forEach((p, idx) => {
    initialBatsmenStats[p.id] = {
      playerId: p.id,
      playerName: p.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isBatting: idx < 2,
      isStriker: idx === 0,
      dots: 0,
      singles: 0,
      twos: 0,
      threes: 0,
    };
  });

  // Initialize bowler stats
  const initialBowlersStats: Record<string, BowlerInningsStats> = {};
  bowlingFirstTeam.players.forEach((p) => {
    initialBowlersStats[p.id] = {
      playerId: p.id,
      playerName: p.name,
      overs: '0.0',
      legalBallsBowled: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      dots: 0,
      foursConceded: 0,
      sixesConceded: 0,
      wides: 0,
      noBalls: 0,
    };
  });

  const strikerId = battingFirstTeam.players[0]?.id || 'p1-1';
  const nonStrikerId = battingFirstTeam.players[1]?.id || 'p1-2';
  const openingBowlerId = bowlingFirstTeam.players[bowlingFirstTeam.players.length - 1]?.id || 'p2-11';

  const innings1: Innings = {
    inningsNumber: 1,
    battingTeamId: battingFirstTeam.id,
    battingTeamName: battingFirstTeam.name,
    bowlingTeamId: bowlingFirstTeam.id,
    bowlingTeamName: bowlingFirstTeam.name,
    totalRuns: 0,
    totalWickets: 0,
    legalBalls: 0,
    oversDisplay: '0.0',
    currentStrikerId: strikerId,
    currentNonStrikerId: nonStrikerId,
    currentBowlerId: openingBowlerId,
    deliveries: [],
    fallOfWickets: [],
    partnerships: [],
    currentPartnership: {
      batsman1Id: strikerId,
      batsman1Name: battingFirstTeam.players[0]?.name || 'Opener 1',
      batsman1Runs: 0,
      batsman2Id: nonStrikerId,
      batsman2Name: battingFirstTeam.players[1]?.name || 'Opener 2',
      batsman2Runs: 0,
      totalRuns: 0,
      balls: 0,
      wicketNumber: 1,
    },
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 },
    batsmenStats: initialBatsmenStats,
    bowlersStats: initialBowlersStats,
    isCompleted: false,
  };

  // Blank innings 2
  const innings2: Innings = {
    inningsNumber: 2,
    battingTeamId: bowlingFirstTeam.id,
    battingTeamName: bowlingFirstTeam.name,
    bowlingTeamId: battingFirstTeam.id,
    bowlingTeamName: battingFirstTeam.name,
    totalRuns: 0,
    totalWickets: 0,
    legalBalls: 0,
    oversDisplay: '0.0',
    currentStrikerId: bowlingFirstTeam.players[0]?.id || 'p2-1',
    currentNonStrikerId: bowlingFirstTeam.players[1]?.id || 'p2-2',
    currentBowlerId: battingFirstTeam.players[battingFirstTeam.players.length - 1]?.id || 'p1-11',
    deliveries: [],
    fallOfWickets: [],
    partnerships: [],
    currentPartnership: {
      batsman1Id: bowlingFirstTeam.players[0]?.id || 'p2-1',
      batsman1Name: bowlingFirstTeam.players[0]?.name || 'Opener 1',
      batsman1Runs: 0,
      batsman2Id: bowlingFirstTeam.players[1]?.id || 'p2-2',
      batsman2Name: bowlingFirstTeam.players[1]?.name || 'Opener 2',
      batsman2Runs: 0,
      totalRuns: 0,
      balls: 0,
      wicketNumber: 1,
    },
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0, total: 0 },
    batsmenStats: {},
    bowlersStats: {},
    isCompleted: false,
  };

  return {
    id: `match-${Date.now()}`,
    name: config.name || 'Custom Match',
    venue: config.venue || 'Club Ground',
    matchType: config.matchType || 'T20',
    totalOvers: config.totalOvers || 20,
    team1,
    team2,
    tossWinnerId,
    tossDecision: config.tossDecision,
    currentInningsIndex: 0,
    innings: [innings1, innings2],
    status: 'live',
    resultSummary: `${battingFirstTeam.name} are batting first.`,
  };
}

export const defaultMatch: Match = createNewMatch({
  name: 'SSL Premier League',
  venue: 'Galungara Park',
  matchType: 'T20',
  totalOvers: 20,
  team1Name: 'Sydney Sharks',
  team1Short: 'SHK',
  team1Color: '#0284c7',
  team1Players: [
    'David Warner',
    'Steve Smith',
    'Mitchell Marsh',
    'Glenn Maxwell',
    'Marcus Stoinis',
    'Matthew Wade',
    'Pat Cummins',
    'Mitchell Starc',
    'Sean Abbott',
    'Adam Zampa',
    'Josh Hazlewood',
  ],
  team2Name: 'Lankan Lions',
  team2Short: 'LIO',
  team2Color: '#eab308',
  team2Players: [
    'Pathum Nissanka',
    'Kusal Mendis',
    'Charith Asalanka',
    'Sadeera Samarawickrama',
    'Bhanuka Rajapaksa',
    'Wanindu Hasaranga',
    'Dasun Shanaka',
    'Chamika Karunaratne',
    'Maheesh Theekshana',
    'Matheesha Pathirana',
    'Dilshan Madushanka',
  ],
  tossWinner: 1,
  tossDecision: 'bat',
});
