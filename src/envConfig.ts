export interface Config {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

const loadConfig = (): Config => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not found.");
  }

  const config: Config = {
    supabaseUrl,
    supabaseAnonKey
  };

  return config;
};

const envConfig = loadConfig();

export default envConfig;