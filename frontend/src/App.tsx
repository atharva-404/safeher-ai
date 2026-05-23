import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/safeher/AuthProvider";
import { SafeHerProvider, useSafeHer } from "@/components/safeher/SafeHerProvider";
import { VoiceSOSProvider } from "@/hooks/use-voice-sos-context";
import { VoiceSOSIndicator } from "@/components/safeher/VoiceSOSIndicator";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

/**
 * Bridge component: must be rendered inside SafeHerProvider so it can read
 * triggerSOS, then passes it into the single VoiceSOSProvider that both
 * VoiceSOSIndicator and VoiceSOSSection will consume.
 */
function VoiceSOSBridge({ children }: { children: React.ReactNode }) {
  const { triggerSOS } = useSafeHer();
  return (
    <VoiceSOSProvider onKeywordDetected={triggerSOS}>
      {children}
    </VoiceSOSProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SafeHerProvider>
        <VoiceSOSBridge>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* Global floating voice SOS widget — available on every page */}
            <VoiceSOSIndicator />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </VoiceSOSBridge>
      </SafeHerProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

