import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react'; // Importa useAuth si aún no lo has hecho

const AddJobForm = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth(); // Obtén isLoaded y isSignedIn
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false); // Nuevo estado para controlar si se puede enviar
  const backendUrlLocal = 'http://localhost:3000';

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setTimeout(() => {
        setCanSubmit(true);
      }, 100); // Pequeño retraso (ajusta si es necesario)
    } else {
      setCanSubmit(false);
    }
  }, [isLoaded, isSignedIn]);

  const handleSubmitWithTimeout = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!canSubmit) {
      setError("Authentication not ready. Please wait...");
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${backendUrlLocal}/api/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ company, role, status, date, link }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to add job: ${response.status} - ${errorData?.message || response.statusText}`);
        }

        const newJob = await response.json();
        console.log('Job added successfully:', newJob);
        setCompany('');
        setRole('');
        setStatus('');
        setDate('');
        setLink('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500); // Espera 500 milisegundos (ajusta según sea necesario)
  }, [getToken, backendUrlLocal, canSubmit]);

  return (
    <form onSubmit={handleSubmitWithTimeout}>
      <h2>Add New Job Application</h2>

      <div>
        <label htmlFor="company">Company:</label>
        <input
          type="text"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="link">Link:</label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading || !canSubmit}>
        {loading ? 'Adding Application...' : 'Add Application'}
      </button>

      {!canSubmit && !loading && <p style={{ color: 'orange' }}>Authentication loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </form>
  );
};

export default AddJobForm;