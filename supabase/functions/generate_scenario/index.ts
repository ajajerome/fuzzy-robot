/// <reference lib="deno.unstable" />
import { jsonResponse, readJson } from "../_shared/http.ts";
import {
  AttackingDirection,
  GenerateScenarioRequest,
  GenerateScenarioResponse,
  GameFormat,
  MatchScenario,
  Player,
  TeamId,
  AgeGroup,
} from "../_shared/types.ts";

function fieldForFormat(format: GameFormat) {
  // Normalized sizes (rough proportions). Units are arbitrary, we use width=1000 default.
  switch (format) {
    case "5v5":
      return { width: 800, height: 500 };
    case "7v7":
      return { width: 900, height: 600 };
    case "9v9":
      return { width: 1000, height: 650 };
    case "11v11":
      return { width: 1200, height: 800 };
  }
}

function defaultFormation(format: GameFormat, team: TeamId, direction: AttackingDirection, fieldWidth: number, fieldHeight: number): Player[] {
  // Simple, age-appropriate shapes; positions normalized based on direction
  const midY = fieldHeight / 2;
  const quarterY = fieldHeight / 4;
  const threeQuarterY = (3 * fieldHeight) / 4;

  const isLTR = direction === "left-to-right";
  const x = (percent: number) => (isLTR ? percent : 100 - percent) * 0.01 * fieldWidth;

  const players: Player[] = [];

  const push = (id: string, role: Player["role"], px: number, py: number) => {
    players.push({ id, team, role, position: { x: px, y: py } });
  };

  switch (format) {
    case "5v5": {
      push(`${team}-gk`, "GK", x(5), midY);
      push(`${team}-df1`, "DF", x(25), quarterY);
      push(`${team}-df2`, "DF", x(25), threeQuarterY);
      push(`${team}-mf`, "MF", x(45), midY);
      push(`${team}-fw`, "FW", x(70), midY);
      break;
    }
    case "7v7": {
      push(`${team}-gk`, "GK", x(5), midY);
      push(`${team}-df1`, "DF", x(20), quarterY);
      push(`${team}-df2`, "DF", x(20), threeQuarterY);
      push(`${team}-mf1`, "MF", x(40), quarterY);
      push(`${team}-mf2`, "MF", x(40), threeQuarterY);
      push(`${team}-am`, "MF", x(55), midY);
      push(`${team}-fw`, "FW", x(75), midY);
      break;
    }
    case "9v9": {
      push(`${team}-gk`, "GK", x(4), midY);
      push(`${team}-rb`, "DF", x(20), threeQuarterY);
      push(`${team}-cb1`, "DF", x(18), midY - 60);
      push(`${team}-cb2`, "DF", x(18), midY + 60);
      push(`${team}-lb`, "DF", x(20), quarterY);
      push(`${team}-cm1`, "MF", x(40), quarterY);
      push(`${team}-cm2`, "MF", x(40), threeQuarterY);
      push(`${team}-am`, "MF", x(55), midY);
      push(`${team}-st`, "FW", x(75), midY);
      break;
    }
    case "11v11": {
      push(`${team}-gk`, "GK", x(3), midY);
      push(`${team}-rb`, "DF", x(15), threeQuarterY);
      push(`${team}-rcb`, "DF", x(12), midY - 70);
      push(`${team}-lcb`, "DF", x(12), midY + 70);
      push(`${team}-lb`, "DF", x(15), quarterY);
      push(`${team}-cm1`, "MF", x(35), midY - 80);
      push(`${team}-cm2`, "MF", x(35), midY + 80);
      push(`${team}-cam`, "MF", x(50), midY);
      push(`${team}-rw`, "FW", x(65), quarterY + 40);
      push(`${team}-st`, "FW", x(72), midY);
      push(`${team}-lw`, "FW", x(65), threeQuarterY - 40);
      break;
    }
  }

  return players;
}

function titleFor(format: GameFormat, ageGroup: AgeGroup, theme?: string) {
  const base = theme ?? (format === "7v7" ? "Spela förbi press" : "Skapa bredd och understöd");
  return `${base} (${format}, ${ageGroup})`;
}

function buildScenario(req: GenerateScenarioRequest): MatchScenario {
  const field = fieldForFormat(req.format);
  const attackingTeam: TeamId = "home";
  const direction: AttackingDirection = "left-to-right";

  const playersHome = defaultFormation(req.format, "home", direction, field.width, field.height);
  const playersAway = defaultFormation(req.format, "away", direction === "left-to-right" ? "right-to-left" : "left-to-right", field.width, field.height).map((p) => ({
    ...p,
    // mirror X for away to be realistic
    position: { x: field.width - p.position.x, y: p.position.y },
  }));

  const rubric = {
    criteria: [
      { id: "progression", label: "Progression", weight: 0.4, description: "Flytta bollen framåt säkert" },
      { id: "width", label: "Bredd", weight: 0.3, description: "Utnyttja planens bredd" },
      { id: "support", label: "Stöd", weight: 0.3, description: "Skapa passningsbara alternativ" },
    ],
  } as const;

  const theme = req.preferences?.theme;
  const scenario: MatchScenario = {
    id: crypto.randomUUID(),
    title: titleFor(req.format, req.ageGroup, theme),
    ageGroup: req.ageGroup,
    level: req.level,
    format: req.format,
    field,
    attackingTeam,
    attackingDirection: direction,
    prompt:
      theme ?? "Du är bollhållare i uppspelsfasen. Visa hur ditt lag kan ta sig förbi första pressen genom passningar och löpningar. Rita passningar och löpningar som leder till kontroll i nästa zon.",
    objectives: [
      { id: "obj1", text: "Skapa bredd i speluppbyggnaden" },
      { id: "obj2", text: "Hitta framåtlösning när den är säker" },
      { id: "obj3", text: "Erbjud understöd nära bollhållare" },
    ],
    players: [...playersHome, ...playersAway],
    ball: { ownerPlayerId: "home-gk" },
    rubric,
    metadata: { source: "mvp-rule-based" },
  };
  return scenario;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await readJson<GenerateScenarioRequest>(req);
    // Basic validation
    if (!body || !body.ageGroup || !body.level || !body.format) {
      return jsonResponse({ error: "Missing required fields" }, { status: 400 });
    }
    const scenario = buildScenario(body);
    const response: GenerateScenarioResponse = { scenario };
    return jsonResponse(response, { status: 200 });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Internal error" }, { status: 500 });
  }
}

