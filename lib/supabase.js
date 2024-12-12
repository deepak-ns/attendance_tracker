import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://javysohecihpeeitqoud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphdnlzb2hlY2locGVlaXRxb3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDg0NTAsImV4cCI6MjA0OTMyNDQ1MH0.ehRAHK1FjUuWNz6pHDp4AwxG6NI6Jc-G1yloBFTLFxc';

export const supabase = createClient(supabaseUrl, supabaseKey);