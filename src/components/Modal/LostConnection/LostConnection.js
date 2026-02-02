import React, { useState } from "react";
import Modal from "../Modal";

const LostConnectivity = () => {
    const [isModalOpen, setModalOpening] = useState(true);
    return (
            <Modal label="Connection Lost" isDismissible={false} isModalOpen={isModalOpen} onModalChange={setModalOpening}>
                <div>You appear to have lost connection!</div>
            </Modal>
    )
}
export default LostConnectivity;