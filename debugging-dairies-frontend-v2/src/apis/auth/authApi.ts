import api from '@/apis/axios';
import ENDPOINTS from '@/utils/endPoints';
import type {
  SignUpRequest,
  SignInRequest,
  ChangePasswordRequest,
  VerifyOtpRequest,
  SignInSuccessResponse,
  SignUpSuccessResponse,
} from '@/types/api/authTypes';

import type { BaseSuccessResponse } from '@/types/api/CommonTypes';

const authApi = {
  signUp: async (data: SignUpRequest): Promise<SignUpSuccessResponse> => {
    const response = await api.post<SignUpSuccessResponse>(
      ENDPOINTS.auth.signUp,
      data
    );
    return response.data;
  },

  signIn: async (data: SignInRequest): Promise<SignInSuccessResponse> => {
    const response = await api.post<SignInSuccessResponse>(
      ENDPOINTS.auth.signIn,
      data
    );
    return response.data;
  },

  confirmEmail: async (token: string): Promise<BaseSuccessResponse> => {
    const response = await api.get<BaseSuccessResponse>(
      ENDPOINTS.auth.confirmEmail(token)
    );
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<BaseSuccessResponse> => {
    const response = await api.post<BaseSuccessResponse>(
      ENDPOINTS.auth.changePassword,
      data
    );
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<BaseSuccessResponse> => {
    const response = await api.post<BaseSuccessResponse>(
      ENDPOINTS.auth.verifyOtp,
      data
    );
    return response.data;
  },

  signOut: async (): Promise<BaseSuccessResponse> => {
    const response = await api.post<BaseSuccessResponse>(
      ENDPOINTS.auth.signOut
    );
    return response.data;
  },
};

export default authApi;
