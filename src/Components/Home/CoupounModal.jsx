import React, { useEffect, useContext } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import coverImage from '../../assets/images/scratch-img.png';
import ScratchCard, { CUSTOM_BRUSH_PRESET } from "react-scratchcard-v2";
import CouponContext from '../../shop/CouponContext';

const x = CUSTOM_BRUSH_PRESET;
const CoupounModal = ({ showModal, toggle }) => {
    const {  qrCode, isLoading } = useContext(CouponContext);
    const ref = React.createRef();
    

    useEffect(() => {
        // Update the document title using the browser API
    });
    return (
        <Modal
            show={showModal}
            onHide={toggle}
            className='coupon-modal'
            centered
            
        >
            <Modal.Header closeButton>
                <Modal.Title>Get Coupoun</Modal.Title>
            </Modal.Header>
            <Modal.Body className=''>
                {!isLoading ? <ScratchCard
                    ref={ref}
                    width={400}
                    height={400}
                    image={coverImage}
                    finishPercent={35}
                    onComplete={() => console.log("complete")}
                    brushSize={25}
                    customBrush={x}
                >
                    {qrCode && <div
                        style={{
                            display: "flex",
                            top: "20px",
                            width: "65%",
                            height: "80%",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            textAlign: "center",
                            margin: "0 auto",
                        }}
                    >
                        <img src={qrCode.qrLink || ""} alt="qrCode" className='w-100 h-100 ' />
                        <p className=' fw-bold'><span className='fst-italic text-success'>Congratulations!</span><br /> Save Coupon code to use when checking out</p>
                    </div>}
                </ScratchCard> : <Spinner animation="border" variant="primary" />}
            </Modal.Body>
            
        </Modal>
    )
}

export default CoupounModal