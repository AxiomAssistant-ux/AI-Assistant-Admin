// src/api/org/agentConfigs.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

// ===== TYPES =====

export type ConfigStatus = 'pending_review' | 'approved' | 'rejected' | 'active'
export type KnowledgeBaseStatus = 'draft' | 'pending_sync' | 'synced' | 'failed'

export interface AgentConfig {
  id: string
  org_id: string
  name: string
  status: ConfigStatus
  configuration: AgentConfiguration
  retell_agent_id: string | null
  retell_phone_number: string | null
  retell_agent_name: string | null
  created_at: string
  updated_at: string
}

export interface AgentConfiguration {
  branding: BrandingConfig
  operations: OperationsConfig
  authority: AuthorityConfig
  escalation: EscalationConfig
  data_compliance: DataComplianceConfig
  knowledge_base: KnowledgeBaseConfig
  integrations: IntegrationsConfig
  call_experience: CallExperienceConfig
  analytics: AnalyticsConfig
  training: TrainingConfig
}

export interface BrandingConfig {
  company_name: string
  agent_name: string
  industry: string
  brand_voice: string
  phrases_to_use: string[]
  phrases_to_avoid: string[]
}

export interface OperationsConfig {
  operating_hours: string
  timezone: string
  primary_language: string
  secondary_languages: string[]
  avg_call_duration: number
  call_recording: boolean
}

export interface AuthorityConfig {
  allowed_actions: string[]
  max_compensation_value: number
  approval_required_for: string[]
  immediate_actions: string[]
  refund_policy: string
}

export interface EscalationConfig {
  escalation_triggers: string[]
  escalation_email: string
  escalation_phone: string
  priority_levels: { [key: string]: string }
  department_routing: { [key: string]: string }
  after_hours_handling: string
}

export interface DataComplianceConfig {
  mandatory_fields: string[]
  optional_fields: string[]
  compliance_requirements: string[]
  data_retention_days: number
  verification_process: string
}

export interface KnowledgeBaseConfig {
  faqs_enabled: boolean
  product_catalog: string
  location_info: string
  common_scenarios: string[]
  company_policies: string[]
  pricing_info: string
}

export interface IntegrationsConfig {
  crm_system: string | null
  ticketing_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
  calendar_enabled: boolean
  payment_enabled: boolean
  webhook_urls: string[]
}

export interface CallExperienceConfig {
  hold_message: string
  transfer_type: 'warm' | 'cold'
  voicemail_handling: string
  post_call_actions: string[]
  callback_preference: string
}

export interface AnalyticsConfig {
  success_metrics: string[]
  kpis_to_track: string[]
  reporting_frequency: 'daily' | 'weekly' | 'monthly'
  alert_triggers: { [key: string]: number }
}

export interface TrainingConfig {
  edge_cases: string[]
  tone_examples: string[]
  sample_dialogues: string[]
}

export interface KnowledgeBase {
  id: string
  agent_config_id: string
  org_id: string
  name: string
  description: string
  file_name: string
  file_url: string
  file_size: number
  file_type: string
  status: KnowledgeBaseStatus
  enabled: boolean
  created_at: string
  updated_at: string
  synced_at?: string
}

export interface CreateAgentConfigRequest {
  name: string
  configuration: AgentConfiguration
}

export interface UpdateAgentConfigRequest {
  name?: string
  configuration?: Partial<AgentConfiguration>
}

export interface CreateKnowledgeBaseRequest {
  name: string
  description: string
  file: File
}

export interface UpdateKnowledgeBaseRequest {
  name?: string
  description?: string
  enabled?: boolean
}

export interface QuickSetupAnswers {
  company_name: string
  industry: string
  business_description: string
  primary_service: string
  target_audience: string
  operating_hours?: string
  primary_language?: string
  additional_context?: string
}

export interface ParsedAgentConfig {
  configuration: AgentConfiguration
  parse_status: 'success' | 'partial' | 'failed'
  confidence_score?: number
  error_message?: string
  suggestions?: string[]
}

// ===== API CLIENT =====

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const agentConfigsApi = {
  // Agent Config Management
  async getOrganizationAgentConfig(): Promise<AgentConfig> {
    const response = await axios.get(`${API_BASE}/org/agent-configs/current`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async createAgentConfig(data: CreateAgentConfigRequest): Promise<AgentConfig> {
    const response = await axios.post(`${API_BASE}/org/agent-configs`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateAgentConfig(configId: string, data: UpdateAgentConfigRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/agent-configs/${configId}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateConfiguration(configId: string, config: Partial<AgentConfiguration>): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/agent-configs/${configId}/configuration`, config, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  // Knowledge Base Management
  async listKnowledgeBases(configId: string): Promise<KnowledgeBase[]> {
    const response = await axios.get(`${API_BASE}/org/agent-configs/${configId}/knowledge-bases`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async createKnowledgeBase(configId: string, data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('file', data.file)

    const response = await axios.post(
      `${API_BASE}/org/agent-configs/${configId}/knowledge-bases`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  async updateKnowledgeBase(
    configId: string,
    kbId: string,
    data: UpdateKnowledgeBaseRequest
  ): Promise<{ message: string }> {
    const response = await axios.patch(
      `${API_BASE}/org/agent-configs/${configId}/knowledge-bases/${kbId}`,
      data,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async deleteKnowledgeBase(configId: string, kbId: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/agent-configs/${configId}/knowledge-bases/${kbId}`, {
      headers: getAuthHeaders()
    })
  },

  async syncKnowledgeBase(configId: string, kbId: string): Promise<{ message: string }> {
    const response = await axios.post(
      `${API_BASE}/org/agent-configs/${configId}/knowledge-bases/${kbId}/sync`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  }
}

export const agentConfigApi = {
  /**
   * Parse natural language description into full agent configuration
   */
  async parseFromDescription(description: string): Promise<ParsedAgentConfig> {
    const response = await axios.post(
      `${API_BASE}/org/agent-configs/parse-config`,
      { description },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  /**
   * Generate config from structured quick setup answers
   */
  async generateFromAnswers(answers: QuickSetupAnswers): Promise<ParsedAgentConfig> {
    const response = await axios.post(
      `${API_BASE}/org/agent-configs/generate-config`,
      answers,
      { headers: getAuthHeaders() }
    )
    return response.data
  }
}
