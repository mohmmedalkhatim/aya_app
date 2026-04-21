// src/screens/Dashboard/index.tsx
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Aya Health</h1>
        <p>Welcome back, Patient</p>
      </header>

      <main style={styles.content}>
        <div style={styles.card}>
          <h3>Quick Actions</h3>
          <button 
            onClick={() => navigate("/scan")} 
            style={styles.scanButton}
          >
            <span style={{ fontSize: '24px' }}>📷</span>
            <div style={{ marginLeft: '10px' }}>
              <strong>Scan Medicine</strong>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Identify & Set Reminder</div>
            </div>
          </button>
        </div>

        <div style={styles.card}>
          <h3>Your Schedule</h3>
          <p style={{ color: '#666' }}>No medications scheduled for today.</p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '30px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  scanButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '15px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    marginTop: '10px'
  }
};

export default Dashboard;