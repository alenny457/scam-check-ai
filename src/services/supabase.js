import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const logScamCheck = async (message, analysisResult) => {
  const { data, error } = await supabase
    .from('message_checks')
    .insert([
      {
        message,
        risk_level: analysisResult.risk_level,
        confidence: analysisResult.confidence,
        analysis: {
          red_flags: analysisResult.red_flags,
          explanation: analysisResult.explanation,
          safety_advice: analysisResult.safety_advice
        }
      }
    ]);
  
  if (error) {
    console.error("Error logging record to Supabase:", error);
  }
  return data;
};