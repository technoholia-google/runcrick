import {
  Match,
  Innings,
  BallDelivery,
  DismissalType,
  DismissalInfo,
  ExtraType,
  PlayerMatchAggregate,
  BatsmanInningsStats,
  BowlerInningsStats,
} from '../types/cricket';

// Format legal balls into cricket overs display (e.g. 105 balls -> "17.3")
export function formatOvers(legalBalls: number): string {
  const completeOvers = Math.floor(legalBalls / 6);
  const ballsInCurrentOver = legalBalls % 6;
  return `${completeOvers}.${ballsInCurrentOver}`;
}

export function calculateEconomy(runsConceded: number, legalBalls: number): number {
  if (legalBalls === 0) return 0;
  const overs = legalBalls / 6;
  return Number((runsConceded / overs).toFixed(2));
}

export function calculateStrikeRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return Number(((runs / balls) * 100).toFixed(1));
}

// Generate exciting, context-aware commentary
function generateBallCommentary(
  bowlerName: string,
  strikerName: string,
  strikerRuns: number,
  extraType?: ExtraType,
  extraRuns?: number,
  isWicket?: boolean,
  wicketInfo?: DismissalInfo
): string {
  const bowlerSurname = bowlerName.split(' ').pop() || bowlerName;
  const strikerSurname = strikerName.split(' ').pop() || strikerName;

  if (isWicket && wicketInfo) {
    switch (wicketInfo.type) {
      case 'bowled':
        return `${bowlerSurname} to ${strikerSurname}, OUT! TIMBER! Clean bowled through the gate! Absolute beauty that dismantles the stumps!`;
      case 'caught':
        return `${bowlerSurname} to ${strikerSurname}, OUT! CAUGHT! Spliced high in the air, ${wicketInfo.fielderName || 'the fielder'} settles underneath and holds on comfortably!`;
      case 'lbw':
        return `${bowlerSurname} to ${strikerSurname}, OUT! LBW! Trapped right in front of middle and leg. Finger goes up straight away!`;
      case 'run-out':
        return `Disaster in the middle! Sprinted for the run but ${wicketInfo.fielderName || 'the fielder'} scores a direct hit! ${wicketInfo.batsmanName} is well short!`;
      case 'stumped':
        return `${bowlerSurname} to ${strikerSurname}, OUT! STUMPED! Dragged out of crease by the flight and turn, keeper whips off the bails in a flash!`;
      case 'caught-bowled':
        return `${bowlerSurname} to ${strikerSurname}, OUT! CAUGHT & BOWLED! Smashed back down the ground and ${bowlerSurname} sticks out a hand to take a sensational reflex catch!`;
      default:
        return `${bowlerSurname} to ${strikerSurname}, OUT! Wicket falls!`;
    }
  }

  if (extraType === 'wide') {
    return `${bowlerSurname} to ${strikerSurname}, WIDE! Sprayed way down the leg side, umpire stretches arms.`;
  }
  if (extraType === 'no-ball') {
    return `${bowlerSurname} to ${strikerSurname}, NO BALL! Overstepped by inches. Free hit upcoming!`;
  }
  if (extraType === 'bye' || extraType === 'leg-bye') {
    return `${bowlerSurname} to ${strikerSurname}, ${extraRuns} ${extraType}(s) signaled as the ball races past the pads.`;
  }

  switch (strikerRuns) {
    case 6:
      return `${bowlerSurname} to ${strikerSurname}, SIX! MASSIVE! Launched into the upper deck with enormous power! What a cracking shot!`;
    case 4:
      return `${bowlerSurname} to ${strikerSurname}, FOUR! Sweetly timed! Pierces the gap with surgical precision, racing away across the turf!`;
    case 3:
      return `${bowlerSurname} to ${strikerSurname}, punched into the deep pocket, superb running between the wickets turns two into three!`;
    case 2:
      return `${bowlerSurname} to ${strikerSurname}, worked nicely with soft hands into the outfield, pushed hard and completed two runs comfortably.`;
    case 1:
      return `${bowlerSurname} to ${strikerSurname}, pushed into the gap for a brisk single, rotating the strike.`;
    case 0:
    default:
      return `${bowlerSurname} to ${strikerSurname}, no run. Solid defensive push back to the bowler.`;
  }
}

