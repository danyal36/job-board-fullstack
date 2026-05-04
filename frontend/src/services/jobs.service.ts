import api from './api';
import { Job, ApiResponse, SearchParams } from '../types';

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const jobsService = {
  getJobs: async (params?: SearchParams): Promise<ApiResponse<JobsResponse>> => {
    const { data } = await api.get('/jobs', { params });
    return data;
  },

  searchJobs: async (params: SearchParams): Promise<ApiResponse<JobsResponse>> => {
    const { query, skills, ...rest } = params;
    const { data } = await api.get('/jobs/search', {
      params: {
        ...rest,
        ...(query && { q: query }),
        ...(skills?.length && { skills: skills.join(',') }),
      },
    });
    return data;
  },

  getJobById: async (id: string): Promise<ApiResponse<Job>> => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  createJob: async (payload: Partial<Job>): Promise<ApiResponse<Job>> => {
    const { data } = await api.post('/jobs', payload);
    return data;
  },

  updateJob: async (id: string, payload: Partial<Job>): Promise<ApiResponse<Job>> => {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },
};
