export type UnassignedAgent = {
  id: string
  name: string
}

export type AdminAgent = {
  agent_id?: string
  id?: string
  name?: string
  description?: string
  default_language?: string
  additional_languages?: string[]
  conversation_config?: AgentConversationConfig
  workflow?: AgentWorkflow
  platform_settings?: AgentPlatformSettings
  tts?: {
    voice_id?: string
    mode?: string
  }
  assigned_users?: string[]
  created_at?: string
  updated_at?: string
  [key: string]: any
}

export type AssignmentFilter = 'all' | 'assigned' | 'unassigned'

export interface AdminAgentListResponse {
  items: AdminAgent[]
  total: number
  skip: number
  limit: number
}

export interface AdminAgentQueryParams {
  skip?: number
  limit?: number
  search?: string
  assignment?: AssignmentFilter
}

// Audio format literals matching backend
export type AudioFormatLiteral =
  | 'pcm_8000'
  | 'pcm_16000'
  | 'pcm_22050'
  | 'pcm_24000'
  | 'pcm_44100'
  | 'pcm_48000'
  | 'ulaw_8000'

// TTS model literals matching backend
export type TTSModelLiteral = 'eleven_turbo_v2' | 'eleven_flash_v2' | 'eleven_multilingual_v2'

// Turn eagerness literals matching backend
export type TurnEagernessLiteral = 'patient' | 'normal' | 'eager'

// Knowledge base entry
export type AgentPromptKnowledgeBaseEntry = {
  id: string
  name?: string
  type?: string
  usage_mode?: string
  [key: string]: any
}

// Agent prompt configuration
export type AgentPromptConfig = {
  prompt?: string
  llm?: string
  reasoning_effort?: string
  thinking_budget?: number
  temperature?: number
  max_tokens?: number
  tool_ids?: string[]
  built_in_tools?: Record<string, any>
  knowledge_base?: AgentPromptKnowledgeBaseEntry[]
  [key: string]: any
}

// Agent section configuration
export type AgentSectionConfig = {
  first_message?: string
  language?: string
  dynamic_variables?: Record<string, any>
  dynamic_variable_placeholders?: Record<string, any>
  disable_first_message_interruptions?: boolean
  prompt?: AgentPromptConfig
  [key: string]: any
}

// Soft timeout configuration
export type SoftTimeoutConfig = {
  timeout_seconds?: number
  message?: string
}

// Turn configuration
export type TurnConfig = {
  turn_timeout?: number
  initial_wait_time?: number
  silence_end_call_timeout?: number
  soft_timeout_config?: SoftTimeoutConfig
  turn_eagerness?: TurnEagernessLiteral
}

// ASR conversational configuration
export type ASRConversationalConfig = {
  quality?: string
  provider?: string
  user_input_audio_format?: AudioFormatLiteral
  keywords?: string[]
  [key: string]: any
}

// TTS conversational configuration
export type TTSConversationalConfig = {
  model_id?: TTSModelLiteral
  voice_id?: string
  supported_voices?: Array<{
    label: string
    voice_id: string
    description?: string
    language?: string
    model_family?: string
    optimize_streaming_latency?: string
    stability?: number
    speed?: number
    similarity_boost?: number
  }>
  suggested_audio_tags?: Array<{
    tag: string
    description?: string
  }>
  agent_output_audio_format?: AudioFormatLiteral
  optimize_streaming_latency?: string
  stability?: number
  speed?: number
  similarity_boost?: number
  text_normalisation_type?: string
  pronunciation_dictionary_locators?: Array<{
    pronunciation_dictionary_id: string
    version_id?: string
  }>
  [key: string]: any
}

// Conversation configuration section
export type ConversationConfigSection = {
  text_only?: boolean
  max_duration_seconds?: number
  client_events?: string[]
  [key: string]: any
}

// Agent conversation configuration
export type AgentConversationConfig = {
  asr?: ASRConversationalConfig
  turn?: TurnConfig
  tts?: TTSConversationalConfig
  conversation?: ConversationConfigSection
  language_presets?: Record<string, any>
  vad?: Record<string, any>
  agent?: AgentSectionConfig
  [key: string]: any
}

// Agent platform settings
export type AgentPlatformSettings = {
  record_calls?: boolean
  debug?: boolean
  [key: string]: any
}

// Agent workflow node
export type AgentWorkflowNode = {
  id?: string
  type: string
  position?: Record<string, any>
  edge_order?: string[]
  agent_id?: string
  delay_ms?: number
  transfer_message?: string
  enable_transferred_agent_first_message?: boolean
  additional_prompt?: string
  additional_tool_ids?: string[]
  [key: string]: any
}

// Agent workflow edge
export type AgentWorkflowEdge = {
  id?: string
  source?: string
  target?: string
  condition?: string
  [key: string]: any
}

// Agent workflow
export type AgentWorkflow = {
  nodes?: AgentWorkflowNode[]
  edges?: AgentWorkflowEdge[]
  [key: string]: any
}

// Create agent payload matching backend AgentCreateRequest
export type CreateAgentPayload = {
  conversation_config: AgentConversationConfig
  platform_settings?: AgentPlatformSettings
  workflow?: AgentWorkflow
  name?: string
  tags?: string[]
  [key: string]: any
}

