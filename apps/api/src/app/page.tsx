export default function Home() {
  return (
    <main style={{
      fontFamily: 'system-ui, sans-serif',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Habla API</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Spanish learning app backend
      </p>

      <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Endpoints</h2>
      <ul style={{ lineHeight: '2' }}>
        <li><code>POST /api/auth/signup</code> - Create account</li>
        <li><code>POST /api/auth/login</code> - Sign in</li>
        <li><code>GET /api/auth/me</code> - Get current user</li>
        <li><code>GET /api/lessons</code> - List lessons</li>
        <li><code>GET /api/lessons/[id]</code> - Get lesson</li>
        <li><code>POST /api/speech/upload</code> - Upload audio</li>
        <li><code>POST /api/speech/analyze</code> - Analyze speech</li>
        <li><code>POST /api/conversation</code> - AI conversation</li>
      </ul>

      <p style={{ marginTop: '30px', color: '#22c55e' }}>
        ✓ API is running
      </p>
    </main>
  );
}
