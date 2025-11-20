import { apiClient } from './api-client'
import type {
  KnowledgeBaseDocument,
  KnowledgeBaseDependentAgent,
  KnowledgeBaseListResponse,
  KnowledgeBaseQueryParams
} from '@/types/knowledge-base'

type AttachDocumentPayload = {
  document_id: string
  usage_mode?: string
}

export const knowledgeBaseApi = {
  async listDocuments(token: string, params: KnowledgeBaseQueryParams = {}) {
    const queryParams = new URLSearchParams()

    if (params.page_size !== undefined) {
      queryParams.append('page_size', params.page_size.toString())
    }
    if (params.cursor) {
      queryParams.append('cursor', params.cursor)
    }
    if (params.search) {
      queryParams.append('search', params.search)
    }
    if (params.types && params.types.length > 0) {
      queryParams.append('types', params.types.join(','))
    }
    if (params.show_only_owned !== undefined) {
      queryParams.append('show_only_owned', String(params.show_only_owned))
    }
    if (params.use_typesense !== undefined) {
      queryParams.append('use_typesense', String(params.use_typesense))
    }

    const queryString = queryParams.toString()
    const endpoint = `/auth/user/knowledge-base${queryString ? `?${queryString}` : ''}`
    return apiClient.get<KnowledgeBaseListResponse>(endpoint, token)
  },

  async getDocument(token: string, documentId: string) {
    return apiClient.get<KnowledgeBaseDocument>(`/auth/user/knowledge-base/${documentId}`, token)
  },

  async deleteDocument(token: string, documentId: string) {
    return apiClient.delete<void>(`/auth/user/knowledge-base/${documentId}`, token)
  },

  async getDependentAgents(token: string, documentId: string) {
    return apiClient.get<KnowledgeBaseDependentAgent[]>(
      `/auth/admin/knowledge-base/${documentId}/dependent-agents`,
      token
    )
  },

  async attachDocumentToAgent(token: string, agentId: string, payload: AttachDocumentPayload) {
    return apiClient.post(`/auth/admin/agents/${agentId}/knowledge-base`, payload, token)
  }
}

