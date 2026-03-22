'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/axios';

export default function DebugPage() {
  const [info, setInfo] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<string>('idle');

  useEffect(() => {
    setInfo({
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '(not set)',
      axiosBaseURL: apiClient.defaults.baseURL,
      windowOrigin: window.location.origin,
      expectedProxyURL: window.location.origin + '/api/v2',
      proxyCorrect:
        apiClient.defaults.baseURL === '/api/v2' ||
        apiClient.defaults.baseURL === window.location.origin + '/api/v2',
    });
  }, []);

  async function testSignin() {
    setTestResult('loading...');
    try {
      const res = await apiClient.post('/auth/signin', {
        email: 'test@test.com',
        password: 'wrongpassword',
      });
      setTestResult(JSON.stringify({ status: res.status, data: res.data }, null, 2));
    } catch (e: any) {
      setTestResult(JSON.stringify({
        status: e?.response?.status,
        data: e?.response?.data,
        requestURL: e?.config?.url,
        baseURL: e?.config?.baseURL,
        fullURL: (e?.config?.baseURL ?? '') + (e?.config?.url ?? ''),
      }, null, 2));
    }
  }

  async function testCookies() {
    setTestResult('loading...');
    try {
      // Try hitting a protected endpoint to see if cookies are being sent
      const res = await apiClient.get('/auth/me');
      setTestResult(JSON.stringify({ status: res.status, data: res.data }, null, 2));
    } catch (e: any) {
      setTestResult(JSON.stringify({
        status: e?.response?.status,
        message: e?.response?.data?.message,
        requestURL: e?.config?.url,
        fullURL: (e?.config?.baseURL ?? '') + (e?.config?.url ?? ''),
        withCredentials: e?.config?.withCredentials,
      }, null, 2));
    }
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: 32, maxWidth: 800 }}>
      <h2>🔍 Auth Debug Panel</h2>

      <h3>Environment</h3>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {Object.entries(info).map(([k, v]) => (
            <tr key={k} style={{ background: k === 'proxyCorrect' ? (v ? '#d4edda' : '#f8d7da') : 'transparent' }}>
              <td><strong>{k}</strong></td>
              <td>{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Cookie check (open DevTools → Application → Cookies)</h3>
      <p>
        Cookies must be under <strong>{typeof window !== 'undefined' ? window.location.hostname : '...'}</strong>,
        NOT under <code>classflow-prime-server.vercel.app</code>
      </p>

      <h3>Live tests</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={testSignin} style={{ padding: '8px 16px' }}>
          Test POST /auth/signin
        </button>
        <button onClick={testCookies} style={{ padding: '8px 16px' }}>
          Test GET /auth/me (needs cookie)
        </button>
      </div>

      <pre style={{
        background: '#1e1e1e', color: '#d4d4d4',
        padding: 16, borderRadius: 8, overflow: 'auto', minHeight: 120
      }}>
        {testResult}
      </pre>

      <h3>What the request URL should look like</h3>
      <pre style={{ background: '#f0f0f0', padding: 12, borderRadius: 6 }}>
{`✅ CORRECT:   https://classflow-prime.vercel.app/api/v2/auth/signin
❌ WRONG:     https://classflow-prime-server.vercel.app/api/v2/auth/signin

If you see the WRONG url above, the env var is overriding the proxy.`}
      </pre>
    </div>
  );
}