import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId = process.env.EXPO_EAS_PROJECT_ID;
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return {
    owner: "jappmaster",
    name: "Fotbollsresan",
    slug: "fotbollstranaren",
    scheme: "spelfc",
    version: "1.0.0",
    orientation: "portrait",
    runtimeVersion: {
      policy: "sdkVersion",
    },
    updates: projectId
      ? {
          url: `https://u.expo.dev/${projectId}`,
        }
      : undefined,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ajagames.learnfotball",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.ajagames.learnfotball",
    },
    web: {
      bundler: "metro",
    },
    plugins: [],
    extra: {
      eas: {
        projectId: projectId,
      },
      EXPO_PUBLIC_SUPABASE_URL: supabaseUrl,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon,
    },
  };
};

