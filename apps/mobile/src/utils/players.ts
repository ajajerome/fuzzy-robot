import { MatchScenario } from "../types/scenario";
import { PlayerToken } from "../components/PitchLite";

export function scenarioPlayersToTokens(s: MatchScenario): PlayerToken[] {
  const { width, height } = s.field;
  return s.players.map((p) => ({
    id: p.id,
    team: p.team,
    x: Math.max(0, Math.min(1, p.position.x / Math.max(1, width))),
    y: Math.max(0, Math.min(1, p.position.y / Math.max(1, height))),
  }));
}

