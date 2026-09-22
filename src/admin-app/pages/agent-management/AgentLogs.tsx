import React from "react"
import { toast } from "react-toastify"
import agentService, { IAgent, IAgentLog } from "../../../services/agent.service"

interface Props {
  filterAgent?: IAgent | null
  onBack?: () => void
}

const AgentLogs: React.FC<Props> = ({ filterAgent, onBack }) => {
  const today = new Date().toISOString().split("T")[0]
  const [logs, setLogs] = React.useState<IAgentLog[]>([])
  const [loading, setLoading] = React.useState(false)
  const [total, setTotal] = React.useState(0)
  const [filters, setFilters] = React.useState({
    agentId: filterAgent?._id || "",
    from: today,
    to: today,
    action: "",
    page: 1,
  })
  const limit = 50

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await agentService.getAgentLogs({ ...filters, limit })
      setLogs(res.data.data || [])
      setTotal(res.data.total || 0)
    } catch {
      toast.error("Failed to load logs")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchLogs() }, [filters.page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, page: 1 }))
    fetchLogs()
  }

  const formatDate = (d: string) => new Date(d).toLocaleString("en-IN")

  const actionBadgeColor: Record<string, string> = {
    LOGIN: "badge-primary",
    LOGOUT: "badge-secondary",
    VIEW: "badge-info",
    UPDATE: "badge-warning",
    CREATE: "badge-success",
    DELETE: "badge-danger",
    APPROVE: "badge-success",
    REJECT: "badge-danger",
  }

  const getBadge = (action: string) => {
    const key = Object.keys(actionBadgeColor).find((k) => action.includes(k)) || ""
    return actionBadgeColor[key] || "badge-secondary"
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          {filterAgent ? `Agent Logs — ${filterAgent.username}` : "All Agent Activity Logs"}
        </h4>
        {onBack && (
          <button className="btn btn-sm btn-secondary" onClick={onBack}>
            ← Back to List
          </button>
        )}
      </div>
      <div className="card-body">
        {/* Filters */}
        <form onSubmit={handleSearch} className="row mb-3">
          <div className="col-md-2">
            <label className="form-label"><small>From Date</small></label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label"><small>To Date</small></label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label"><small>Action Type</small></label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. LOGIN, VIEW, UPDATE"
              value={filters.action}
              onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value.toUpperCase() }))}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-sm btn-primary w-100" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-search" />} Search
            </button>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={() => {
                setFilters({ agentId: filterAgent?._id || "", from: today, to: today, action: "", page: 1 })
                setTimeout(fetchLogs, 100)
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-sm table-hover mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>Agent</th>
                  <th>Section</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Target User</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-3">No logs found for selected filters.</td></tr>
                ) : logs.map((log, idx) => (
                  <tr key={log._id}>
                    <td>{(filters.page - 1) * limit + idx + 1}</td>
                    <td><small>{formatDate(log.createdAt)}</small></td>
                    <td><b>{log.agentUsername}</b></td>
                    <td><small className="badge badge-light">{log.section}</small></td>
                    <td><span className={`badge ${getBadge(log.action)}`}>{log.action}</span></td>
                    <td><small>{log.description}</small></td>
                    <td><small>{log.targetUser || "—"}</small></td>
                    <td><small>{log.ip || "—"}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      {total > limit && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>Showing {(filters.page - 1) * limit + 1}–{Math.min(filters.page * limit, total)} of {total} logs</small>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary mr-2"
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page === 1}
            >Prev</button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page * limit >= total}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentLogs
