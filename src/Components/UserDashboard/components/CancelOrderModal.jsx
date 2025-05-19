import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { orderAPI } from '../../../services/api'
import { toast } from 'react-toastify'
import UserContext from '../../../shop/UserContext'
const CancelOrderModal = ({ show, toggle, orderId }) => {
    const [reason, setReason] = React.useState('')
    const [reasonErr, setReasonErr] = React.useState(false)

    const { getUserOrders } = useContext(UserContext)
    const handleConfirmCancel = async () => { 
        if (reason !== '') {
            try {

                const res = await orderAPI.cancelOrder({ id: orderId, body: {reason: reason} }) 
                setReason('')
                console.log(res.data.message)
                toast.success(res.data.message)
                getUserOrders()
                toggle()
            } catch (error) {
                console.log(error.response.data.error)
                toast.error(error.response.data.error)
                toggle()
            }
        } else {
            setReasonErr(true)
        }
    }
    return (
        <Modal
            show={show}
            onHide={toggle}
            centered
            size="md"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>Cancel Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center mb-3">
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '4rem', color: 'red' }}></i>
                </div>
                <p>Are you sure you want to cancel this order?</p>
                <div className="mb-3">
                    <label htmlFor="reason" className="form-label">Reason for cancellation <span className='text-danger'>*</span></label>
                    <textarea className={"form-control" + (reasonErr ? ' is-invalid' : '')} id="reason" rows="3" onChange={(e) => setReason(e.target.value)}></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={toggle}>Cancel</button>
                <button className="btn btn-danger" onClick={handleConfirmCancel}>Confirm</button>
            </Modal.Footer>
        </Modal>
    )
}

export default CancelOrderModal
