import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (to be updated based on actual schema)
export interface Summary {
  id: string
  title: string
  content: string
  summary: string
  key_points: string[]
  content_type: 'document' | 'image' | 'audio' | 'youtube' | 'text'
  file_url?: string
  created_at: string
  updated_at: string
}

// Helper functions
export const saveSummary = async (summaryData: Omit<Summary, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('summaries')
    .insert([summaryData])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getSummary = async (id: string) => {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const getAllSummaries = async () => {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const uploadFile = async (file: File, bucket: string = 'uploads') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error
  return data
}