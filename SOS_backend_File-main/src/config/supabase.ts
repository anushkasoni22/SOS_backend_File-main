import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_KEY!;
const SUPABASE_UPLOAD_URL= process.env.SUPABASE_UPLOAD_URL!;
const SUPABASE_UPLOAD_KEY = process.env.SUPABASE_UPLOAD_KEY!;
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabaseUpload = createClient(SUPABASE_UPLOAD_URL, SUPABASE_UPLOAD_KEY);