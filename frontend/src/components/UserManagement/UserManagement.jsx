import { useEffect, useState } from 'react';
import api from '../../services/api';
import './UserManagement.css';

export default function UserManagement({ role }) {
  const isStaff = role === 'staff';
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);
  const [action, setAction] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users', { params: { role } });
      setUsers(data);
    } catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to load accounts.'); }
  };
  useEffect(() => { loadUsers(); }, [role]);

  const saveUser = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.patch(`/users/${editing.id}`, Object.fromEntries(form.entries()));
      setEditing(null); setError(''); loadUsers();
    } catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to update account.'); }
  };
  const completeAction = async (event) => {
    event.preventDefault();
    const adminPassword = new FormData(event.currentTarget).get('adminPassword');
    try {
      if (action.type === 'delete') await api.delete(`/users/${action.user.id}`, { data: { adminPassword } });
      else await api.patch(`/users/${action.user.id}`, { userStatus: 'Frozen', adminPassword });
      setAction(null); setError(''); loadUsers();
    } catch (requestError) { setError(requestError?.response?.data?.message || 'Unable to complete account action.'); }
  };
  const visibleUsers = users.filter((user) => (!status || user.userStatus === status) && `${user.fullName} ${user.email || ''} ${user.phone || ''}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="user-management">
    <div className="user-controls"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${isStaff ? 'staff' : 'customers'}`} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option>Active</option><option>Frozen</option><option>Inactive</option></select></div>
    {error && <p className="user-error">{error}</p>}
    <div className="user-list">{visibleUsers.map((user) => <article className="user-card" key={user.id}>
      <div><strong>{user.fullName}</strong><p>{user.email || user.phone || 'No contact detail'}</p><small>Joined {user.createAt ? new Date(user.createAt).toLocaleDateString() : '—'}</small></div>
      <span className={`user-status user-status--${String(user.userStatus).toLowerCase()}`}>{user.userStatus}</span>
      <div className="user-menu"><button className="user-menu-trigger" aria-label="Account actions">⋮</button><div className="user-menu-options">{isStaff && <button onClick={() => setEditing(user)}>Edit staff</button>}<button onClick={() => setAction({ user, type: 'freeze' })}>Freeze account</button><button className="delete" onClick={() => setAction({ user, type: 'delete' })}>Delete account</button></div></div>
    </article>)}</div>
    {editing && <div className="user-modal"><form onSubmit={saveUser}><h3>Edit {editing.fullName}</h3><input name="fullName" defaultValue={editing.fullName} required /><input name="email" type="email" defaultValue={editing.email || ''} /><input name="phone" defaultValue={editing.phone || ''} /><label>New staff password (optional)<input name="newPassword" type="password" minLength="8" /></label><label>Confirm with your admin password<input name="adminPassword" type="password" required /></label><div><button type="button" onClick={() => setEditing(null)}>Cancel</button><button type="submit">Save changes</button></div></form></div>}
    {action && <div className="user-modal"><form onSubmit={completeAction}><h3>{action.type === 'delete' ? 'Delete' : 'Freeze'} {action.user.fullName}?</h3><p>This action requires your admin password.</p><input name="adminPassword" type="password" placeholder="Your admin password" required autoFocus /><div><button type="button" onClick={() => setAction(null)}>Cancel</button><button className="danger" type="submit">Confirm {action.type}</button></div></form></div>}
  </div>;
}
