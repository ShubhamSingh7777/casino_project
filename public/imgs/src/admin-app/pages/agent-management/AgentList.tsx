import React from "react"
import { toast } from "react-toastify"
import agentService, { IAgent, PERMISSION_LABELS, AgentPermission } from "../../../services/agent.service"

interface Props {
  onEditAgent: (agent: IAgent) => void
  onViewLogs: (agent: IAgent) => void
  refreshTrigger: number
}

const AgentList: React.FC<Props> = ({ onEditAgent, onViewLogs, refreshTrigger }) => {
  const [agents, setAgents] = React.useState<IAgent[]>([])
  const [loading, setLoading] = React.useState(false)
  const [togglingId, setTogglingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const limit = 20

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const res = await agentService.getAgents(page, limit)
      setAgents(res.data.data || [])
      setTotal(res.data.total || 0)
    } catch {
      toast.error("Failed to load agents")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchAgents() }, [page, refreshTrigger])

  const handleToggle = async (agent: IAgent) => {
    setTogglingId(agent._id)
    try {
      await agentService.updateAgent(agent._id, { isActive: !agent.isActive })
      toast.success(`Agent ${agent.isActive ? "disabled" : "enabled"} successfully`)
      fetchAgents()
    } catch {
      toast.error("Failed to update agent status")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (agent: IAgent) => {
    if (!window.confirm(`Delete agent "${agent.username}"?`)) return
    setDeletingId(agent._id)
    try {
      await agentService.deleteAgent(agent._id)
      toast.success("Agent deleted")
      fetchAgents()
    } catch {
      toast.error("Failed to delete agent")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString("en-IN") : "—"

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Agent List ({total})</h4>
        <button className="btn btn-sm btn-primary" onClick={fetchAgents} disabled={loading}>
          <i className="fas fa-sync-alt" /> Refresh
        </button>
      </div>
      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Permissions</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-3">No agents found.</td></tr>
                ) : agents.map((agent, idx) => (
                  <tr key={agent._id} style={{ opacity: agent.isActive ? 1 : 0.6 }}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td><b>{agent.username}</b></td>
                    <td>{agent.fullName || "—"}</td>
                    <td>{agent.phone || "—"}</td>
                    <td>
                      <span className="badge badge-info">{agent.permissions.length} permissions</span>
                      <div style={{ marginTop: 4 }}>
                        {agent.permissions.slice(0, 3).map((p) => (
                          <small key={p} className="badge badge-light mr-1">{PERMISSION_LABELS[p as AgentPermission]}</small>
                        ))}
                        {agent.permissions.length > 3 && <small className="text-muted">+{agent.permissions.length - 3} more</small>}
                      </div>
                    </td>
                    <td><small>{formatDate(agent.lastLogin)}</small></td>
                    <td>
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`toggle-${agent._id}`}
                          checked={agent.isActive}
                          onChange={() => handleToggle(agent)}
                          disabled={togglingId === agent._id}
                        />
                        <label className="custom-control-label" htmlFor={`toggle-${agent._id}`} style={{ cursor: "pointer" }}>
                          {togglingId === agent._id
                            ? <i className="fas fa-spinner fa-spin" />
                            : <span className={agent.isActive ? "text-success" : "text-danger"}>{agent.isActive ? "Active" : "Disabled"}</span>
                          }
                        </label>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning mr-1" onClick={() => onEditAgent(agent)} title="Edit"><i className="fas fa-edit" /></button>
                      <button className="btn btn-sm btn-info mr-1" onClick={() => onViewLogs(agent)} title="Logs"><i className="fas fa-history" /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(agent)} disabled={deletingId === agent._id} title="Delete">
                        {deletingId === agent._id ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-trash" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {total > limit && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</small>
          <div>
            <button className="btn btn-sm btn-outline-secondary mr-2" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentList
