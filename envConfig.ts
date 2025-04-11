export interface Config {
  pgConnectionString: string;
}

const loadConfig = (): Config => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || supabaseAnonKey) {
    throw new Error("Environment variables not found.");
  }

  const config: Config = {
    supabaseUrl,
    supabaseAnonKey
  };

  return config;
};

const envConfig = loadConfig();

export default envConfig;