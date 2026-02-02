import React, { useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { createPortal } from "react-dom"

const modalRoot =
  document.getElementById("modal-root") ||
  (() => {
    const el = document.createElement("div")
    el.id = "modal-root"
    document.body.appendChild(el)
    return el
  })()

const Modal = ({
  label = "",
  isDismissible = true,
  isModalOpen,
  onModalChange,
  children,
}) => {
  const closeModal = useCallback(() => {
    if (isDismissible && typeof onModalChange === "function") {
      onModalChange(false)
    }
  }, [isDismissible, onModalChange])

  useEffect(() => {
    if (!isModalOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isModalOpen])

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, closeModal])

  if (!isModalOpen) return null

  return createPortal(
    <div id="modal">
      <div className="modal-backdrop" onClick={closeModal}>
        <div
          className="modal-container"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="modal-header">
            <strong className="modal-title ellipsis-x1">{label}</strong>
            {isDismissible && (
              <button
                className="modal-close"
                aria-label="Close modal"
                onClick={closeModal}
              >
                ×
              </button>
            )}
          </header>

          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}

Modal.propTypes = {
  label: PropTypes.string,
  isDismissible: PropTypes.bool,
  isModalOpen: PropTypes.bool.isRequired,
  onModalChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default Modal
