import api from './api';
import { ApiResponse, Application, CreateApplicationPayload } from '../types';

export const applicationsService = {
  apply: async (payload: CreateApplicationPayload): Promise<ApiResponse<Application>> => {
    const { data } = await api.post('/applications', payload);
    return data;
  },
};
