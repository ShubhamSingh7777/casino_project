import React from "react"
import { toast } from "react-toastify"
import agentService, {
  IAgent,
  AGENT_PERMISSIONS,
  PERMISSION_LABELS,
  AgentPermission,
} from "../../../services/agent.service"

interface Props {
  editAgent: IAgent | null
  onSaved: () => void
  onCancel: () => void
}

const EMPTY_FORM = {
  username: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phone: "",
  permissions: [] as AgentPermission[],
}

const CreateAgent: React.FC<Props> = ({ editAgent, onSaved, onCancel }) => {
  const isEdit = !!editAgent

  const [form, setForm] = React.useState({ ...EMPTY_FORM })
  const [saving, setSaving] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  // Populate form when editing
  React.useEffect(() => {
    if (editAgent) {
      setForm({
        username: editAgent.username,
        password: "",
        confirmPassword: "",
        fullName: editAgent.fullName || "",
        phone: editAgent.phone || "",
        permissions: [...editAgent.permissions],
      })
    } else {
      setForm({ ...EMPTY_FORM })
    }
  }, [editAgent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const togglePermission = (perm: AgentPermission) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }))
  }

  const selectAll = () => setForm((f) => ({ ...f, permissions: [...AGENT_PERMISSIONS] }))
  const clearAll = () => setForm((f) => ({ ...f, permissions: [] }))

  const validate = (): string | null => {
    if (!isEdit && !form.username.trim()) return "Username is required"
    if (!isEdit && form.username.trim().length < 3) return "Username must be at least 3 characters"
    if (!isEdit && !form.password) return "Password is required"
    if (!isEdit && form.password.length < 6) return "Password must be at least 6 characters"
    if (!isEdit && form.password !== form.confirmPassword) return "Passwords do not match"
    if (isEdit && form.password && form.password.length < 6) return "New password must be at least 6 characters"
    if (isEdit && form.password && form.password !== form.confirmPassword) return "Passwords do not match"
    if (form.permissions.length === 0) return "Please select at least one permission"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        const payload: any = {
          fullName: form.fullName,
          phone: form.phone,
          permissions: form.permissions,
        }
        if (form.password) payload.password = form.password
        await agentService.updateAgent(editAgent!._id, payload)
        toast.success("Agent updated successfully!")
      } else {
        await agentService.createAgent({
          username: form.username.trim(),
          password: form.password,
          fullName: form.fullName,
          phone: form.phone,
          permissions: form.permissions,
        })
        toast.success("Agent created successfully!")
      }
      onSaved()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (isEdit ? "Failed to update agent" : "Failed to create agent")
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          <i className={`fas ${isEdit ? "fa-user-edit" : "fa-user-plus"} mr-2`} />
          {isEdit ? `Edit Agent — ${editAgent?.username}` : "Create New Agent"}
        </h4>
        <button className="btn btn-sm btn-secondary" onClick={onCancel}>
          <i className="fas fa-times mr-1" /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="row">
            {/* Left Column: Basic Info */}
            <div className="col-md-5">
              <h6 className="text-muted mb-3" style={{ textTransform: "uppercase", letterSpacing: 1, fontSize: 11 }}>
                <i className="fas fa-info-circle mr-1" /> Basic Information
              </h6>

              {/* Username */}
              <div className="form-group">
                <label>
                  Username <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user" />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="e.g. agent_ravi"
                    value={form.username}
                    onChange={handleChange}
                    disabled={isEdit}
                    autoComplete="off"
                  />
                </div>
                {isEdit && <small className="text-muted">Username cannot be changed after creation.</small>}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-id-card" />
                    </span>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="e.g. Ravi Kumar"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-phone" />
                    </span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>
                  {isEdit ? "New Password" : "Password"}{" "}
                  {!isEdit && <span className="text-danger">*</span>}
                  {isEdit && <small className="text-muted">(leave blank to keep unchanged)</small>}
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-lock" />
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder={isEdit ? "Leave blank to keep current password" : "Min 6 characters"}
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label>
                  Confirm Password{" "}
                  {!isEdit && <span className="text-danger">*</span>}
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-lock" />
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                  <small className="text-danger">
                    <i className="fas fa-exclamation-triangle mr-1" />
                    Passwords do not match
                  </small>
                )}
                {form.password && form.confirmPassword && form.password === form.confirmPassword && (
                  <small className="text-success">
                    <i className="fas fa-check-circle mr-1" />
                    Passwords match
                  </small>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="col-md-1 d-none d-md-flex justify-content-center">
              <div style={{ width: 1, background: "#dee2e6", minHeight: "100%" }} />
            </div>

            {/* Right Column: Permissions */}
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-muted mb-0" style={{ textTransform: "uppercase", letterSpacing: 1, fontSize: 11 }}>
                  <i className="fas fa-shield-alt mr-1" /> Permissions{" "}
                  <span className="text-danger">*</span>
                </h6>
                <div>
                  <button type="button" className="btn btn-xs btn-outline-success mr-1" onClick={selectAll} style={{ fontSize: 11, padding: "2px 8px" }}>
                    Select All
                  </button>
                  <button type="button" className="btn btn-xs btn-outline-danger" onClick={clearAll} style={{ fontSize: 11, padding: "2px 8px" }}>
                    Clear All
                  </button>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: 6,
                  padding: "12px 16px",
                  maxHeight: 380,
                  overflowY: "auto",
                  background: "#f9f9f9",
                }}
              >
                {AGENT_PERMISSIONS.map((perm) => {
                  const checked = form.permissions.includes(perm)
                  return (
                    <div
                      key={perm}
                      className="d-flex align-items-center mb-2 p-2"
                      style={{
                        background: checked ? "#e8f5e9" : "#fff",
                        border: `1px solid ${checked ? "#a5d6a7" : "#e0e0e0"}`,
                        borderRadius: 5,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onClick={() => togglePermission(perm)}
                    >
                      <div className="custom-control custom-checkbox mb-0" style={{ pointerEvents: "none" }}>
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`perm-${perm}`}
                          checked={checked}
                          onChange={() => {}} // handled by parent onClick
                        />
                        <label className="custom-control-label" htmlFor={`perm-${perm}`} style={{ cursor: "pointer" }}>
                          <span style={{ fontWeight: checked ? 600 : 400, color: checked ? "#2e7d32" : "#333" }}>
                            {PERMISSION_LABELS[perm]}
                          </span>
                          <br />
                          <small className="text-muted" style={{ fontWeight: 400 }}>
                            {perm}
                          </small>
                        </label>
                      </div>
                      {checked && (
                        <i
                          className="fas fa-check-circle ml-auto"
                          style={{ color: "#43a047", fontSize: 16 }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <small className="text-muted d-block mt-2">
                <i className="fas fa-info-circle mr-1" />
                {form.permissions.length} of {AGENT_PERMISSIONS.length} permissions selected
              </small>
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end">
          <button type="button" className="btn btn-secondary mr-2" onClick={onCancel} disabled={saving}>
            <i className="fas fa-times mr-1" /> Cancel
          </button>
          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1" /> Saving...
              </>
            ) : (
              <>
                <i className={`fas ${isEdit ? "fa-save" : "fa-user-plus"} mr-1`} />
                {isEdit ? "Save Changes" : "Create Agent"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAgent
