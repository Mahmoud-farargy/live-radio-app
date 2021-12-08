import React, { useEffect }from 'react';
import ModalPKG from "react-modal";
import Auxiliary from '../HOC/Auxiliary';
import PropTypes from "prop-types";

const Modal = ({label, isDismissible, isModalOpen, onModalChange, children}) =>{
    const customStyles = {
        content : {
          position              : "fixed",
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)',
          overflow              : "hidden",
          minHeight             : "100px"
        }
      };
    useEffect (() => {
        document.body.style.overflow = "hidden";
        return () => {
         document.body.style.overflow = "visible";
        };
    }, []);
    const closeModal = () => {
        if(isDismissible && typeof onModalChange === "function"){
            onModalChange(false);
        }
    }
    return (
        <Auxiliary>
            <div id="modal">
                <ModalPKG
                    ariaHideApp={false}
                    isOpen={isModalOpen}
                    style={customStyles}
                    contentLabel={label}
                    onRequestClose={() => closeModal()}
                    >
                    <header className="modal__header">
                        <strong>{label}</strong>
                        {isDismissible && <span className="close__modal__btn" onClick={() => closeModal()}>&times;</span>}
                    </header>
                    <article className="modal--inner">
                        {children}
                    </article>
                </ModalPKG>
            </div>
        </Auxiliary>
    )
}
Modal.propTypes = {
    label: PropTypes.string,
    isDismissible: PropTypes.bool,
    isModalOpen: PropTypes.bool.isRequired,
    onModalChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}
Modal.defaultProps = {
    label: "",
    isDismissible: true,
    isModalOpen: false,
}
export default Modal;