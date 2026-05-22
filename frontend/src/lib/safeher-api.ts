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

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`/api/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Register failed");
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
  const res = await fetch(`/api/risk/analyze/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("analyzeRisk failed");
  return res.json();
}

export async function triggerAgent(payload: any): Promise<{ actions: EmbeddedAgentAction[] }> {
  const res = await fetch(`/api/agent/trigger/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("triggerAgent failed");
  return res.json();
}

export async function activateSOS(payload: { latitude: number; longitude: number; sessionId?: string; riskScore?: number; message?: string }): Promise<any> {
  const res = await fetch(`/api/sos/activate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const res = await fetch(`/api/profile/`, { method: "GET" });
  if (!res.ok) throw new Error("getProfile failed");
  return res.json();
}

export async function updateProfile(payload: ProfileUpdateRequest): Promise<Record<string, any>> {
  const res = await fetch(`/api/profile/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("updateProfile failed");
  return res.json();
}

export async function listEmergencyContacts(): Promise<{ contacts: EmergencyContact[] }> {
  const res = await fetch(`/api/contacts/`, { method: "GET" });
  if (!res.ok) throw new Error("listEmergencyContacts failed");
  return res.json();
}

export async function createEmergencyContact(payload: { name: string; phone: string; email?: string; relationship?: string; is_primary?: boolean }): Promise<EmergencyContact> {
  const res = await fetch(`/api/contacts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("createEmergencyContact failed");
  return res.json();
}

export async function updateEmergencyContact(id: number, payload: Partial<{ name: string; phone: string; email?: string; relationship?: string; is_primary?: boolean }>): Promise<EmergencyContact> {
  const res = await fetch(`/api/contacts/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("updateEmergencyContact failed");
  return res.json();
}

export async function deleteEmergencyContact(id: number): Promise<void> {
  const res = await fetch(`/api/contacts/${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("deleteEmergencyContact failed");
  return;
}
