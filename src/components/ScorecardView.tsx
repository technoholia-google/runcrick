import React, { useState } from 'react';
import { Match, Innings } from '../types/cricket';
import { calculateEconomy, calculateStrikeRate } from '../utils/cricketEngine';
import { Download } from 'lucide-react';

interface ScorecardViewProps {
  match: Match;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ match }) => {
  const [selectedInningsIdx, setSelectedInningsIdx] = useState<number>(match.currentInningsIndex);

  const innings: Innings = match.innings[selectedInningsIdx];
  const battingTeam = match.team1.id === innings.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === innings.bowlingTeamId ? match.team1 : match.team2;

  // Batsmen list
  const batsmenList = battingTeam.players.map((p) => {
    const stats = innings.batsmenStats[p.id];
    return {
      player: p,
      stats,
    };
  });

  const battedPlayers = batsmenList.filter((b) => b.stats && (b.stats.balls > 0 || b.stats.isOut || b.stats.isBatting));
  const yetToBatPlayers = batsmenList.filter((b) => !b.stats || (!b.stats.balls && !b.stats.isOut && !b.stats.isBatting));

  // Bowlers list
  const bowlersList = Object.values(innings.bowlersStats).filter(
    (b) => b.legalBallsBowled > 0 || b.runsConceded > 0 || b.wides > 0 || b.noBalls > 0
  );

  const oversFloat = innings.legalBalls / 6;
  const crr = oversFloat > 0 ? (innings.totalRuns / oversFloat).toFixed(2) : '0.00';

  const exportScorecardJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(match, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${match.name.replace(/\s+/g, '_')}_Scorecard.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Innings Tabs & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1a2e] border border-[#1a365d] p-4 rounded-2xl shadow-xl">
        {/* Innings selector buttons (functional segmented control in Sri Lanka Gold) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 p-1 bg-[#071322] rounded-xl border border-[#142c4c] w-full sm:w-auto">
          <button
            onClick={() => setSelectedInningsIdx(0)}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all text-center min-h-[40px] ${
              selectedInningsIdx === 0
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1st Innings: {match.innings[0].battingTeamName} ({match.innings[0].totalRuns}/{match.innings[0].totalWickets})
          </button>
          <button
            onClick={() => setSelectedInningsIdx(1)}
            className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all text-center min-h-[40px] ${
              selectedInningsIdx === 1
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2nd Innings: {match.innings[1].battingTeamName} ({match.innings[1].totalRuns}/{match.innings[1].totalWickets})
          </button>
        </div>

        <button
          onClick={exportScorecardJSON}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#10253f] hover:bg-[#163357] rounded-xl border border-[#1a365d] transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Scorecard (JSON)</span>
        </button>
      </div>

      {/* Innings Overview Banner */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Innings {innings.inningsNumber} Summary</div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {innings.battingTeamName} Innings
          </div>
        </div>

        <div className="flex items-baseline gap-4">
          <div className="text-right">
            <span className="font-scoreboard text-4xl sm:text-5xl font-extrabold text-white font-mono-num">
              {innings.totalRuns}/{innings.totalWickets}
            </span>
            <span className="text-sm text-slate-400 font-mono-num ml-2">
              ({innings.oversDisplay} ov)
            </span>
          </div>
          <div className="text-xs text-slate-400 border-l border-[#142c4c] pl-4 py-1">
            <div>CRR: <span className="font-mono-num font-semibold text-slate-200">{crr}</span></div>
            {match.target && selectedInningsIdx === 1 && (
              <div>Target: <span className="font-mono-num font-bold text-amber-400">{match.target}</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Batting Scorecard Table */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#071322] border-b border-[#142c4c] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Batting Scorecard
          </h3>
          <span className="text-xs font-semibold text-amber-400">
            {innings.battingTeamName}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#142c4c] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#071322]/60">
                <th className="py-3 px-4 sm:px-6">Batter</th>
                <th className="py-3 px-4">Dismissal</th>
                <th className="py-3 px-3 text-right">R</th>
                <th className="py-3 px-3 text-right">B</th>
                <th className="py-3 px-3 text-right">4s</th>
                <th className="py-3 px-3 text-right">6s</th>
                <th className="py-3 px-4 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142c4c]/60 font-mono-num">
              {battedPlayers.map(({ player, stats }) => {
                if (!stats) return null;
                const isCurrent = stats.isBatting && !stats.isOut;
                return (
                  <tr
                    key={player.id}
                    className={`hover:bg-[#10253f]/40 transition-colors ${
                      isCurrent ? 'bg-amber-400/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-sans">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isCurrent && <span className="text-amber-400 font-bold">*</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-num">
                        {player.role}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-400">
                      {stats.isOut ? (
                        stats.dismissalText || 'out'
                      ) : (
                        <span className="text-amber-400 font-medium">not out</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-white text-base">
                      {stats.runs}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {stats.balls}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {stats.fours}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {stats.sixes}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-amber-400">
                      {calculateStrikeRate(stats.runs, stats.balls)}
                    </td>
                  </tr>
                );
              })}

              {/* Extras Row */}
              <tr className="bg-[#071322]/80 text-xs">
                <td colSpan={2} className="py-3 px-4 sm:px-6 font-sans font-medium text-slate-300">
                  Extras
                </td>
                <td colSpan={5} className="py-3 px-4 text-right text-slate-300">
                  <span className="font-bold text-amber-400 text-sm">{innings.extras.total}</span>{' '}
                  <span className="text-slate-400 font-sans">
                    (b {innings.extras.byes}, lb {innings.extras.legByes}, w {innings.extras.wides}, nb {innings.extras.noBalls}, pen {innings.extras.penalties})
                  </span>
                </td>
              </tr>

              {/* Total Row */}
              <tr className="bg-[#071322] font-bold text-white border-t border-[#1a365d]">
                <td colSpan={2} className="py-3 px-4 sm:px-6 font-sans">
                  Total
                </td>
                <td colSpan={5} className="py-3 px-4 text-right">
                  <span className="text-lg text-amber-400 font-scoreboard font-mono-num">{innings.totalRuns}/{innings.totalWickets}</span>{' '}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-2">
                    ({innings.oversDisplay} Overs, RR: {crr})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Did Not Bat List */}
        {yetToBatPlayers.length > 0 && (
          <div className="px-5 py-3 border-t border-[#142c4c] bg-[#071322]/40 text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-300">Yet to Bat:</span>
            <span>
              {yetToBatPlayers.map((p) => p.player.name).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Fall of Wickets Timeline */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl p-5 shadow-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
          Fall of Wickets
        </h3>
        {innings.fallOfWickets.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No wickets have fallen yet in this innings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {innings.fallOfWickets.map((fow) => (
              <div
                key={fow.wicketNumber}
                className="bg-[#071322] border border-[#142c4c] rounded-xl p-3 flex items-start gap-3 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-scoreboard font-bold text-rose-400 text-sm shrink-0">
                  {fow.wicketNumber}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate font-mono-num">
                    {fow.runsAtFall}/{fow.wicketNumber}
                  </div>
                  <div className="text-xs text-slate-300 truncate">
                    {fow.batsmanName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-num">
                    Over {fow.over}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bowling Scorecard Table */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#071322] border-b border-[#142c4c] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Bowling Scorecard
          </h3>
          <span className="text-xs font-semibold text-blue-400">
            {bowlingTeam.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#142c4c] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#071322]/60">
                <th className="py-3 px-4 sm:px-6">Bowler</th>
                <th className="py-3 px-3 text-right">O</th>
                <th className="py-3 px-3 text-right">M</th>
                <th className="py-3 px-3 text-right">R</th>
                <th className="py-3 px-3 text-right">W</th>
                <th className="py-3 px-4 text-right">Econ</th>
                <th className="py-3 px-3 text-right">Dots</th>
                <th className="py-3 px-3 text-right">WD</th>
                <th className="py-3 px-3 text-right">NB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142c4c]/60 font-mono-num">
              {bowlersList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-slate-500 italic font-sans text-xs">
                    No bowling data recorded for this innings yet.
                  </td>
                </tr>
              ) : (
                bowlersList.map((bowler) => (
                  <tr key={bowler.playerId} className="hover:bg-[#10253f]/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-white">
                      {bowler.playerName}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-200">
                      {bowler.overs}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      {bowler.maidens}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-200">
                      {bowler.runsConceded}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-amber-400 text-base">
                      {bowler.wickets}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-amber-300">
                      {calculateEconomy(bowler.runsConceded, bowler.legalBallsBowled)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      {bowler.dots}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      {bowler.wides}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      {bowler.noBalls}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
