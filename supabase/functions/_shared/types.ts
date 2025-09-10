export type AgeGroup = "U9-10" | "U11-12" | "U13-14" | "U15-16";

export type GameFormat = "5v5" | "7v7" | "9v9" | "11v11";

export type TeamId = "home" | "away";

export type AttackingDirection = "left-to-right" | "right-to-left";

export interface FieldSize {
  width: number; // normalized horizontal units (default 1000)
  height: number; // normalized vertical units (default 600)
}

export interface Point {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  displayName?: string;
  team: TeamId;
  role: "GK" | "DF" | "MF" | "FW";
  position: Point; // current position on the pitch
}

export interface BallState {
  ownerPlayerId?: string; // if undefined, use ballPosition
  ballPosition?: Point;
}

export interface ScenarioObjective {
  id: string;
  text: string;
}

export interface ScenarioRubricCriterion {
  id: string;
  label: string; // e.g. "Progression", "Bredd", "Stöd"
  weight: number; // 0..1, sum <= 1 in simple rubric
  description?: string;
}

export interface ScenarioRubric {
  criteria: ScenarioRubricCriterion[];
}

export interface MatchScenario {
  id: string;
  title: string;
  ageGroup: AgeGroup;
  level: "basic" | "intermediate" | "advanced";
  format: GameFormat;
  field: FieldSize;
  attackingTeam: TeamId;
  attackingDirection: AttackingDirection;
  prompt: string; // textual instruction for the player
  objectives: ScenarioObjective[];
  players: Player[];
  ball: BallState;
  rubric: ScenarioRubric;
  metadata?: Record<string, unknown>;
}

export interface PassAction {
  fromPlayerId?: string; // optional if drawn from free position
  toPlayerId?: string;   // optional if drawn to space
  path: Point[]; // polyline
}

export interface RunAction {
  playerId: string;
  path: Point[];
}

export interface ZoneMarking {
  label?: string;
  polygon: Point[]; // closed polygon
}

export interface ScenarioAnswer {
  scenarioId: string;
  passes: PassAction[];
  runs: RunAction[];
  zones?: ZoneMarking[];
}

export interface ScoreBreakdown {
  progression: number;
  widthUsage: number;
  support: number;
  circulation?: number;
}

export interface ScoredAnswer {
  score: number; // 0..100
  breakdown: ScoreBreakdown;
  feedback: string[];
}

export interface GenerateScenarioRequest {
  ageGroup: AgeGroup;
  level: "basic" | "intermediate" | "advanced";
  format: GameFormat;
  preferences?: {
    theme?: string; // e.g. "spela ut bollen", "vända spel"
    focus?: Array<"progression" | "width" | "support" | "circulation">;
  };
}

export interface GenerateScenarioResponse {
  scenario: MatchScenario;
}

export interface ScoreAnswerRequest {
  scenario: MatchScenario;
  answer: ScenarioAnswer;
}

export interface ScoreAnswerResponse extends ScoredAnswer {}

