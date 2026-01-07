// src/api/org/agents.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type AgentProvider = 'retell' | 'elevenlabs'
export type AgentStatus = 'active' | 'disabled'
export type KnowledgeBaseType = 'file' | 'url' | 'text'
export type KnowledgeBaseStatus = 'enabled' | 'disabled'

export interface Agent {
  id: string
  org_id: string
  name: string
  provider: AgentProvider
  phone_number?: string
  status: AgentStatus
  language: string
  voice: string
  voice_gender?: string
  voice_accent?: string
  capabilities: {
    call_recording_enabled: boolean
    call_summaries_enabled: boolean
    action_items_enabled: boolean
    knowledge_base_enabled: boolean
  }
  created_at: string
  updated_at: string
}

export interface KnowledgeBase {
  id: string
  agent_id: string
  name: string
  type: KnowledgeBaseType
  status: KnowledgeBaseStatus
  file_url?: string
  url?: string
  content?: string
  created_at: string
  updated_at: string
}

export interface CustomizationRequest {
  // Business Context
  business_type: string
  primary_use: string
  
  // Personality & Tone
  tone: 'formal' | 'friendly' | 'empathetic' | 'assertive'
  speaking_speed: 'slow' | 'normal' | 'fast'
  emotion_level: 'low' | 'medium' | 'high'
  
  // Voice Preferences
  preferred_gender?: 'male' | 'female' | 'neutral'
  preferred_accent?: string
  preferred_age_range?: string
  
  // Conversation Behavior
  ask_followup_questions: boolean
  confirm_details_before_ending: boolean
  escalation_preference: string
  
  // Knowledge Usage
  knowledge_usage: 'heavy' | 'light' | 'fallback_only'
  
  // Free Notes
  notes?: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const agentsApi = {
  async getOrgAgent(): Promise<Agent> {
    const response = await axios.get(`${API_BASE}/org/agent`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await axios.get(`${API_BASE}/org/agent/knowledge-bases`, {
      headers: getAuthHeaders()
    })
    return response.data.knowledge_bases || []
  },

  async toggleKnowledgeBase(id: string, enabled: boolean): Promise<{ message: string }> {
    const response = await axios.patch(
      `${API_BASE}/org/agent/knowledge-bases/${id}/toggle`,
      { enabled },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async deleteKnowledgeBase(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/agent/knowledge-bases/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async submitCustomizationRequest(data: CustomizationRequest): Promise<{ message: string }> {
    const response = await axios.post(
      `${API_BASE}/org/agent/customization-request`,
      data,
      { headers: getAuthHeaders() }
    )
    return response.data
  }
}