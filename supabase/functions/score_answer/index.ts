import { jsonResponse, readJson } from "../_shared/http.ts";
import {
  GenerateScenarioRequest,
  ScoreAnswerRequest,
  ScoreAnswerResponse,
  MatchScenario,
  ScenarioAnswer,
  Point,
} from "../_shared/types.ts";
import {
  lineProgressTowardGoal,
  polylineLength,
  distance,
  pointNearLine,
} from "../_shared/geometry.ts";

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

function evaluateProgression(scenario: MatchScenario, answer: ScenarioAnswer): number {
  const width = scenario.field.width;
  if (!answer.passes || answer.passes.length === 0) return 0;
  let positiveAdvance = 0;
  let totalAdvance = 0.0001;
  for (const pass of answer.passes) {
    if (!pass.path || pass.path.length < 2) continue;
    const start = pass.path[0];
    const end = pass.path[pass.path.length - 1];
    const adv = lineProgressTowardGoal(start, end, scenario.attackingDirection);
    totalAdvance += Math.abs(adv);
    if (adv > 0) positiveAdvance += adv;
  }
  // Normalize by field width; emphasize forward over back
  const norm = clamp01((positiveAdvance / totalAdvance) * (Math.min(totalAdvance, width) / width));
  return norm;
}

function evaluateWidthUsage(scenario: MatchScenario, answer: ScenarioAnswer): number {
  const height = scenario.field.height;
  const yValues: number[] = [];
  for (const pass of answer.passes ?? []) {
    if ((pass.path?.length ?? 0) > 0) {
      for (const p of pass.path) yValues.push(p.y);
    }
  }
  for (const run of answer.runs ?? []) {
    if ((run.path?.length ?? 0) > 0) {
      for (const p of run.path) yValues.push(p.y);
    }
  }
  if (yValues.length === 0) return 0;
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const span = maxY - minY;
  return clamp01(span / (height * 0.8)); // 80% of height ~ optimal span
}

function evaluateSupport(scenario: MatchScenario, answer: ScenarioAnswer): number {
  // Heuristic: For each pass, count supportive runs that create nearby options at non-colinear angles
  const MAX_DIST_FROM_PASSER = 140;
  const MAX_DIST_TO_RECEIVER = 220;
  const MAX_DIST_TO_PASS_SEGMENT = 80;

  const passes = answer.passes ?? [];
  const runs = answer.runs ?? [];
  if (passes.length === 0 || runs.length === 0) return 0;

  let supportHits = 0;
  let opportunities = 0;

  for (const pass of passes) {
    if (!pass.path || pass.path.length < 2) continue;
    opportunities++;
    const start = pass.path[0];
    const end = pass.path[pass.path.length - 1];

    for (const run of runs) {
      if (!run.path || run.path.length < 2) continue;
      const rStart = run.path[0];
      const rEnd = run.path[run.path.length - 1];
      const nearPasser = distance(rStart, start) <= MAX_DIST_FROM_PASSER;
      const nearReceiver = distance(rEnd, end) <= MAX_DIST_TO_RECEIVER;
      // ensure the run offers angle, not on the pass line
      const angled = !pointNearLine(rEnd, start, end, MAX_DIST_TO_PASS_SEGMENT / 2);
      if (nearPasser && nearReceiver && angled) {
        supportHits++;
        break; // count max one support per pass
      }
    }
  }
  if (opportunities === 0) return 0;
  return clamp01(supportHits / opportunities);
}

function computeScore(scenario: MatchScenario, answer: ScenarioAnswer): ScoreAnswerResponse {
  const progression = evaluateProgression(scenario, answer);
  const widthUsage = evaluateWidthUsage(scenario, answer);
  const support = evaluateSupport(scenario, answer);

  // weights should match rubric roughly (0.4/0.3/0.3)
  const score01 = 0.4 * progression + 0.3 * widthUsage + 0.3 * support;
  const score = Math.round(score01 * 100);

  const feedback: string[] = [];
  if (progression < 0.3) feedback.push("Våga spela framåt när det är säkert.");
  else if (progression > 0.7) feedback.push("Bra progression framåt!");
  if (widthUsage < 0.3) feedback.push("Använd planens bredd för att öppna ytor.");
  else if (widthUsage > 0.7) feedback.push("Snyggt med bredd i spelet.");
  if (support < 0.3) feedback.push("Erbjud fler stödjande löpningar runt bollhållare.");
  else if (support > 0.7) feedback.push("Fina understödjande löpningar.");

  return {
    score,
    breakdown: { progression, widthUsage, support },
    feedback,
  };
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, { status: 405 });
    }
    const body = await readJson<ScoreAnswerRequest>(req);
    if (!body || !body.scenario || !body.answer) {
      return jsonResponse({ error: "Missing required fields" }, { status: 400 });
    }
    const result = computeScore(body.scenario, body.answer);
    return jsonResponse(result, { status: 200 });
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Internal error" }, { status: 500 });
  }
}

