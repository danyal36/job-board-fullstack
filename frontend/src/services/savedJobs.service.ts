import api from './api';
import { ApiResponse, SavedJob } from '../types';

export const savedJobsService = {
  getSavedJobs: async (): Promise<ApiResponse<SavedJob[]>> => {
    const { data } = await api.get('/saved-jobs');
    return data;
  },

  saveJob: async (jobId: string): Promise<ApiResponse<SavedJob>> => {
    const { data } = await api.post(`/saved-jobs/${jobId}`);
    return data;
  },

  unsaveJob: async (jobId: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete(`/saved-jobs/${jobId}`);
    return data;
  },
};
