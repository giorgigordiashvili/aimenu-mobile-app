import { API_BASE_URL, authFetch } from "./http";

export interface MeUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar?: string | null;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

const handleJson = async (res: Response) => {
  if (res.status === 204) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }
  return res.json();
};

export const accountApi = {
  getMe: async (): Promise<MeUser> => {
    const res = await authFetch(`${API_BASE_URL}/api/v1/users/me/`, {
      method: "GET",
    });
    return handleJson(res);
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<MeUser> => {
    const res = await authFetch(`${API_BASE_URL}/api/v1/users/me/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return handleJson(res);
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    const res = await authFetch(
      `${API_BASE_URL}/api/v1/auth/password/change/`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    await handleJson(res);
  },

  deleteAccount: async (): Promise<void> => {
    const res = await authFetch(
      `${API_BASE_URL}/api/v1/users/me/delete/`,
      { method: "DELETE" },
    );
    if (res.status !== 204) {
      await handleJson(res);
    }
  },
};
