import { useState, useEffect, useRef } from 'react';
import { Activity, Radio, Hand, MessageSquare, Eye, BarChart3, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface BackendHealth {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  device: string;
  uptime_seconds: number;
  python_version: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'sign' | 'conversation' | 'vision' | 'telemetry'>('sign');
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [wsLatency, setWsLatency] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/health');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setHealth(data);
      setHealthError(null);
    } catch (err: any) {
      setHealthError(err.message || 'Unable to connect to backend');
      setHealth(null);
    } finally {
      setIsChecking(false);
    }
  };

  const initWebSocket = () => {
    try {
      const ws = new WebSocket('ws://127.0.0.1:8000/ws/ping');
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        // Send a ping to measure latency
        const start = Date.now();
        ws.send(JSON.stringify({ timestamp: start }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'pong' && msg.client_timestamp) {
            const roundTrip = Date.now() - msg.client_timestamp;
            setWsLatency(roundTrip);
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
      };

      ws.onerror = () => {
        setWsStatus('disconnected');
      };
    } catch (e) {
      setWsStatus('disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
    initWebSocket();

    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ timestamp: Date.now() }));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>
              SAHAYATA AI
            </span>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              (सहायता AI)
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Multimodal Assistive Technology Platform
          </p>
        </div>

        {/* Live System Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: health ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${health ? 'var(--success)' : 'var(--error)'}`,
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
            }}
          >
            {health ? (
              <CheckCircle2 size={16} color="var(--success)" />
            ) : (
              <AlertCircle size={16} color="var(--error)" />
            )}
            <span>Backend: {health ? 'Online' : 'Offline'}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: wsStatus === 'connected' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${wsStatus === 'connected' ? 'var(--accent)' : 'var(--error)'}`,
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
            }}
          >
            <Radio size={16} color={wsStatus === 'connected' ? 'var(--accent)' : 'var(--error)'} />
            <span>WebSocket: {wsStatus} {wsLatency !== null ? `(${wsLatency}ms)` : ''}</span>
          </div>

          <button
            onClick={() => {
              checkHealth();
              initWebSocket();
            }}
            aria-label="Refresh system status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--border)',
              color: 'var(--text-primary)',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            <RefreshCw size={14} className={isChecking ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav
        aria-label="Module Navigation"
        style={{
          display: 'flex',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border)',
          padding: '0 2rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'sign', label: 'ISL Sign Assistant', icon: Hand },
          { id: 'conversation', label: 'Two-Way Conversation', icon: MessageSquare },
          { id: 'vision', label: 'Vision & OCR Assistant', icon: Eye },
          { id: 'telemetry', label: 'System & Model Metrics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.25rem',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Foundation Status Banner */}
        <section
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--accent)" />
            Phase 1 Foundation: Scaffold & Connectivity Check
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            The application foundation is initialized. Fast full-duplex communication between React and FastAPI is verified via WebSocket and REST.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Backend API</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: health ? 'var(--success)' : 'var(--error)' }}>
                {health ? 'Connected (HTTP 200)' : healthError || 'Disconnected'}
              </p>
              {health && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uptime: {health.uptime_seconds}s</span>}
            </div>

            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>WebSocket Stream</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: wsStatus === 'connected' ? 'var(--accent)' : 'var(--error)' }}>
                {wsStatus.toUpperCase()}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {wsLatency !== null ? `Roundtrip: ${wsLatency} ms` : 'Waiting for ping...'}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Compute Device</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {health?.device ? health.device.toUpperCase() : 'LOCAL CPU'}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DGX A100 / RTX 3050 ready</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target Vocabulary</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                16 Core ISL Signs
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phase 1 Dataset Dossier Ready</span>
            </div>
          </div>
        </section>

        {/* Active Tab View Placeholder */}
        <section
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          {activeTab === 'sign' && (
            <div>
              <Hand size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Indian Sign Language (ISL) Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                Webcam video stream, MediaPipe hand & pose landmark tracking, and sliding window sequence prediction will be activated in Phase 2 & 3.
              </p>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--bg-primary)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                Target vocabulary: <em>Water, Food, Washroom, Medicine, Sleep, Namaste, Thank You, Help...</em>
              </div>
            </div>
          )}

          {activeTab === 'conversation' && (
            <div>
              <MessageSquare size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Two-Way Accessible Conversation</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                High-contrast live transcript for hard-of-hearing users combined with speech recognition and speech synthesis (Phase 4).
              </p>
            </div>
          )}

          {activeTab === 'vision' && (
            <div>
              <Eye size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Vision & OCR Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Snapshot OCR for reading medicine labels & room signage + YOLOv8 spatial awareness (Phase 5).
              </p>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div>
              <BarChart3 size={48} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>System & Model Telemetry</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Live latency graphs, FPS meter, confusion matrices, and model card metrics for technical interview demonstration.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Accessible Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem 2rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}
      >
        SAHAYATA AI (सहायता AI) — Assistive Technology Prototype. Not intended as a certified medical device.
      </footer>
    </div>
  );
}
