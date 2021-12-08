import React, { useState } from "react";
import Modal from "../Modal";

const LostConnectivity = () => {
    const [isModalOpen, setModalOpenning] = useState(true);
    return (
            <Modal label="Connection Lost" isDismissible={false} isModalOpen={isModalOpen} onModalChange={setModalOpenning}>
                <div>You appear to have lost connection!</div>
            </Modal>
    )
}
export default LostConnectivity;