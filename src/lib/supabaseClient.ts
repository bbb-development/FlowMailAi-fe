import { createClient } from "@supabase/supabase-js";
import envConfig from '../envConfig';

export const supabase = createClient(envConfig.supabaseUrl, envConfig.supabaseAnonKey);