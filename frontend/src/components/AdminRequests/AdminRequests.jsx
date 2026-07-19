import { useEffect, useState } from 'react';
import api from '../../services/api';
import '../StaffRequests/StaffRequests.css';

const requestId = (request, kind) => kind === 'inventory'
  ? request.inventoryRequestId || request.id
  : request.productRequestId || request.id;

export default function AdminRequests({ kind }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests');
      setRequests((data[kind] || []).sort((a, b) => new Date(b.reviewedAt || b.requestedAt) - new Date(a.reviewedAt || a.requestedAt)));
      setError('');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, [kind]);

  const review = async (request, status) => {
    const note = window.prompt(`${status === 'Approved' ? 'Approve' : 'Reject'} request. Optional note:`);
    if (note === null) return;
    try {
      await api.patch(`/requests/${kind}/${requestId(request, kind)}`, { status, reviewNote: note });
      loadRequests();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to review request.');
    }
  };

  const title = kind === 'inventory' ? 'Inventory requests' : 'Product requests';
  return (
    <div className="staff-requests">
      <div className="panel-header">
        <h2>{title}</h2>
        <p>Approve requests to apply their requested catalog change, or reject them with a note.</p>
      </div>
      {error && <p className="form-error">{error}</p>}
      {loading ? <p>Loading requests...</p> : requests.length === 0 ? <p>No requests yet.</p> : (
        <div className="request-list">
          {requests.map((request) => (
            <article className="request-card" key={requestId(request, kind)}>
              <div className="request-card__header">
                <strong>{request.requestType || 'Inventory'} · {request.status}</strong>
                <span>{new Date(request.reviewedAt || request.requestedAt).toLocaleString()}</span>
              </div>
              <p><strong>Staff:</strong> {request.staff?.fullName || 'Unknown'}</p>
              <p><strong>Product:</strong> {request.product?.productName || request.productName || 'Unknown'}</p>
              {kind === 'inventory' ? (
                <p><strong>Stock:</strong> {request.currentStock} → {request.requestedStock}</p>
              ) : request.requestType === 'Price' ? (
                <p><strong>Requested price:</strong> ${Number(request.productPrice).toFixed(2)}</p>
              ) : null}
              <p><strong>Reason:</strong> {request.reason}</p>
              {request.reviewNote && <p><strong>Admin note:</strong> {request.reviewNote}</p>}
              {request.status === 'Pending' && <div className="form-actions">
                <button className="btn btn-primary" onClick={() => review(request, 'Approved')}>Approve</button>
                <button className="btn btn-secondary" onClick={() => review(request, 'Rejected')}>Reject</button>
              </div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
