export type Role = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  type: JobType;
  status: JobStatus;
  company: Company;
  createdAt: string;
}

export interface EmployerJob extends Job {
  applicantCount: number;
}

export interface JobFormPayload {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  type: JobType;
  status: JobStatus;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  job?: Job;
  createdAt: string;
}

export interface CreateApplicationPayload {
  jobId: string;
  coverLetter: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface SearchParams {
  query?: string;
  location?: string;
  type?: JobType;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  location: string;
  type: JobType | '';
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
}
