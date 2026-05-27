import { useState } from 'react';
import { authenticateUser, registerUser } from '../utils/authUtils';
import appIcon from '../assets/MCDiet.jpeg';

const LoginPage = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email.trim(), password);
        onSuccess(email.trim());
      } else {
        const valid = await authenticateUser(email.trim(), password);
        if (!valid) {
          setError('Correo o contraseña incorrectos.');
          setLoading(false);
          return;
        }
        onSuccess(email.trim());
      }
    } catch (err) {
      setError(err.message || 'Error de autenticación.');
      setLoading(false);
    }
  };

  return (
    <div className="page-shell login-shell">
      <div className="login-card card">
        <img src={appIcon} alt="Icono de MC Diet" className="login-icon" />
        <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="run-btn" disabled={loading}>
            {loading ? 'Espere...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setError('');
            setIsRegister((current) => !current);
          }}
        >
          {isRegister ? '¿Ya tienes cuenta? Iniciar sesión' : '¿Eres nuevo? Crear cuenta'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
