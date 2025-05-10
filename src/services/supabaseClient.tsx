// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xueevolbnozqeyraxrsy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZWV2b2xibm96cWV5cmF4cnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTk0NTcsImV4cCI6MjA2MjIzNTQ1N30.5Uoz9R-8gBnFLvoLaGlrdK-BAb9FaFCcNsAHCWOh4yc'

export const supabase = createClient(supabaseUrl, supabaseKey)
