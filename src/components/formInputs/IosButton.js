import React, { Fragment } from 'react';
import "./IosButton.scss";
import PropTypes from "prop-types";

const IosButton = ({ onIOSChange, onCheckChange, label, val, disabled=false }) => {
    const { value, name, description } = val;
    const handleChange = (e) => {
        typeof onCheckChange === "function" && onCheckChange(e);
        typeof onIOSChange === "function" && onIOSChange({ value: e.target.checked, name: name, type: "checkbox" });
    }
    return (
        <Fragment>
            <div id="switchContainer" className={`switch__container flex-column ${disabled ? "disabled": ""}`}>
                <div className="switch__inner flex-row">
                   <span className="switch__title ellipsis-x1">{label}</span>
                    <div className="switch__input">
                        <input onChange={(e) => handleChange(e)} value={value} disabled={disabled} checked={value} name={name} id={name} className="switch switch--shadow" type="checkbox" />
                        <label htmlFor={name}></label>
                    </div>
                </div>
                {description && <small>{description}</small>}
            </div>
        </Fragment>
    )
}
IosButton.propTypes = {
    onIOSChange: PropTypes.func,
    onCheckChange: PropTypes.func,
    label: PropTypes.string.isRequired,
    val: PropTypes.shape({
        value: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string
    })
}
export default IosButton;