import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import IBet from '../../../models/IBet'
import userService from '../../../services/user.service'
import betService from '../../../services/bet.service'
import { CONSTANTS } from '../../../utils/constants'

interface Props {
  show: boolean
  onHide: () => void
  bet: IBet | null
  onUpdate: () => void
}

const EditSettledBetModal: React.FC<Props> = ({ show, onHide, bet, onUpdate }) => {
  const [isBack, setIsBack] = useState(bet?.isBack)
  const [selection, setSelection] = useState(bet?.selectionId?.toString())
  const [runners, setRunners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const isCasino = bet ? (!bet.sportId || !CONSTANTS.SPORT_NAME.find((s: any) => s.id === bet.sportId?.toString())) : false

  useEffect(() => {
    if (show && bet) {
      setIsBack(bet.isBack)
      setSelection(bet.selectionId?.toString())
      fetchRunners()
    }
  }, [show, bet])

  const fetchRunners = async () => {
    if (!bet) return
    try {
      if (bet.marketName !== 'Fancy') {
        // Assume userService.getMarketRunners exists or betService has it
        const response = await userService.getMarketRunners(
          bet.marketId, 
          bet.sportId?.toString() || '', 
          bet.marketName, 
          bet.gtype, 
          bet.matchId?.toString()
        )
        if (response?.data?.data?.runners) {
          setRunners(response.data.data.runners)
        }
      }
    } catch (error) {
      console.error('Error fetching runners', error)
    }
  }

  const handleSave = async () => {
    if (!bet) return
    try {
      setLoading(true)
      let selectionName = bet.selectionName
      let selId = selection ? parseInt(selection) : bet.selectionId
      let marketName = bet.marketName
      
      if (runners.length > 0) {
        const selectedRunner = runners.find(r => 
          r.selectionId?.toString() === selection || 
          r.id?.toString() === selection || 
          r.sid?.toString() === selection || 
          r.SelectionId?.toString() === selection ||
          r.i?.toString() === selection
        )
        if (selectedRunner) {
          selectionName = selectedRunner.runnerName || selectedRunner.name || selectedRunner.RunnerName || selectedRunner.nat || selectedRunner.nation
          selId = selectedRunner.selectionId || selectedRunner.id || selectedRunner.sid || selectedRunner.SelectionId || selectedRunner.i
          if (selectedRunner.MarketName) {
            marketName = selectedRunner.MarketName
          }
        }
      }

      const payload = {
        id: (bet as any)._id,
        isBack: isBack,
        selectionId: selId,
        selectionName: selectionName,
        marketName: marketName,
      }

      await betService.updateSettledBet(payload)
      onUpdate()
      onHide()
    } catch (error) {
      console.error('Error updating bet', error)
    } finally {
      setLoading(false)
    }
  }

  if (!bet) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Settled Bet (Process as Loss)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {!isCasino && (
            <Form.Group className="mb-3">
              <Form.Label>Type (Back/Lay)</Form.Label>
              <Form.Select value={isBack ? 'true' : 'false'} onChange={(e) => setIsBack(e.target.value === 'true')}>
                <option value="true">Back (Yes)</option>
                <option value="false">Lay (No)</option>
              </Form.Select>
            </Form.Group>
          )}
          {bet?.marketName !== 'Fancy' && runners.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Selection (Runner)</Form.Label>
              <Form.Select value={selection} onChange={(e) => setSelection(e.target.value)}>
                {runners.map((r, i) => {
                  const rId = r.selectionId || r.id || r.sid || r.SelectionId || r.i
                  const rName = r.runnerName || r.name || r.RunnerName || r.nat || r.nation
                  return (
                    <option key={i} value={rId?.toString()}>
                      {rName}
                    </option>
                  )
                })}
              </Form.Select>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditSettledBetModal

