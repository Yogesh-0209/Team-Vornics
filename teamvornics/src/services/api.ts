import axios from 'axios';
import { ExtractedData } from '../types/dashboard';

// Use relative URL for production (Netlify) and fallback to localhost for development
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for file processing
});

export const processFile = async (file: File): Promise<ExtractedData> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('🚀 Sending file to backend:', file.name);
    
    const response = await api.post('/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute timeout
    });

    console.log('✅ Backend response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend server is not running. Please start the backend server first.');
      }
      throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Processing failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getProcessingStatus = async (jobId: string) => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
};

export const downloadResult = async (fileId: string) => {
  const response = await api.get(`/download/${fileId}`, {
    responseType: 'blob',
  });
  return response.data;
};
