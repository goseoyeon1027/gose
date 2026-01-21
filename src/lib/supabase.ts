import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vehkwwlmwxyslxaxijwm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGt3d2xtd3h5c2x4YXhpandtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODQ0MzUsImV4cCI6MjA4NDU2MDQzNX0.82evi3ojRLZJPBz0I0e92xrF6crd-iRxdwOEvHs5pE0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

