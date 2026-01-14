// src/api/org/agents.ts - FIXED + PRODUCTION SAFE
import axios from "axios"

// ✅ bulletproof base url (prevents /api/v1/api/v1 and // issues)
const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// remove trailing slash
const CLEAN_BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE

// ensure /api/v1 exists exactly once
const API_BASE = CLEAN_BASE.endsWith("/api/v1") ? CLEAN_BASE : `${CLEAN_BASE}/api/v1`

// ✅ single axios instance (consistent behavior)
const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
})

// ===== TYPES =====

export type ConfigStatus = "pending_review" | "approved" | "rejected" | "active"
export type SyncStatus = "not_synced" | "syncing" | "synced" | "failed"

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
  transfer_type: "warm" | "cold"
  voicemail_handling: string
  post_call_actions: string[]
  callback_preference: string
}

export interface AnalyticsConfig {
  success_metrics: string[]
  kpis_to_track: string[]
  reporting_frequency: "daily" | "weekly" | "monthly"
  alert_triggers: { [key: string]: number }
}

export interface TrainingConfig {
  edge_cases: string[]
  tone_examples: string[]
  sample_dialogues: string[]
}

export interface AgentConfig {
  id: string
  org_id: string
  name: string
  status: ConfigStatus
  configuration: AgentConfiguration
  retell_agent_id: string | null
  agent_assigned: boolean
  created_at: string
  updated_at: string
  admin_notes?: string
  rejection_reason?: string
  reviewed_at?: string
  reviewed_by?: string
}

export interface AgentStatus {
  has_config: boolean
  status: ConfigStatus | null
  agent_assigned: boolean
  can_upload_kb: boolean
  retell_agent_id: string | null
  message: string
}

