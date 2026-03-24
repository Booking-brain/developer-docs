import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  Key, Globe, Shield, Terminal, Copy, Plus, X,
  LogOut, User, Check, ArrowRight, RefreshCw, Eye, EyeOff, Loader2, AlertTriangle,
} from 'lucide-react';

const API_BASE = 'https://app.bookingbrain.com/api/v2';

/* ============================================================
   AUTH HELPERS
   ============================================================ */
function getStoredAuth(): { token: string; user: any } | null {
  try {
    const token = localStorage.getItem('bb_dev_token');
    const user = JSON.parse(localStorage.getItem('bb_dev_user') || 'null');
    if (token && user) return { token, user };
  } catch {}
  return null;
}

function storeAuth(token: string, user: any) {
  localStorage.setItem('bb_dev_token', token);
  localStorage.setItem('bb_dev_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('bb_dev_token');
  localStorage.removeItem('bb_dev_user');
}

async function apiCall(path: string, options: RequestInit = {}) {
  const auth = getStoredAuth();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return res.json();
}

/* ============================================================
   AUTH FORM (Register / Sign In)
   ============================================================ */
function AuthForm({ onAuth }: { onAuth: (token: string, user: any) => void }) {
  const [tab, setTab] = useState<'register' | 'signin'>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const parts = name.trim().split(' ');
      const data = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          first_name: parts[0],
          last_name: parts.slice(1).join(' ') || undefined,
          email: email.trim(),
          password,
          type: 'agent',
        }),
      });
      storeAuth(data.access_token, data.user);
      onAuth(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });
      storeAuth(data.access_token, data.user);
      onAuth(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          borderRadius: 20, background: 'var(--bb-brand-primary-light)', color: 'var(--bb-brand-primary)',
          fontSize: 13, fontWeight: 600, marginBottom: 16,
        }}>
          <Key size={14} /> Developer Portal
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', color: 'var(--ifm-heading-color)' }}>
          Get your API credentials
        </h1>
        <p style={{ fontSize: 16, color: 'var(--bb-gray-500)', maxWidth: 480, margin: '0 auto' }}>
          Register for a free developer account to generate API keys and start integrating.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
        {/* Left: Auth Form */}
        <div style={{
          background: 'var(--ifm-card-background-color, #fff)', border: '1px solid var(--bb-gray-200)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--bb-gray-200)' }}>
            {(['register', 'signin'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: '14px 0', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  background: tab === t ? 'transparent' : 'var(--bb-gray-50)',
                  color: tab === t ? 'var(--bb-brand-primary)' : 'var(--bb-gray-500)',
                  borderBottom: tab === t ? '2px solid var(--bb-brand-primary)' : '2px solid transparent',
                }}
              >
                {t === 'register' ? 'Register' : 'Sign In'}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
                borderRadius: 8, background: 'var(--bb-danger-light)', color: 'var(--bb-danger)', fontSize: 13,
              }}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            {tab === 'register' ? (
              <form onSubmit={handleRegister}>
                <FormField label="Full Name" required>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" required />
                </FormField>
                <FormField label="Email" required>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" required />
                </FormField>
                <FormField label="Website URL">
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com" />
                </FormField>
                <FormField label="Password" required>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Min 5 characters" required minLength={5}
                      style={{ paddingRight: 40 }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bb-gray-400)',
                    }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormField>
                <SubmitButton loading={loading}>Create Account</SubmitButton>
              </form>
            ) : (
              <form onSubmit={handleSignIn}>
                <FormField label="Email" required>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="jane@example.com" required />
                </FormField>
                <FormField label="Password" required>
                  <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Your password" required />
                </FormField>
                <SubmitButton loading={loading}>Sign In</SubmitButton>
              </form>
            )}
          </div>
        </div>

        {/* Right: Benefits */}
        <div style={{ paddingTop: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--ifm-heading-color)' }}>
            What you get
          </h3>
          {[
            { icon: <Key size={18} />, color: 'var(--bb-brand-primary)', title: 'API Key', desc: 'SHA256-hashed, prefix-identified credentials' },
            { icon: <Shield size={18} />, color: 'var(--bb-success)', title: 'Sandbox Access', desc: 'Test with sample data before going live' },
            { icon: <Globe size={18} />, color: 'var(--bb-warning)', title: 'Origin Whitelisting', desc: 'Restrict API access to your domains' },
            { icon: <Terminal size={18} />, color: '#7b61ff', title: 'Interactive Docs', desc: 'Try every endpoint directly from the API reference' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${item.color}12`, color: item.color, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ifm-heading-color)' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--bb-gray-500)', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 28, padding: '16px 20px', borderRadius: 10,
            background: 'var(--bb-gray-50)', border: '1px solid var(--bb-gray-200)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ifm-heading-color)', marginBottom: 4 }}>
              Free tier includes
            </div>
            <div style={{ fontSize: 13, color: 'var(--bb-gray-500)', lineHeight: 1.7 }}>
              100 requests/min &middot; All API endpoints &middot; Sandbox environment &middot; Community support
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .portal-form input[type="text"],
        .portal-form input[type="email"],
        .portal-form input[type="password"],
        .portal-form input[type="url"] {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--bb-gray-200);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: var(--ifm-background-color);
          color: var(--ifm-font-color-base);
          transition: border-color 0.15s;
        }
        .portal-form input:focus {
          outline: none;
          border-color: var(--bb-brand-primary);
          box-shadow: 0 0 0 3px var(--bb-brand-primary-light);
        }
        @media (max-width: 768px) {
          .portal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   DASHBOARD (Logged In)
   ============================================================ */
function Dashboard({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const [keyData, setKeyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchKey = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiCall('/agent/api-key/me');
      setKeyData(data);
    } catch {
      setKeyData({ exists: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKey(); }, [fetchKey]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await apiCall('/agent/api-key/generate', { method: 'POST' });
      setGeneratedKey(data.api_key);
      setKeySaved(false);
      fetchKey();
    } catch (err: any) {
      alert(err.message || 'Failed to generate key');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm('Regenerate your API key? The current key will stop working immediately.')) return;
    setGenerating(true);
    try {
      const data = await apiCall('/agent/api-key/regenerate', { method: 'POST' });
      setGeneratedKey(data.api_key);
      setKeySaved(false);
      fetchKey();
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addOrigin = async () => {
    let url = newOrigin.trim();
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    url = url.replace(/\/+$/, '');
    const current = keyData?.allowed_origins || [];
    if (current.includes(url)) return;
    setSaving(true);
    try {
      await apiCall('/agent/api-key/settings', {
        method: 'PATCH',
        body: JSON.stringify({ allowed_origins: [...current, url] }),
      });
      setNewOrigin('');
      fetchKey();
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOrigin = async (origin: string) => {
    const updated = (keyData?.allowed_origins || []).filter((o: string) => o !== origin);
    setSaving(true);
    try {
      await apiCall('/agent/api-key/settings', {
        method: 'PATCH',
        body: JSON.stringify({ allowed_origins: updated }),
      });
      fetchKey();
    } catch (err: any) {
      alert(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--bb-brand-primary)' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: 'var(--ifm-heading-color)' }}>
            Developer Portal
          </h1>
          <p style={{ fontSize: 14, color: 'var(--bb-gray-500)', margin: '4px 0 0' }}>
            Welcome back, {user?.first_name || 'Developer'}
          </p>
        </div>
        <button onClick={onSignOut} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
          border: '1px solid var(--bb-gray-200)', background: 'transparent', cursor: 'pointer',
          fontSize: 13, fontWeight: 500, color: 'var(--bb-gray-600)',
        }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Generated Key Alert */}
      {generatedKey && (
        <div style={{
          background: 'var(--bb-warning-light)', border: '2px solid #e8912d50', borderRadius: 12,
          padding: 20, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} color="var(--bb-warning)" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#92400e' }}>Save your API key now</span>
          </div>
          <p style={{ fontSize: 13, color: '#92400e', margin: '0 0 12px', opacity: 0.8 }}>
            This is the only time you'll see the full key. It cannot be recovered.
          </p>
          <div style={{
            background: '#1a1a2e', borderRadius: 8, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <code style={{ flex: 1, color: '#4ade80', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>
              {generatedKey}
            </code>
            <button onClick={() => handleCopy(generatedKey)} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6, padding: '6px 12px',
              cursor: 'pointer', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#92400e', cursor: 'pointer' }}>
              <input type="checkbox" checked={keySaved} onChange={e => setKeySaved(e.target.checked)} />
              I've saved this key securely
            </label>
            <button
              onClick={() => setGeneratedKey(null)}
              disabled={!keySaved}
              style={{
                padding: '6px 14px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: keySaved ? '#92400e' : 'var(--bb-gray-200)', color: keySaved ? '#fff' : 'var(--bb-gray-400)',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* API Key Card */}
      <Card title="API Key" icon={<Key size={16} />} accent="var(--bb-brand-primary)">
        {keyData?.exists ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  background: '#1a1a2e', borderRadius: 8, padding: '10px 16px',
                }}>
                  <code style={{ color: '#4ade80', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.5 }}>
                    {keyData.api_key_prefix}<span style={{ color: '#555' }}>••••••••••••</span>
                  </code>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                  background: keyData.is_active === 'yes' ? 'var(--bb-success-light)' : 'var(--bb-danger-light)',
                  color: keyData.is_active === 'yes' ? 'var(--bb-success)' : 'var(--bb-danger)',
                }}>
                  {keyData.is_active === 'yes' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button onClick={handleRegenerate} disabled={generating} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                border: '1px solid var(--bb-danger)', background: 'transparent', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, color: 'var(--bb-danger)',
              }}>
                <RefreshCw size={13} /> {generating ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12, color: 'var(--bb-gray-400)' }}>
              {keyData.created_at && <span>Created {new Date(keyData.created_at).toLocaleDateString()}</span>}
              {keyData.last_used_at && <span>Last used {new Date(keyData.last_used_at).toLocaleDateString()}</span>}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: 14, color: 'var(--bb-gray-500)', marginBottom: 16 }}>
              No API key yet. Generate one to start integrating.
            </p>
            <button onClick={handleGenerate} disabled={generating} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 8,
              border: 'none', background: 'var(--bb-brand-primary)', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
            }}>
              <Key size={15} /> {generating ? 'Generating...' : 'Generate API Key'}
            </button>
          </div>
        )}
      </Card>

      {/* Allowed Origins */}
      {keyData?.exists && (
        <Card title="Allowed Origins" icon={<Globe size={16} />} accent="var(--bb-warning)">
          <p style={{ fontSize: 13, color: 'var(--bb-gray-500)', marginTop: 0, marginBottom: 12 }}>
            Only API requests from these domains will be accepted.
          </p>
          {(keyData.allowed_origins || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {keyData.allowed_origins.map((origin: string) => (
                <div key={origin} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px', borderRadius: 8, background: 'var(--bb-gray-50)',
                  border: '1px solid var(--bb-gray-200)',
                }}>
                  <code style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: 'var(--ifm-font-color-base)' }}>{origin}</code>
                  <button onClick={() => removeOrigin(origin)} disabled={saving} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bb-gray-400)',
                    padding: 4, borderRadius: 4,
                  }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: 'var(--bb-warning-light)',
              color: '#92400e', fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertTriangle size={13} /> No origins set — requests accepted from any domain.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="https://yourdomain.com"
              value={newOrigin}
              onChange={e => setNewOrigin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addOrigin()}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--bb-gray-200)',
                fontSize: 13, fontFamily: 'JetBrains Mono, monospace', background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)',
              }}
            />
            <button onClick={addOrigin} disabled={saving || !newOrigin.trim()} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderRadius: 8,
              border: 'none', background: 'var(--bb-brand-primary)', color: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, opacity: !newOrigin.trim() ? 0.5 : 1,
            }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </Card>
      )}

      {/* Rate Limit */}
      {keyData?.exists && (
        <Card title="Rate Limit" icon={<Shield size={16} />} accent="var(--bb-success)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, color: 'var(--bb-gray-500)' }}>Current limit</span>
            <div>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--ifm-heading-color)' }}>{keyData.rate_limit_per_minute}</span>
              <span style={{ fontSize: 13, color: 'var(--bb-gray-400)', marginLeft: 4 }}>req/min</span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--bb-gray-400)', margin: '8px 0 0' }}>
            Contact support to increase your rate limit for production workloads.
          </p>
        </Card>
      )}

      {/* Quick Start Snippet */}
      {keyData?.exists && (
        <Card title="Quick Start" icon={<Terminal size={16} />} accent="#7b61ff">
          <div style={{
            background: '#1a1a2e', borderRadius: 8, padding: 16, overflow: 'auto',
          }}>
            <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace' }}>
              <code>
                <span style={{ color: '#6b7280' }}>{'// Search properties\n'}</span>
                <span style={{ color: '#c084fc' }}>{'const'}</span>
                <span style={{ color: '#e2e8f0' }}>{' res = '}</span>
                <span style={{ color: '#c084fc' }}>{'await'}</span>
                <span style={{ color: '#e2e8f0' }}>{' '}</span>
                <span style={{ color: '#60a5fa' }}>{'fetch'}</span>
                <span style={{ color: '#e2e8f0' }}>{'(\n'}</span>
                <span style={{ color: '#4ade80' }}>{`  'https://app.bookingbrain.com/api/v2/developer/search?place=porlock'\n`}</span>
                <span style={{ color: '#e2e8f0' }}>{'  { '}</span>
                <span style={{ color: '#60a5fa' }}>{'headers'}</span>
                <span style={{ color: '#e2e8f0' }}>{': { '}</span>
                <span style={{ color: '#4ade80' }}>{`'X-API-Key'`}</span>
                <span style={{ color: '#e2e8f0' }}>{': '}</span>
                <span style={{ color: '#4ade80' }}>{`'${keyData.api_key_prefix}...'`}</span>
                <span style={{ color: '#e2e8f0' }}>{' } }\n'}</span>
                <span style={{ color: '#e2e8f0' }}>{')'}</span>
              </code>
            </pre>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/api/booking-brain-developer-api" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: 'var(--bb-brand-primary)',
            }}>
              View full API Reference <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   SHARED UI COMPONENTS
   ============================================================ */
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="portal-form" style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ifm-font-color-base)', marginBottom: 6 }}>
        {label} {required && <span style={{ color: 'var(--bb-danger)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
      background: 'var(--bb-brand-primary)', color: '#fff', fontSize: 14, fontWeight: 700,
      cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
    }}>
      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}

function Card({ title, icon, accent, children }: { title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--ifm-card-background-color, #fff)', border: '1px solid var(--bb-gray-200)',
      borderRadius: 12, marginBottom: 20, overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--bb-gray-200)',
        display: 'flex', alignItems: 'center', gap: 8,
        borderLeft: `3px solid ${accent}`,
      }}>
        <span style={{ color: accent }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ifm-heading-color)' }}>{title}</span>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* ============================================================
   PAGE EXPORT
   ============================================================ */
export default function PortalPage() {
  const [auth, setAuth] = useState<{ token: string; user: any } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) setAuth(stored);
    setChecking(false);
  }, []);

  const handleAuth = (token: string, user: any) => {
    setAuth({ token, user });
  };

  const handleSignOut = () => {
    clearAuth();
    setAuth(null);
  };

  if (checking) return null;

  return (
    <Layout title="Developer Portal" description="Register or sign in to manage your BookingBrain API credentials">
      {auth ? (
        <Dashboard user={auth.user} onSignOut={handleSignOut} />
      ) : (
        <AuthForm onAuth={handleAuth} />
      )}
    </Layout>
  );
}
