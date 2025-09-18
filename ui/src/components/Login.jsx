import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility functions for WebAuthn
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
function base64ToBuffer(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Mapping student names to IDs
const studentNameToId = {
  ram: '6860a7d73e37efa4d390b662',
  manish: '6860a7e33e37efa4d390b664',
  raghav: '6860a7f73e37efa4d390b666'
};

// Redirect paths for admin and ce
const ROLE_PATHS = {
  admin: '/dashboard',
  ce: '/ce-dashboard'
};

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Register or Login using Face ID or biometrics.');
  const [role, setRole] = useState('admin');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  // Camera preview ref
  const videoRef = useRef(null);

  // Start camera preview when component mounts
  useEffect(() => {
    if (navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(() => {
          setMessage('Camera not accessible. Face ID may not work.');
        });
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // WebAuthn registration options
  const makeCredentialOptions = {
    publicKey: {
      challenge: Uint8Array.from('faceLoginDemo123', c => c.charCodeAt(0)),
      rp: { name: "FaceLogin Demo App" },
      user: {
        id: Uint8Array.from('demoUserId', c => c.charCodeAt(0)),
        name: "demoUser",
        displayName: "Demo User"
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      timeout: 60000,
      attestation: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      }
    }
  };
  const getAssertionOptions = {
    publicKey: {
      challenge: Uint8Array.from('faceLoginDemo123', c => c.charCodeAt(0)),
      timeout: 60000,
      allowCredentials: [],
      userVerification: "required"
    }
  };

  // Register biometric credential
  const handleRegister = async () => {
    setLoading(true);
    setMessage('Requesting registration...');
    try {
      const credential = await navigator.credentials.create(makeCredentialOptions);
      if (!credential) {
        setMessage('Registration failed: permission not granted.');
        setLoading(false);
        return;
      }
      const rawId = bufferToBase64(credential.rawId);
      const clientDataJSON = bufferToBase64(credential.response.clientDataJSON);
      const attestationObject = bufferToBase64(credential.response.attestationObject);
      localStorage.setItem('faceLogin_credentialId', rawId);
      localStorage.setItem('faceLogin_attestationObject', attestationObject);
      localStorage.setItem('faceLogin_clientDataJSON', clientDataJSON);
      setMessage('🎉 Registered successfully! You can now login using Face ID.');
    } catch (err) {
      setMessage('❌ Error during registration: ' + err.message);
    }
    setLoading(false);
  };

  // Authenticate with face login
  const handleLogin = async () => {
    setLoading(true);
    setMessage('Authenticating...');
    try {
      const credentialId = localStorage.getItem('faceLogin_credentialId');
      if (!credentialId) {
        setMessage('⚠️ No credential found. Please register first.');
        setLoading(false);
        return;
      }
      getAssertionOptions.publicKey.allowCredentials = [{
        type: 'public-key',
        id: base64ToBuffer(credentialId)
      }];
      const assertion = await navigator.credentials.get(getAssertionOptions);
      if (!assertion) {
        setMessage('❌ Authentication cancelled.');
        setLoading(false);
        return;
      }

      // --- REDIRECT BASED ON ROLE ---
      if (role === "student") {
        const key = studentName.trim().toLowerCase();
        const studentId = studentNameToId[key];
        if (studentId) {
          setMessage(`✅ Face Login Successful! Redirecting to Student: ${studentName}`);
          setTimeout(() => {
            navigate(`/student/${studentId}`);
          }, 1200);
        } else {
          setMessage("❌ Please enter a valid student name: Ram, Manish, or Raghav.");
          setLoading(false);
          return;
        }
      } else {
        setMessage('✅ Face Login Successful! Redirecting...');
        setTimeout(() => {
          navigate(ROLE_PATHS[role]);
        }, 1200);
      }
    } catch (err) {
      setMessage('❌ Login error: ' + err.message);
    }
    setLoading(false);
  };

  if (!window.PublicKeyCredential) {
    return <p>Your browser does not support Face ID login (WebAuthn).</p>;
  }

  return (
    <div style={containerStyle}>
      <h2>Face Login Demo</h2>
      {/* Camera Preview */}
      <div style={cameraWrapperStyle}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', background: '#333' }}
          muted
        />
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Camera Preview</div>
      </div>

      {/* Role dropdown */}
      <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle} disabled={loading}>
        <option value="admin">Admin</option>
        <option value="ce">CE</option>
        <option value="student">Student</option>
      </select>
      <div style={{ fontSize: 13, margin: "4px 0 8px", color: '#03603a' }}>
        Selected Role: <b>{role}</b>
      </div>

      {/* Student name text field only if role is student */}
      {role === "student" && (
        <input
          type="text"
          value={studentName}
          onChange={e => setStudentName(e.target.value)}
          placeholder="Enter student name (Ram, Manish, Raghav)"
          style={{
            margin: '8px 0 12px',
            padding: '8px 14px',
            borderRadius: '7px',
            fontSize: '15px',
            border: '1px solid #86efac',
            background: '#fff'
          }}
          disabled={loading}
        />
      )}

      <p style={msgStyle}>{message}</p>

      <button onClick={handleRegister} style={buttonStyle} disabled={loading}>
        👤 Register Face ID / Biometric
      </button>
      <button onClick={handleLogin} style={buttonStyle} disabled={loading}>
        🔓 Login with Face ID
      </button>

      <p style={{ fontSize: 12, marginTop: 18, color: '#888' }}>
        * Works on devices with Face ID or Windows Hello Face (HTTPS or localhost required).
      </p>
    </div>
  );
};

// --- Styling ---
const containerStyle = {
  maxWidth: '400px',
  margin: '3rem auto',
  padding: '2rem',
  textAlign: 'center',
  background: '#F0FDF4',
  borderRadius: '14px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.10)',
  fontFamily: 'Arial'
};
const cameraWrapperStyle = {
  margin: '0 auto 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};
const buttonStyle = {
  padding: '12px 24px',
  margin: '8px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#2E7D32',
  color: 'white'
};
const selectStyle = {
  margin: '6px 0 0',
  padding: '7px 13px',
  borderRadius: '6px',
  fontSize: '15px',
  border: '1px solid #86efac',
  background: '#fff'
};
const msgStyle = {
  margin: '1rem 0',
  color: '#2E7D32',
  fontWeight: 'bold',
  minHeight: 36,
};

export default Login;