export interface KnowledgeBase {
  id: string
  org_id: string
  retell_agent_id: string
  name: string
  description: string
  file_name: string
  file_url: string
  file_size: number
  file_type: string
  enabled: boolean
  sync_status: SyncStatus
  synced_at: string | null
  sync_error: string | null
  retell_kb_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateConfigRequest {
  name: string
  configuration: AgentConfiguration
}

export interface UpdateConfigRequest {
  name?: string
  configuration?: AgentConfiguration
}

export interface CreateKnowledgeBaseRequest {
  name: string
  description: string
  file: File
}

export interface UpdateKnowledgeBaseRequest {
  name?: string
  description?: string
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
  parse_status: "success" | "partial" | "failed"
  confidence_score?: number
  error_message?: string
  suggestions?: string[]
}

export interface KnowledgeBaseListResponse {
  items: KnowledgeBase[]
  total: number
}

// ===== AUTH =====

const getAuthHeaders = () => {
  // ✅ prevents "localStorage is not defined" during SSR
  if (typeof window === "undefined") return {}

  try {
    const token = localStorage.getItem("access_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

// ✅ Optional: helpful for debugging URL problems
export const __agentsApiDebug = {
  API_BASE,
}

// ===== API =====

export const agentsApi = {
  // ===== AGENT CONFIG ENDPOINTS =====

  async getConfig(): Promise<AgentConfig> {
    const res = await http.get("/org/agents/config", {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async getStatus(): Promise<AgentStatus> {
    const res = await http.get("/org/agents/status", {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async createConfig(data: CreateConfigRequest): Promise<AgentConfig> {
    const res = await http.post("/org/agents/config", data, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async updateConfig(configuration: AgentConfiguration): Promise<{ message: string }> {
    const res = await http.patch(
      "/org/agents/config",
      { configuration },
      { headers: getAuthHeaders() }
    )
    return res.data
  },

  // ===== KNOWLEDGE BASE ENDPOINTS =====

  async listKnowledgeBases(): Promise<KnowledgeBaseListResponse> {
    const res = await http.get("/org/agents/knowledge-bases", {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async getKnowledgeBase(kbId: string): Promise<KnowledgeBase> {
    const res = await http.get(`/org/agents/knowledge-bases/${kbId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async createKnowledgeBase(data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("file", data.file)

    const res = await http.post("/org/agents/knowledge-bases", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    })

    return res.data
  },

  async updateKnowledgeBase(
    kbId: string,
    data: UpdateKnowledgeBaseRequest
  ): Promise<{ message: string }> {
    const res = await http.patch(`/org/agents/knowledge-bases/${kbId}`, data, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async deleteKnowledgeBase(kbId: string): Promise<{ message: string }> {
    const res = await http.delete(`/org/agents/knowledge-bases/${kbId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async enableKnowledgeBase(kbId: string): Promise<{ message: string }> {
    const res = await http.post(
      `/org/agents/knowledge-bases/${kbId}/enable`,
      {},
      { headers: getAuthHeaders() }
    )
    return res.data
  },

  async disableKnowledgeBase(kbId: string): Promise<{ message: string }> {
    const res = await http.post(
      `/org/agents/knowledge-bases/${kbId}/disable`,
      {},
      { headers: getAuthHeaders() }
    )
    return res.data
  },

  // ===== AI CONFIG GENERATION ENDPOINTS =====

  async generateFromAnswers(answers: QuickSetupAnswers): Promise<ParsedAgentConfig> {
    const res = await http.post("/org/agents/generate-config", answers, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async parseFromDescription(description: string): Promise<ParsedAgentConfig> {
    const res = await http.post(
      "/org/agents/parse-config",
      { description },
      { headers: getAuthHeaders() }
    )
    return res.data
  },
}

// Export for backwards compatibility
export const agentConfigApi = {
  parseFromDescription: agentsApi.parseFromDescription,
  generateFromAnswers: agentsApi.generateFromAnswers,
}



// // src/api/org/agents.ts - UNIFIED BACKEND VERSION
// import axios from 'axios'

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

// // ===== TYPES =====

// export type ConfigStatus = 'pending_review' | 'approved' | 'rejected' | 'active'
// export type SyncStatus = 'not_synced' | 'syncing' | 'synced' | 'failed'

// export interface AgentConfiguration {
//   branding: BrandingConfig
//   operations: OperationsConfig
//   authority: AuthorityConfig
//   escalation: EscalationConfig
//   data_compliance: DataComplianceConfig
//   knowledge_base: KnowledgeBaseConfig
//   integrations: IntegrationsConfig
//   call_experience: CallExperienceConfig
//   analytics: AnalyticsConfig
//   training: TrainingConfig
// }

// export interface BrandingConfig {
//   company_name: string
//   agent_name: string
//   industry: string
//   brand_voice: string
//   phrases_to_use: string[]
//   phrases_to_avoid: string[]
// }

// export interface OperationsConfig {
//   operating_hours: string
//   timezone: string
//   primary_language: string
//   secondary_languages: string[]
//   avg_call_duration: number
//   call_recording: boolean
// }

// export interface AuthorityConfig {
//   allowed_actions: string[]
//   max_compensation_value: number
//   approval_required_for: string[]
//   immediate_actions: string[]
//   refund_policy: string
// }

// export interface EscalationConfig {
//   escalation_triggers: string[]
//   escalation_email: string
//   escalation_phone: string
//   priority_levels: { [key: string]: string }
//   department_routing: { [key: string]: string }
//   after_hours_handling: string
// }

// export interface DataComplianceConfig {
//   mandatory_fields: string[]
//   optional_fields: string[]
//   compliance_requirements: string[]
//   data_retention_days: number
//   verification_process: string
// }

// export interface KnowledgeBaseConfig {
//   faqs_enabled: boolean
//   product_catalog: string
//   location_info: string
//   common_scenarios: string[]
//   company_policies: string[]
//   pricing_info: string
// }

// export interface IntegrationsConfig {
//   crm_system: string | null
//   ticketing_enabled: boolean
//   email_enabled: boolean
//   sms_enabled: boolean
//   calendar_enabled: boolean
//   payment_enabled: boolean
//   webhook_urls: string[]
// }

// export interface CallExperienceConfig {
//   hold_message: string
//   transfer_type: 'warm' | 'cold'
//   voicemail_handling: string
//   post_call_actions: string[]
//   callback_preference: string
// }

// export interface AnalyticsConfig {
//   success_metrics: string[]
//   kpis_to_track: string[]
//   reporting_frequency: 'daily' | 'weekly' | 'monthly'
//   alert_triggers: { [key: string]: number }
// }

// export interface TrainingConfig {
//   edge_cases: string[]
//   tone_examples: string[]
//   sample_dialogues: string[]
// }

// export interface AgentConfig {
//   id: string
//   org_id: string
//   name: string
//   status: ConfigStatus
//   configuration: AgentConfiguration
//   retell_agent_id: string | null
//   agent_assigned: boolean
//   created_at: string
//   updated_at: string
//   admin_notes?: string
//   rejection_reason?: string
//   reviewed_at?: string
//   reviewed_by?: string
// }

// export interface AgentStatus {
//   has_config: boolean
//   status: ConfigStatus | null
//   agent_assigned: boolean
//   can_upload_kb: boolean
//   retell_agent_id: string | null
//   message: string
// }

// export interface KnowledgeBase {
//   id: string
//   org_id: string
//   retell_agent_id: string
//   name: string
//   description: string
//   file_name: string
//   file_url: string
//   file_size: number
//   file_type: string
//   enabled: boolean
//   sync_status: SyncStatus
//   synced_at: string | null
//   sync_error: string | null
//   retell_kb_id: string | null
//   created_at: string
//   updated_at: string
// }

// export interface CreateConfigRequest {
//   name: string
//   configuration: AgentConfiguration
// }

// export interface UpdateConfigRequest {
//   name?: string
//   configuration?: AgentConfiguration
// }

// export interface CreateKnowledgeBaseRequest {
//   name: string
//   description: string
//   file: File
// }

// export interface UpdateKnowledgeBaseRequest {
//   name?: string
//   description?: string
// }

// export interface QuickSetupAnswers {
//   company_name: string
//   industry: string
//   business_description: string
//   primary_service: string
//   target_audience: string
//   operating_hours?: string
//   primary_language?: string
//   additional_context?: string
// }

// export interface ParsedAgentConfig {
//   configuration: AgentConfiguration
//   parse_status: 'success' | 'partial' | 'failed'
//   confidence_score?: number
//   error_message?: string
//   suggestions?: string[]
// }

// export interface KnowledgeBaseListResponse {
//   items: KnowledgeBase[]
//   total: number
// }

// // ===== API CLIENT =====

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('access_token')
//   return token ? { Authorization: `Bearer ${token}` } : {}
// }

// export const agentsApi = {
//   // ===== AGENT CONFIG ENDPOINTS =====

//   /**
//    * Get organization's agent configuration
//    */
//   async getConfig(): Promise<AgentConfig> {
//     const response = await axios.get(`${API_BASE}/org/agents/config`, {
//       headers: getAuthHeaders()
//     })
//     return response.data
//   },

//   /**
//    * Get agent setup status
//    */
//   async getStatus(): Promise<AgentStatus> {
//     const response = await axios.get(`${API_BASE}/org/agents/status`, {
//       headers: getAuthHeaders()
//     })
//     return response.data
//   },

//   /**
//    * Create agent configuration
//    */
//   async createConfig(data: CreateConfigRequest): Promise<AgentConfig> {
//     const response = await axios.post(`${API_BASE}/org/agents/config`, data, {
//       headers: getAuthHeaders()
//     })
//     return response.data
//   },

//   /**
//    * Update agent configuration
//    */
//   async updateConfig(configuration: AgentConfiguration): Promise<{ message: string }> {
//     const response = await axios.patch(
//       `${API_BASE}/org/agents/config`,
//       { configuration },
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   // ===== KNOWLEDGE BASE ENDPOINTS =====

//   /**
//    * List knowledge bases
//    */
//   async listKnowledgeBases(): Promise<KnowledgeBaseListResponse> {
//     const response = await axios.get(`${API_BASE}/org/agents/knowledge-bases`, {
//       headers: getAuthHeaders()
//     })
//     return response.data
//   },

//   /**
//    * Get specific knowledge base
//    */
//   async getKnowledgeBase(kbId: string): Promise<KnowledgeBase> {
//     const response = await axios.get(`${API_BASE}/org/agents/knowledge-bases/${kbId}`, {
//       headers: getAuthHeaders()
//     })
//     return response.data
//   },

//   /**
//    * Upload knowledge base (creates disabled by default)
//    */
//   async createKnowledgeBase(data: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> {
//     const formData = new FormData()
//     formData.append('name', data.name)
//     formData.append('description', data.description)
//     formData.append('file', data.file)

//     const response = await axios.post(
//       `${API_BASE}/org/agents/knowledge-bases`,
//       formData,
//       {
//         headers: {
//           ...getAuthHeaders(),
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     )
//     return response.data
//   },

//   /**
//    * Update knowledge base metadata
//    */
//   async updateKnowledgeBase(kbId: string, data: UpdateKnowledgeBaseRequest): Promise<{ message: string }> {
//     const response = await axios.patch(
//       `${API_BASE}/org/agents/knowledge-bases/${kbId}`,
//       data,
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   /**
//    * Delete knowledge base
//    */
//   async deleteKnowledgeBase(kbId: string): Promise<{ message: string }> {
//     const response = await axios.delete(
//       `${API_BASE}/org/agents/knowledge-bases/${kbId}`,
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   /**
//    * Enable knowledge base (sync to Retell agent)
//    */
//   async enableKnowledgeBase(kbId: string): Promise<{ message: string }> {
//     const response = await axios.post(
//       `${API_BASE}/org/agents/knowledge-bases/${kbId}/enable`,
//       {},
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   /**
//    * Disable knowledge base (remove from Retell agent)
//    */
//   async disableKnowledgeBase(kbId: string): Promise<{ message: string }> {
//     const response = await axios.post(
//       `${API_BASE}/org/agents/knowledge-bases/${kbId}/disable`,
//       {},
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   // ===== AI CONFIG GENERATION ENDPOINTS =====

//   /**
//    * Generate config from structured quick setup answers
//    */
//   async generateFromAnswers(answers: QuickSetupAnswers): Promise<ParsedAgentConfig> {
//     const response = await axios.post(
//       `${API_BASE}/org/agents/generate-config`,
//       answers,
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   },

//   /**
//    * Parse natural language description into full agent configuration
//    */
//   async parseFromDescription(description: string): Promise<ParsedAgentConfig> {
//     const response = await axios.post(
//       `${API_BASE}/org/agents/parse-config`,
//       { description },
//       { headers: getAuthHeaders() }
//     )
//     return response.data
//   }
// }

// // Export for backwards compatibility
// export const agentConfigApi = {
//   parseFromDescription: agentsApi.parseFromDescription,
//   generateFromAnswers: agentsApi.generateFromAnswers
// }