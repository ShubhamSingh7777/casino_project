import React from "react"
import CreateAgent from "./CreateAgent"
import AgentList from "./AgentList"
import AgentLogs from "./AgentLogs"
import { IAgent } from "../../../services/agent.service"

type Tab = "list" | "create" | "logs"

const AgentManagement = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("list")
  const [editAgent, setEditAgent] = React.useState<IAgent | null>(null)
  const [logAgent, setLogAgent] = React.useState<IAgent | null>(null)
  const [refreshKey, setRefreshKey] = React.useState(0)

  const handleEditAgent = (agent: IAgent) => {
    setEditAgent(agent)
    setActiveTab("create")
  }

  const handleViewLogs = (agent: IAgent) => {
    setLogAgent(agent)
    setActiveTab("logs")
  }

  const handleSaved = () => {
    setEditAgent(null)
    setRefreshKey((k) => k + 1)
    setActiveTab("list")
  }

  const handleCancel = () => {
    setEditAgent(null)
    setActiveTab("list")
  }

  const handleTabChange = (tab: Tab) => {
    if (tab !== "create") setEditAgent(null)
    if (tab !== "logs") setLogAgent(null)
    setActiveTab(tab)
  }

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          {/* Page Title */}
          <div className="d-flex align-items-center mb-3">
            <h3 className="mb-0 mr-3">
              <i className="fas fa-user-shield mr-2" style={{ color: "#e74c3c" }} />
              Agent Management
            </h3>
            <span className="badge badge-danger">SuperAdmin Only</span>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-0">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "list" ? "active" : ""}`}
                onClick={() => handleTabChange("list")}
              >
                <i className="fas fa-list mr-1" /> Agent List
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                onClick={() => handleTabChange("create")}
              >
                <i className="fas fa-plus mr-1" /> {editAgent ? "Edit Agent" : "Create Agent"}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "logs" ? "active" : ""}`}
                onClick={() => handleTabChange("logs")}
              >
                <i className="fas fa-history mr-1" /> Activity Logs
                {logAgent && <span className="badge badge-info ml-1">{logAgent.username}</span>}
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content" style={{ borderTop: "none" }}>
            {activeTab === "list" && (
              <AgentList
                onEditAgent={handleEditAgent}
                onViewLogs={handleViewLogs}
                refreshTrigger={refreshKey}
              />
            )}

            {activeTab === "create" && (
              <CreateAgent
                editAgent={editAgent}
                onSaved={handleSaved}
                onCancel={handleCancel}
              />
            )}

            {activeTab === "logs" && (
              <AgentLogs
                filterAgent={logAgent}
                onBack={() => handleTabChange("list")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentManagement
