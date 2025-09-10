export type AgeGroup = "U9-10" | "U11-12" | "U13-14" | "U15-16";
export type GameFormat = "5v5" | "7v7" | "9v9" | "11v11";
export type TeamId = "home" | "away";
export type AttackingDirection = "left-to-right" | "right-to-left";

export interface FieldSize { width: number; height: number }
export interface Point { x: number; y: number }

export interface Player {
  id: string;
  displayName?: string;
  team: TeamId;
  role: "GK" | "DF" | "MF" | "FW";
  position: Point;
}

export interface ScenarioObjective { id: string; text: string }
export interface ScenarioRubricCriterion { id: string; label: string; weight: number; description?: string }
export interface ScenarioRubric { criteria: ScenarioRubricCriterion[] }

export interface MatchScenario {
  id: string;
  title: string;
  ageGroup: AgeGroup;
  level: "basic" | "intermediate" | "advanced";
  format: GameFormat;
  field: FieldSize;
  attackingTeam: TeamId;
  attackingDirection: AttackingDirection;
  prompt: string;
  objectives: ScenarioObjective[];
  players: Player[];
  ball: { ownerPlayerId?: string; ballPosition?: Point };
  rubric: ScenarioRubric;
  metadata?: Record<string, unknown>;
}

export interface PassAction { fromPlayerId?: string; toPlayerId?: string; path: Point[] }
export interface RunAction { playerId: string; path: Point[] }

export interface ScenarioAnswer {
  scenarioId: string;
  passes: PassAction[];
  runs: RunAction[];
}

export interface ScoreBreakdown { progression: number; widthUsage: number; support: number; circulation?: number }
export interface ScoredAnswer { score: number; breakdown: ScoreBreakdown; feedback: string[] }

