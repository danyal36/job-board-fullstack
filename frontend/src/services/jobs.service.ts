import api from './api';
import { Job, ApiResponse, SearchParams, EmployerJob, JobFormPayload } from '../types';

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MyJobsResponse {
  jobs: EmployerJob[];
  total: number;
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

  getMyJobs: async (): Promise<ApiResponse<MyJobsResponse>> => {
    const { data } = await api.get('/jobs/me/list');
    return data;
  },

  createJob: async (payload: JobFormPayload): Promise<ApiResponse<Job>> => {
    const { data } = await api.post('/jobs', payload);
    return data;
  },

  updateJob: async (id: string, payload: Partial<JobFormPayload>): Promise<ApiResponse<Job>> => {
    const { data } = await api.put(`/jobs/${id}`, payload);
    return data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },
};
