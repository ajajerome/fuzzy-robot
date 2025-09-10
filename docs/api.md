## API: Scenario & Scoring (Supabase Edge Functions)

### POST generate_scenario
- **URL**: supabase function `generate_scenario`
- **Body**:
```json
{
  "ageGroup": "U11-12",
  "level": "basic",
  "format": "7v7",
  "preferences": { "theme": "Spela förbi första press" }
}
```
- **Response**:
```json
{
  "scenario": {
    "id": "...",
    "title": "Spela förbi första press (7v7, U11-12)",
    "ageGroup": "U11-12",
    "level": "basic",
    "format": "7v7",
    "field": { "width": 900, "height": 600 },
    "attackingTeam": "home",
    "attackingDirection": "left-to-right",
    "prompt": "Du är bollhållare...",
    "objectives": [ { "id": "obj1", "text": "Skapa bredd i speluppbyggnaden" } ],
    "players": [ { "id": "home-gk", "team": "home", "role": "GK", "position": { "x": 45, "y": 300 } } ],
    "ball": { "ownerPlayerId": "home-gk" },
    "rubric": { "criteria": [ { "id": "progression", "label": "Progression", "weight": 0.4 } ] },
    "metadata": { "source": "mvp-rule-based" }
  }
}
```

### POST score_answer (kommer i nästa steg)
- **URL**: supabase function `score_answer`
- **Body**:
```json
{
  "scenario": { /* objekt från generate_scenario */ },
  "answer": {
    "scenarioId": "...",
    "passes": [ { "path": [ { "x": 45, "y": 300 }, { "x": 200, "y": 400 } ] } ],
    "runs": [ { "playerId": "home-mf1", "path": [ { "x": 350, "y": 300 }, { "x": 500, "y": 320 } ] } ]
  }
}
```
- **Response**:
```json
{
  "score": 78,
  "breakdown": { "progression": 0.8, "widthUsage": 0.7, "support": 0.75 },
  "feedback": ["Bra bredd!", "Hitta djupare alternativ tidigare."]
}
```

### Lokal utveckling
1. Installera Supabase CLI och logga in.
2. Starta lokal stack: `supabase start`
3. Serva funktion: `supabase functions serve generate_scenario --no-verify-jwt`
4. Anropa:
```bash
curl -s -X POST http://localhost:54321/functions/v1/generate_scenario \
  -H 'Content-Type: application/json' \
  -d '{"ageGroup":"U11-12","level":"basic","format":"7v7"}' | jq
```