export interface RecordDeliveryParams {
  strikerRuns: number;
  extraType?: ExtraType;
  extraRuns?: number;
  isWicket?: boolean;
  wicketType?: DismissalType;
  outBatsmanId?: string; // striker or non-striker
  fielderId?: string;
  fielderName?: string;
  nextBatsmanId?: string; // new batsman coming to the crease
}

export function recordDelivery(match: Match, params: RecordDeliveryParams): Match {
  // Deep copy match to maintain immutability and undo capability
  const newMatch: Match = JSON.parse(JSON.stringify(match));
  const innings = newMatch.innings[newMatch.currentInningsIndex];

  const striker = innings.batsmenStats[innings.currentStrikerId];
  const nonStriker = innings.batsmenStats[innings.currentNonStrikerId];
  const bowler = innings.bowlersStats[innings.currentBowlerId];

  if (!striker || !nonStriker || !bowler) {
    return match;
  }

  const isLegalBall = params.extraType !== 'wide' && params.extraType !== 'no-ball';
  const strikerRuns = params.strikerRuns || 0;
  const extraRuns = (params.extraType ? (params.extraRuns ?? 1) : 0);
  const totalBallRuns = strikerRuns + extraRuns;

  // Track over details
  const currentOverIndex = Math.floor(innings.legalBalls / 6);
  const ballInOver = (innings.legalBalls % 6) + (isLegalBall ? 1 : 0);

  // Extras update
  if (params.extraType === 'wide') {
    innings.extras.wides += extraRuns;
    innings.extras.total += extraRuns;
    bowler.wides += extraRuns;
    bowler.runsConceded += extraRuns;
  } else if (params.extraType === 'no-ball') {
    innings.extras.noBalls += extraRuns;
    innings.extras.total += extraRuns;
    bowler.noBalls += extraRuns;
    bowler.runsConceded += extraRuns;
  } else if (params.extraType === 'bye') {
    innings.extras.byes += extraRuns;
    innings.extras.total += extraRuns;
    // Byes do not count against bowler's runs conceded!
  } else if (params.extraType === 'leg-bye') {
    innings.extras.legByes += extraRuns;
    innings.extras.total += extraRuns;
    // Leg byes do not count against bowler!
  } else if (params.extraType === 'penalty') {
    innings.extras.penalties += extraRuns;
    innings.extras.total += extraRuns;
  }

  // Update total runs
  innings.totalRuns += totalBallRuns;

  // Update Batsman stats (only batsman runs, not byes/leg-byes/wides)
  if (params.extraType !== 'wide') {
    striker.balls += 1;
  }
  striker.runs += strikerRuns;
  if (strikerRuns === 4) striker.fours += 1;
  if (strikerRuns === 6) striker.sixes += 1;
  if (strikerRuns === 0 && !params.extraType) striker.dots += 1;
  if (strikerRuns === 1) striker.singles += 1;
  if (strikerRuns === 2) striker.twos += 1;
  if (strikerRuns === 3) striker.threes += 1;
  striker.strikeRate = calculateStrikeRate(striker.runs, striker.balls);

  // Update Bowler stats
  if (isLegalBall) {
    innings.legalBalls += 1;
    bowler.legalBallsBowled += 1;
    if (totalBallRuns === 0) {
      bowler.dots += 1;
    }
  }

  // Bowler runs conceded (striker runs + wides + no balls)
  if (params.extraType !== 'bye' && params.extraType !== 'leg-bye' && params.extraType !== 'penalty') {
    bowler.runsConceded += strikerRuns;
    if (strikerRuns === 4) bowler.foursConceded += 1;
    if (strikerRuns === 6) bowler.sixesConceded += 1;
  }

  bowler.overs = formatOvers(bowler.legalBallsBowled);
  bowler.economy = calculateEconomy(bowler.runsConceded, bowler.legalBallsBowled);
  innings.oversDisplay = formatOvers(innings.legalBalls);

  // Wicket handling
  let wicketInfo: DismissalInfo | undefined = undefined;
  if (params.isWicket && params.wicketType) {
    const outBatsmanId = params.outBatsmanId || striker.playerId;
    const outBatsman = innings.batsmenStats[outBatsmanId] || striker;

    innings.totalWickets += 1;
    outBatsman.isOut = true;
    outBatsman.isBatting = false;

    // Bowler credited wicket if not run-out or retired-hurt
    const bowlerCredited = params.wicketType !== 'run-out' && params.wicketType !== 'retired-hurt';
    if (bowlerCredited) {
      bowler.wickets += 1;
    }

    // Dismissal summary text
    let dismissalText = '';
    const bowlerSurname = bowler.playerName.split(' ').pop();
    if (params.wicketType === 'bowled') {
      dismissalText = `b ${bowlerSurname}`;
    } else if (params.wicketType === 'caught') {
      dismissalText = `c ${params.fielderName || 'Sub'} b ${bowlerSurname}`;
    } else if (params.wicketType === 'lbw') {
      dismissalText = `lbw b ${bowlerSurname}`;
    } else if (params.wicketType === 'run-out') {
      dismissalText = `run out (${params.fielderName || 'Fielder'})`;
    } else if (params.wicketType === 'stumped') {
      dismissalText = `st ${params.fielderName || 'Keeper'} b ${bowlerSurname}`;
    } else if (params.wicketType === 'caught-bowled') {
      dismissalText = `c & b ${bowlerSurname}`;
    } else if (params.wicketType === 'hit-wicket') {
      dismissalText = `hit wicket b ${bowlerSurname}`;
    } else {
      dismissalText = 'retired hurt';
    }
    outBatsman.dismissalText = dismissalText;

    wicketInfo = {
      type: params.wicketType,
      batsmanId: outBatsman.playerId,
      batsmanName: outBatsman.playerName,
      bowlerId: bowlerCredited ? bowler.playerId : undefined,
      bowlerName: bowlerCredited ? bowler.playerName : undefined,
      fielderId: params.fielderId,
      fielderName: params.fielderName,
      over: innings.oversDisplay,
      runsAtFall: innings.totalRuns,
      wicketNumber: innings.totalWickets,
    };
    innings.fallOfWickets.push(wicketInfo);

    // If next batsman selected, set them on the pitch
    if (params.nextBatsmanId && innings.batsmenStats[params.nextBatsmanId]) {
      const incoming = innings.batsmenStats[params.nextBatsmanId];
      incoming.isBatting = true;
      incoming.isOut = false;
      if (outBatsmanId === striker.playerId) {
        innings.currentStrikerId = incoming.playerId;
        incoming.isStriker = true;
      } else {
        innings.currentNonStrikerId = incoming.playerId;
        incoming.isStriker = false;
      }
    }
  }

  // Generate commentary
  const commentary = generateBallCommentary(
    bowler.playerName,
    striker.playerName,
    strikerRuns,
    params.extraType,
    extraRuns,
    params.isWicket,
    wicketInfo
  );

  // Delivery record
  const delivery: BallDelivery = {
    id: `del-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    inningsNumber: innings.inningsNumber,
    overNumber: currentOverIndex,
    ballInOver,
    legalBall: isLegalBall,
    strikerId: striker.playerId,
    strikerName: striker.playerName,
    nonStrikerId: nonStriker.playerId,
    nonStrikerName: nonStriker.playerName,
    bowlerId: bowler.playerId,
    bowlerName: bowler.playerName,
    strikerRuns,
    extraRuns,
    extraType: params.extraType,
    totalRuns: totalBallRuns,
    isWicket: !!params.isWicket,
    wicketInfo,
    commentary,
    timestamp: Date.now(),
    scoreAtEnd: {
      runs: innings.totalRuns,
      wickets: innings.totalWickets,
      oversDisplay: innings.oversDisplay,
    },
  };

  innings.deliveries.push(delivery);

  // Current partnership update
  innings.currentPartnership.totalRuns += totalBallRuns;
  if (isLegalBall) {
    innings.currentPartnership.balls += 1;
  }
  if (striker.playerId === innings.currentPartnership.batsman1Id) {
    innings.currentPartnership.batsman1Runs += strikerRuns;
  } else {
    innings.currentPartnership.batsman2Runs += strikerRuns;
  }

  // Strike rotation logic:
  // 1. Odd runs scored on this delivery swap strike
  let shouldSwapStrike = (strikerRuns % 2 === 1) || (params.extraType === 'bye' && extraRuns % 2 === 1) || (params.extraType === 'leg-bye' && extraRuns % 2 === 1);

  // 2. End of over check: 6 legal balls in current over
  const isOverComplete = isLegalBall && (innings.legalBalls % 6 === 0);
  if (isOverComplete) {
    // End of over swaps strike (bowler change at opposite end)
    shouldSwapStrike = !shouldSwapStrike;
    innings.previousBowlerId = innings.currentBowlerId;
  }

  if (shouldSwapStrike && !params.isWicket) {
    const temp = innings.currentStrikerId;
    innings.currentStrikerId = innings.currentNonStrikerId;
    innings.currentNonStrikerId = temp;
    if (innings.batsmenStats[innings.currentStrikerId]) {
      innings.batsmenStats[innings.currentStrikerId].isStriker = true;
    }
    if (innings.batsmenStats[innings.currentNonStrikerId]) {
      innings.batsmenStats[innings.currentNonStrikerId].isStriker = false;
    }
  }

  // Check match conclusion / target chase in 2nd innings
  const maxBalls = newMatch.totalOvers * 6;
  if (newMatch.currentInningsIndex === 1 && newMatch.target) {
    if (innings.totalRuns >= newMatch.target) {
      innings.isCompleted = true;
      newMatch.status = 'completed';
      const remainingWickets = 10 - innings.totalWickets;
      newMatch.resultSummary = `${innings.battingTeamName} won by ${remainingWickets} wicket${remainingWickets > 1 ? 's' : ''}!`;
    } else if (innings.totalWickets >= 10 || innings.legalBalls >= maxBalls) {
      innings.isCompleted = true;
      newMatch.status = 'completed';
      const runsDiff = (newMatch.target - 1) - innings.totalRuns;
      if (runsDiff === 0) {
        newMatch.resultSummary = 'Match Tied! Thrilling finish!';
      } else {
        newMatch.resultSummary = `${innings.bowlingTeamName} won by ${runsDiff} run${runsDiff > 1 ? 's' : ''}!`;
      }
    }
  } else if (newMatch.currentInningsIndex === 0) {
    // 1st innings completion check
    if (innings.totalWickets >= 10 || innings.legalBalls >= maxBalls) {
      innings.isCompleted = true;
      newMatch.target = innings.totalRuns + 1;
      newMatch.resultSummary = `Target: ${newMatch.target} runs required from ${newMatch.totalOvers} overs.`;
    }
  }

  return newMatch;
}

// Switch Strike manually
export function swapStrike(match: Match): Match {
  const newMatch: Match = JSON.parse(JSON.stringify(match));
  const innings = newMatch.innings[newMatch.currentInningsIndex];
  const temp = innings.currentStrikerId;
  innings.currentStrikerId = innings.currentNonStrikerId;
  innings.currentNonStrikerId = temp;
  if (innings.batsmenStats[innings.currentStrikerId]) {
    innings.batsmenStats[innings.currentStrikerId].isStriker = true;
  }
  if (innings.batsmenStats[innings.currentNonStrikerId]) {
    innings.batsmenStats[innings.currentNonStrikerId].isStriker = false;
  }
  return newMatch;
}

// Change Active Bowler
export function changeBowler(match: Match, newBowlerId: string): Match {
  const newMatch: Match = JSON.parse(JSON.stringify(match));
  const innings = newMatch.innings[newMatch.currentInningsIndex];
  innings.previousBowlerId = innings.currentBowlerId;
  innings.currentBowlerId = newBowlerId;

  // Initialize bowler stats if not present
  if (!innings.bowlersStats[newBowlerId]) {
    const bowlingTeam = newMatch.team1.id === innings.bowlingTeamId ? newMatch.team1 : newMatch.team2;
    const player = bowlingTeam.players.find((p) => p.id === newBowlerId);
    if (player) {
      innings.bowlersStats[newBowlerId] = {
        playerId: player.id,
        playerName: player.name,
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
    }
  }
  return newMatch;
}

// Start 2nd Innings
export function startSecondInnings(match: Match): Match {
  const newMatch: Match = JSON.parse(JSON.stringify(match));
  if (newMatch.currentInningsIndex === 1) return match;

  newMatch.innings[0].isCompleted = true;
  newMatch.target = newMatch.innings[0].totalRuns + 1;
  newMatch.currentInningsIndex = 1;
  newMatch.status = 'live';

  const inn2 = newMatch.innings[1];
  const battingTeam = newMatch.team1.id === inn2.battingTeamId ? newMatch.team1 : newMatch.team2;
  const bowlingTeam = battingTeam.id === newMatch.team1.id ? newMatch.team2 : newMatch.team1;

  // Initialize batting stats
  if (Object.keys(inn2.batsmenStats).length === 0) {
    battingTeam.players.forEach((p, idx) => {
      inn2.batsmenStats[p.id] = {
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
    inn2.currentStrikerId = battingTeam.players[0].id;
    inn2.currentNonStrikerId = battingTeam.players[1].id;
  }

  // Initialize bowling stats
  if (Object.keys(inn2.bowlersStats).length === 0) {
    bowlingTeam.players.forEach((p) => {
      inn2.bowlersStats[p.id] = {
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
    inn2.currentBowlerId = bowlingTeam.players[bowlingTeam.players.length - 1].id;
  }

  newMatch.resultSummary = `Innings 2 underway! Target: ${newMatch.target} runs.`;
  return newMatch;
}

// Calculate Player Match aggregates and MVP points
export function calculatePlayerAggregates(match: Match): PlayerMatchAggregate[] {
  const allPlayers: PlayerMatchAggregate[] = [];
  const teams = [match.team1, match.team2];

  teams.forEach((team) => {
    team.players.forEach((player) => {
      // Find batting stats in either innings
      let battingStats: BatsmanInningsStats | undefined = undefined;
      for (const inn of match.innings) {
        if (inn.batsmenStats[player.id]) {
          battingStats = inn.batsmenStats[player.id];
          break;
        }
      }

      // Find bowling stats
      let bowlingStats: BowlerInningsStats | undefined = undefined;
      for (const inn of match.innings) {
        if (inn.bowlersStats[player.id]) {
          bowlingStats = inn.bowlersStats[player.id];
          break;
        }
      }

      // Fielding dismissals
      let catches = 0;
      let runOuts = 0;
      for (const inn of match.innings) {
        inn.fallOfWickets.forEach((fow) => {
          if (fow.fielderId === player.id) {
            if (fow.type === 'caught' || fow.type === 'caught-bowled') catches += 1;
            if (fow.type === 'run-out') runOuts += 1;
          }
        });
      }

      // Calculate MVP Impact score
      let mvp = 0;
      if (battingStats) {
        mvp += battingStats.runs * 1;
        mvp += battingStats.fours * 1;
        mvp += battingStats.sixes * 2.5;
        if (battingStats.balls >= 10 && battingStats.strikeRate > 150) mvp += 8;
        if (battingStats.runs >= 50) mvp += 15;
        if (battingStats.runs >= 100) mvp += 30;
      }
      if (bowlingStats) {
        mvp += bowlingStats.wickets * 25;
        mvp += bowlingStats.maidens * 12;
        mvp += bowlingStats.dots * 0.8;
        if (bowlingStats.legalBallsBowled >= 12 && bowlingStats.economy < 6.5) mvp += 10;
        if (bowlingStats.wickets >= 3) mvp += 15;
      }
      mvp += catches * 10;
      mvp += runOuts * 15;

      allPlayers.push({
        player,
        teamName: team.name,
        teamShortName: team.shortName,
        batting: battingStats,
        bowling: bowlingStats,
        catches,
        runOuts,
        mvpPoints: Math.round(mvp),
      });
    });
  });

  return allPlayers.sort((a, b) => b.mvpPoints - a.mvpPoints);
}
