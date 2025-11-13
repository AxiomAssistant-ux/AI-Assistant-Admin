// Summary types matching backend API response
export type SummaryOut = {
  id?: string
  'Agent ID'?: string | null
  'Caller Name'?: string | null
  'Caller Email'?: string | null
  'Caller Number'?: string | null
  'Conversation ID'?: string | null
  'Recording Link'?: string | null
  'Call timing'?: string | null
  'Call Timing'?: string | null
  'End Call timing'?: string | null
  'Duration'?: string | null
  'Brief Summary'?: string | null
  'Detailed Summary'?: string | null
  'Questions asked during call'?: string[] | null
  'Action Items'?: string[] | null
  'Caller ID'?: string | null
  'Call Success'?: string | null
  'View_Status'?: boolean | null
  'Action_flag'?: boolean | null
  'Action_status'?: string | null
  'Urgency'?: boolean | string | null
  'Incident_Report'?: string | null
  'Store Number'?: string | null
  'Selected Timezone'?: string | null
  [key: string]: any // Allow extra fields
}

export type SummaryFilters = 'all' | 'read' | 'unread' | 'urgent'
export type SummarySort = 'newest' | 'oldest'
export type Timezone = 'UTC' | 'EST' | 'CST' | 'MST' | 'PST'

export interface SummaryQueryParams {
  skip?: number
  limit?: number
  search?: string
  filter?: SummaryFilters
  sort?: SummarySort
  tz?: Timezone
}

