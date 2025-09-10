import handler from "./index.ts";
import { MatchScenario, ScenarioAnswer } from "../_shared/types.ts";

Deno.test("score_answer returns 200 and score fields", async () => {
  const scenario: MatchScenario = {
    id: "s1",
    title: "Test",
    ageGroup: "U11-12",
    level: "basic",
    format: "7v7",
    field: { width: 900, height: 600 },
    attackingTeam: "home",
    attackingDirection: "left-to-right",
    prompt: "",
    objectives: [],
    players: [],
    ball: {},
    rubric: { criteria: [] },
  };
  const answer: ScenarioAnswer = {
    scenarioId: "s1",
    passes: [ { path: [ { x: 100, y: 300 }, { x: 300, y: 300 } ] } ],
    runs: [ { playerId: "p1", path: [ { x: 110, y: 280 }, { x: 280, y: 360 } ] } ],
  };

  const req = new Request("http://local/score_answer", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ scenario, answer }),
  });
  const res = await handler(req);
  if (!res.ok) throw new Error(`status ${res.status}`);
  const json = await res.json();
  if (typeof json.score !== "number") throw new Error("missing score");
  if (!json.breakdown) throw new Error("missing breakdown");
});

