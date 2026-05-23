export type AuthUser = {
  id: number;
  username: string;
  email?: string;
  phone?: string;
};

export type AuthTokens = { access: string; refresh?: string };

export type AuthResponse = { user: AuthUser; tokens: AuthTokens };

export type LoginRequest = { username?: string; phone?: string; password: string };
export type RegisterRequest = { username: string; phone?: string; password: string };

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "https://safeher-ai-xzqa.onrender.com");

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    const sessionStr = localStorage.getItem("safeher-auth-session");
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      const token = session?.tokens?.access;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.error("Failed to read auth token from localStorage", e);
  }
  return headers;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let cleanBase = API_BASE_URL;
  if (cleanBase.endsWith("/")) {
    cleanBase = cleanBase.slice(0, -1);
  }
  let cleanPath = path;
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }
  const url = `${cleanBase}${cleanPath}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };
  return fetch(url, {
    ...options,
    headers,
  });
}

async function handleApiError(res: Response, defaultMsg: string): Promise<never> {
  try {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && typeof data === "object") {
        if (data.detail) {
          throw new Error(data.detail);
        }
        // Extract the first validation error if present
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const errorVal = data[firstKey];
          const errorMsg = Array.isArray(errorVal) ? errorVal[0] : errorVal;
          if (typeof errorMsg === "string") {
            // Capitalize field name for better readability
            const fieldName = firstKey.charAt(0).toUpperCase() + firstKey.slice(1).replace(/_/g, " ");
            throw new Error(`${fieldName}: ${errorMsg}`);
          }
        }
      }
    } else {
      // Fallback for HTML error pages (e.g. Django debug page)
      const text = await res.text();
      const match = text.match(/<title>([\s\S]*?)<\/title>/i) || text.match(/<h1>([\s\S]*?)<\/h1>/i);
      if (match && match[1]) {
        throw new Error(`Server Error: ${match[1].trim()}`);
      }
    }
  } catch (e) {
    if (e instanceof Error) throw e;
  }
  throw new Error(defaultMsg);
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const res = await apiFetch(`/api/login/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await handleApiError(res, "Login failed");
  }
  return res.json();
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const res = await apiFetch(`/api/register/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await handleApiError(res, "Register failed");
  }
  return res.json();
}

// Types used elsewhere — lightweight placeholders
export type EmbeddedAgentAction = any;
export type NearbyPlace = { name: string; latitude: number; longitude: number; place_type?: string; address?: string };
export type AgentActionType = string;

export type AreaType = "normal" | "crowded" | "isolated";

export type SafeHerLocation = {
  latitude: number;
  longitude: number;
  label?: string | null;
  areaType?: AreaType;
  timeOfDay?: "day" | "night";
};

export type SafetyStatus = "Safe" | "Moderate" | "High Risk";
export type TimeOfDay = "day" | "night";

export type MLFactors = Record<string, number>;

export type RiskFactorsDetail = Record<string, { score: number; reason?: string }>;

export type RiskAnalysisResponse = {
  safety_score: number;
  risk_score: number;
  risk_level: SafetyStatus;
  alert_triggered: boolean;
  recommended_action: string;
  analyzed_at: string;
  location: SafeHerLocation & { latitude: number; longitude: number };
  factors?: MLFactors;
  confidence?: number;
  risk_factors_detail?: RiskFactorsDetail;
  nearby_safe_places?: NearbyPlace[];
  agent_actions?: EmbeddedAgentAction[];
};

export async function analyzeRisk(payload: any): Promise<RiskAnalysisResponse> {
  const res = await apiFetch(`/api/risk/analyze/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("analyzeRisk failed");
  return res.json();
}

export async function triggerAgent(payload: any): Promise<{ actions: EmbeddedAgentAction[] }> {
  const res = await apiFetch(`/api/agent/trigger/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("triggerAgent failed");
  return res.json();
}

export async function activateSOS(payload: { latitude: number; longitude: number; sessionId?: string; riskScore?: number; message?: string }): Promise<any> {
  const res = await apiFetch(`/api/sos/activate/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("activateSOS failed");
  return res.json();
}

// Account / profile / contacts API (used by AccountSection)
export type EmergencyContact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  relationship?: string;
  is_primary?: boolean;
  created_at?: string;
};

export type ProfileUpdateRequest = { email?: string; first_name?: string; last_name?: string; phone?: string };

export async function getProfile(): Promise<Record<string, any>> {
  const res = await apiFetch(`/api/profile/`, { method: "GET" });
  if (!res.ok) throw new Error("getProfile failed");
  return res.json();
}

export async function updateProfile(payload: ProfileUpdateRequest): Promise<Record<string, any>> {
  const res = await apiFetch(`/api/profile/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("updateProfile failed");
  return res.json();
}

export async function listEmergencyContacts(): Promise<{ contacts: EmergencyContact[] }> {
  const res = await apiFetch(`/api/contacts/`, { method: "GET" });
  if (!res.ok) throw new Error("listEmergencyContacts failed");
  return res.json();
}

export async function createEmergencyContact(payload: { name: string; phone: string; email?: string; relationship?: string; is_primary?: boolean }): Promise<EmergencyContact> {
  const res = await apiFetch(`/api/contacts/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("createEmergencyContact failed");
  return res.json();
}

export async function updateEmergencyContact(id: number, payload: Partial<{ name: string; phone: string; email?: string; relationship?: string; is_primary?: boolean }>): Promise<EmergencyContact> {
  const res = await apiFetch(`/api/contacts/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("updateEmergencyContact failed");
  return res.json();
}

export async function deleteEmergencyContact(id: number): Promise<void> {
  const res = await apiFetch(`/api/contacts/${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("deleteEmergencyContact failed");
  return;
}
