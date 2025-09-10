## Köra mobilappen (Expo Go)

1. Skapa en `.env` i `apps/mobile` från `.env.example` och fyll i:
   - `EXPO_PUBLIC_SUPABASE_URL` = `https://<PROJECT_REF>.functions.supabase.co`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = Anon key från Supabase Settings → API

2. Installera beroenden lokalt (om du utvecklar lokalt):
```bash
cd apps/mobile
npm i
npx expo start
```

3. Öppna Expo Go på din telefon och skanna QR-koden. Tryck på “Testa generate_scenario”.

Om du kör via EAS Build → TestFlight behövs ingen lokal `.env`; sätt variabler i EAS Build-profilen eller GitHub Secrets och använd `eas secret:push`.

