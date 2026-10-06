import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import User, { RoleType } from '../../../models/User';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import moment from 'moment';
import api from '../../../utils/api';

const SystemLogs = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    type: '',
    level: '',
    userId: ''
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
  }, [filters.startDate, filters.endDate, filters.type, filters.level]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('admin/logs', { params: filters });
      setLogs(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (userState.user.role !== RoleType.admin && userState.user.role !== RoleType.sadmin) {
    return <div className="p-4 text-danger">Unauthorized Access</div>;
  }

  return (
    <div className="container-fluid mt-3">
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">System & Activity Logs</h5>
          <button className="btn btn-sm btn-primary" onClick={fetchLogs}>
            <i className="fa fa-refresh"></i> Refresh
          </button>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-2">
              <label>From Date</label>
              <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label>To Date</label>
              <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
            </div>
            <div className="col-md-3">
              <label>Log Type</label>
              <select className="form-control" name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="ADMIN_ACTIVITY">Admin Activity</option>
                <option value="SOCKET_ERROR">Socket Error</option>
                <option value="API_ERROR">API Error</option>
                <option value="SYSTEM">System Event</option>
              </select>
            </div>
            <div className="col-md-2">
              <label>Level</label>
              <select className="form-control" name="level" value={filters.level} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="col-md-3">
              <label>User / Agent</label>
              <input type="text" className="form-control" name="userId" placeholder="Search Username..." value={filters.userId} onChange={handleFilterChange} onBlur={fetchLogs} />
            </div>
          </div>

          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Date & Time</th>
                  <th>Level</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center">Loading logs...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">No logs found</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td>{moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                      <td>
                        <span className={`badge ${log.level === 'error' ? 'badge-danger' : log.level === 'warn' ? 'badge-warning' : 'badge-info'}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td>{log.type}</td>
                      <td>{log.userId}</td>
                      <td>{log.message}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-info" onClick={() => setSelectedLog(log)}>
                          <i className="fa fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Metadata Modal */}
      {selectedLog && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log Metadata</h5>
                <button type="button" className="close" onClick={() => setSelectedLog(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <pre className="bg-dark text-success p-3 rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedLog(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;
