import React, { useState } from 'react';
import { Match, PlayerMatchAggregate } from '../types/cricket';
import { calculatePlayerAggregates, calculateStrikeRate, calculateEconomy } from '../utils/cricketEngine';
import { Trophy, Flame, Target, Shield, Award, X, Sparkles, ChevronRight } from 'lucide-react';

interface PlayerStatsViewProps {
  match: Match;
}

export const PlayerStatsView: React.FC<PlayerStatsViewProps> = ({ match }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerMatchAggregate | null>(null);
  const [activeTab, setActiveTab] = useState<'mvp' | 'batting' | 'bowling'>('mvp');

  const aggregates = calculatePlayerAggregates(match);

  // Batters with at least 1 ball faced or 1 run
  const topBatters = [...aggregates]
    .filter((a) => a.batting && (a.batting.balls > 0 || a.batting.runs > 0))
    .sort((a, b) => (b.batting?.runs || 0) - (a.batting?.runs || 0));

  // Bowlers with at least 1 legal ball
  const topBowlers = [...aggregates]
    .filter((a) => a.bowling && a.bowling.legalBallsBowled > 0)
    .sort((a, b) => {
      const wDiff = (b.bowling?.wickets || 0) - (a.bowling?.wickets || 0);
      if (wDiff !== 0) return wDiff;
      return (a.bowling?.economy || 99) - (b.bowling?.economy || 99);
    });

  const mvpLeader = aggregates[0];

  return (
    <div className="space-y-6">
      {/* MVP Feature Hero Card */}
      {mvpLeader && (
        <div className="bg-gradient-to-r from-[#0b1a2e] via-[#0e223d] to-[#122a4a] border border-amber-400/35 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Player of the Match Contender</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {mvpLeader.player.name}
              </h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{mvpLeader.teamName}</span>
                <span aria-hidden="true">·</span>
                <span>{mvpLeader.player.role}</span>
              </div>
            </div>

            {/* Impact Metric Stats */}
            <div className="flex items-center gap-4 bg-[#071322]/80 border border-amber-400/30 px-5 py-3 rounded-xl shadow-inner">
              <div className="text-center">
                <div className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">
                  MVP Impact
                </div>
                <div className="font-scoreboard text-3xl font-extrabold text-amber-400 font-mono-num">
                  {mvpLeader.mvpPoints}
                </div>
              </div>

              <div className="h-8 w-px bg-[#1a365d]" />

              <div className="text-xs space-y-0.5 text-slate-300">
                {mvpLeader.batting && mvpLeader.batting.balls > 0 && (
                  <div>
                    Bat: <span className="font-bold text-white font-mono-num">{mvpLeader.batting.runs}</span> ({mvpLeader.batting.balls}b, {mvpLeader.batting.fours}x4, {mvpLeader.batting.sixes}x6)
                  </div>
                )}
                {mvpLeader.bowling && mvpLeader.bowling.legalBallsBowled > 0 && (
                  <div>
                    Bowl: <span className="font-bold text-white font-mono-num">{mvpLeader.bowling.wickets}/{mvpLeader.bowling.runsConceded}</span> ({mvpLeader.bowling.overs} ov)
                  </div>
                )}
                {mvpLeader.catches > 0 && (
                  <div>
                    Field: <span className="font-bold text-white">{mvpLeader.catches} catch{mvpLeader.catches > 1 ? 'es' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Segmented Tab Navigation for Statistics */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 bg-[#0b1a2e] border border-[#1a365d] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-lg">
        <button
          onClick={() => setActiveTab('mvp')}
          className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs font-bold rounded-lg sm:rounded-xl transition-all text-center min-h-[38px] ${
            activeTab === 'mvp'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-[#10253f]'
          }`}
        >
          MVP Rankings
        </button>
        <button
          onClick={() => setActiveTab('batting')}
          className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs font-bold rounded-lg sm:rounded-xl transition-all text-center min-h-[38px] ${
            activeTab === 'batting'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-[#10253f]'
          }`}
        >
          Batting Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('bowling')}
          className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs font-bold rounded-lg sm:rounded-xl transition-all text-center min-h-[38px] ${
            activeTab === 'bowling'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-[#10253f]'
          }`}
        >
          Bowling Figures
        </button>
      </div>

      {/* Tab 1: MVP Leaderboard */}
      {activeTab === 'mvp' && (
        <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-[#071322] border-b border-[#142c4c] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Match MVP & Impact Leaderboard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite rating calculated from runs, strike rates, wickets, economy, and fielding.
              </p>
            </div>
            <span className="text-xs text-amber-400">
              Click any player for detailed analytics
            </span>
          </div>

          <div className="divide-y divide-[#142c4c]/80">
            {aggregates.slice(0, 10).map((item, idx) => (
              <div
                key={item.player.id}
                onClick={() => setSelectedPlayer(item)}
                className="p-4 hover:bg-[#10253f]/40 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-scoreboard text-sm ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                        : idx === 1
                        ? 'bg-blue-500 text-white font-bold'
                        : idx === 2
                        ? 'bg-[#1a3b63] text-amber-300 font-bold border border-amber-400/30'
                        : 'bg-[#071322] text-slate-400 border border-[#142c4c]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{item.player.name}</span>
                      <span className="text-xs font-normal text-amber-400/90 font-mono-num">
                        ({item.teamShortName})
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{item.player.role}</span>
                      {item.batting && item.batting.balls > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-slate-300">{item.batting.runs} runs ({item.batting.balls}b)</span>
                        </>
                      )}
                      {item.bowling && item.bowling.legalBallsBowled > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-slate-300">{item.bowling.wickets} wkt ({item.bowling.runsConceded}r)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-scoreboard text-xl font-extrabold text-amber-400 font-mono-num">
                      {item.mvpPoints} pts
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Impact Score
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Batting Leaderboard */}
      {activeTab === 'batting' && (
        <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-[#071322] border-b border-[#142c4c]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Batting Leaders
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#142c4c] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#071322]/60">
                  <th className="py-3 px-4 sm:px-6">Player</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-3 text-right">Runs</th>
                  <th className="py-3 px-3 text-right">Balls</th>
                  <th className="py-3 px-3 text-right">4s</th>
                  <th className="py-3 px-3 text-right">6s</th>
                  <th className="py-3 px-4 text-right">Strike Rate</th>
                  <th className="py-3 px-4 text-right">Boundary %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142c4c]/60 font-mono-num">
                {topBatters.map(({ player, teamShortName, batting }) => {
                  if (!batting) return null;
                  const boundaryRuns = batting.fours * 4 + batting.sixes * 6;
                  const boundaryPercent = batting.runs > 0 ? Math.round((boundaryRuns / batting.runs) * 100) : 0;
                  return (
                    <tr
                      key={player.id}
                      onClick={() => setSelectedPlayer(aggregates.find((a) => a.player.id === player.id) || null)}
                      className="hover:bg-[#10253f]/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-white">
                        {player.name}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-xs text-amber-400">
                        {teamShortName}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-white text-base">
                        {batting.runs}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-300">
                        {batting.balls}
                      </td>
                      <td className="py-3.5 px-3 text-right text-blue-300">
                        {batting.fours}
                      </td>
                      <td className="py-3.5 px-3 text-right text-amber-300 font-bold">
                        {batting.sixes}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-amber-400">
                        {calculateStrikeRate(batting.runs, batting.balls)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {boundaryPercent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bowling Leaderboard */}
      {activeTab === 'bowling' && (
        <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-[#071322] border-b border-[#142c4c]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bowling Leaders
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#142c4c] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#071322]/60">
                  <th className="py-3 px-4 sm:px-6">Bowler</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-3 text-right">Overs</th>
                  <th className="py-3 px-3 text-right">Wickets</th>
                  <th className="py-3 px-3 text-right">Runs</th>
                  <th className="py-3 px-4 text-right">Economy</th>
                  <th className="py-3 px-3 text-right">Dots</th>
                  <th className="py-3 px-3 text-right">Maidens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#142c4c]/60 font-mono-num">
                {topBowlers.map(({ player, teamShortName, bowling }) => {
                  if (!bowling) return null;
                  return (
                    <tr
                      key={player.id}
                      onClick={() => setSelectedPlayer(aggregates.find((a) => a.player.id === player.id) || null)}
                      className="hover:bg-[#10253f]/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-white">
                        {player.name}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-xs text-blue-400">
                        {teamShortName}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-200">
                        {bowling.overs}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-amber-400 text-base">
                        {bowling.wickets}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-200">
                        {bowling.runsConceded}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-amber-300">
                        {calculateEconomy(bowling.runsConceded, bowling.legalBallsBowled)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-300">
                        {bowling.dots}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-400">
                        {bowling.maidens}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Player Detail Modal / Spotlight */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#142c4c] flex items-center justify-between bg-[#071322]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedPlayer.player.name}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedPlayer.teamName} · {selectedPlayer.player.role}
                </div>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10253f] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Overall Impact Score */}
              <div className="bg-[#071322] border border-[#142c4c] rounded-xl p-4 flex items-center justify-between shadow-inner">
                <div>
                  <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    Match MVP Points
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Calculated from full match contribution
                  </div>
                </div>
                <div className="font-scoreboard text-4xl font-extrabold text-amber-400 font-mono-num">
                  {selectedPlayer.mvpPoints}
                </div>
              </div>

              {/* Batting Section */}
              {selectedPlayer.batting && selectedPlayer.batting.balls > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Batting Performance
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center bg-[#071322] p-3 rounded-xl border border-[#142c4c]">
                    <div>
                      <div className="text-[10px] text-slate-400">RUNS</div>
                      <div className="font-scoreboard text-2xl font-bold text-white font-mono-num">
                        {selectedPlayer.batting.runs}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">BALLS</div>
                      <div className="text-sm font-semibold text-slate-200 mt-1 font-mono-num">
                        {selectedPlayer.batting.balls}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">4s / 6s</div>
                      <div className="text-sm font-semibold text-slate-200 mt-1 font-mono-num">
                        {selectedPlayer.batting.fours} / {selectedPlayer.batting.sixes}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">STRIKE RATE</div>
                      <div className="text-sm font-bold text-amber-400 mt-1 font-mono-num">
                        {calculateStrikeRate(selectedPlayer.batting.runs, selectedPlayer.batting.balls)}
                      </div>
                    </div>
                  </div>

                  {/* Shot Wagon Distribution if available */}
                  {selectedPlayer.batting.scoringZones && (
                    <div className="mt-3 bg-[#071322]/60 p-3 rounded-xl border border-[#142c4c]">
                      <div className="text-xs font-medium text-slate-400 mb-2">
                        Scoring Sector Distribution:
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-[#0b1a2e] p-2 rounded-lg border border-[#142c4c]">
                          <div className="text-[10px] text-slate-400">Off-Side</div>
                          <div className="font-bold text-blue-400 font-mono-num">
                            {selectedPlayer.batting.scoringZones.offSide} runs
                          </div>
                        </div>
                        <div className="bg-[#0b1a2e] p-2 rounded-lg border border-[#142c4c]">
                          <div className="text-[10px] text-slate-400">Straight</div>
                          <div className="font-bold text-amber-400 font-mono-num">
                            {selectedPlayer.batting.scoringZones.straight} runs
                          </div>
                        </div>
                        <div className="bg-[#0b1a2e] p-2 rounded-lg border border-[#142c4c]">
                          <div className="text-[10px] text-slate-400">Leg-Side</div>
                          <div className="font-bold text-blue-400 font-mono-num">
                            {selectedPlayer.batting.scoringZones.legSide} runs
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-[#071322]/40 p-3 rounded-xl border border-[#142c4c]/50">
                  Did not bat in this match.
                </div>
              )}

              {/* Bowling Section */}
              {selectedPlayer.bowling && selectedPlayer.bowling.legalBallsBowled > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Bowling Performance
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5 text-center bg-[#071322] p-3 rounded-xl border border-[#142c4c]">
                    <div>
                      <div className="text-[10px] text-slate-400">OVERS</div>
                      <div className="text-sm font-semibold text-slate-200 mt-1 font-mono-num">
                        {selectedPlayer.bowling.overs}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">WKTS</div>
                      <div className="font-scoreboard text-2xl font-bold text-amber-400 font-mono-num">
                        {selectedPlayer.bowling.wickets}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">RUNS</div>
                      <div className="font-scoreboard text-2xl font-bold text-white font-mono-num">
                        {selectedPlayer.bowling.runsConceded}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">ECON</div>
                      <div className="text-sm font-bold text-amber-300 mt-1 font-mono-num">
                        {calculateEconomy(selectedPlayer.bowling.runsConceded, selectedPlayer.bowling.legalBallsBowled)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">DOTS</div>
                      <div className="text-sm font-semibold text-slate-300 mt-1 font-mono-num">
                        {selectedPlayer.bowling.dots}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-[#071322]/40 p-3 rounded-xl border border-[#142c4c]/50">
                  Did not bowl in this match.
                </div>
              )}
            </div>

            <div className="p-4 bg-[#071322] border-t border-[#142c4c] flex justify-end">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#10253f] hover:bg-[#163357] rounded-lg transition-colors border border-[#1a365d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
