import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { selectTheme, notify, lowerString } from "../../utilities/tools";
import PropTypes from "prop-types";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

export default class CreatableInputOnly extends Component{
  state = {
    inputValue: '',
    value: [],
  };
  componentDidUpdate(_, prevState){
      const { value } = this.state;
    if(prevState.value !== value){
        const { getTags } = this.props;
        getTags(value?.map(el => typeof el.value === "string" ? lowerString(el.value)?.trim()?.split(" ")?.join("_") : el.value) || []);
    }
  };
  handleChange = (value) => {
    this.setState((prev)=> ({...prev, value }));
  };
  handleInputChange = (inputValue) => {
    this.setState((prev)=> ({...prev, inputValue }));
  };
  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    const { translate } = this.props;
    if (!inputValue) return;
    const lowerCasedVal = lowerString(inputValue);
    switch (event.key) {
      case 'Enter':
      case 'Tab': {
            if(!value.some(word => lowerString(word.value) === lowerCasedVal)){
                this.setState((prev)=> ({...prev,
                    inputValue: '',
                    value: [...value, createOption(lowerCasedVal)],
                }));
            }else{
                // edit this please
                notify(`${translate("alerts.already_added")}.`, "error");
            }
            event.preventDefault();
        break;
      }
      default:
    }
   
  };
  render() {
    const { inputValue, value } = this.state;
    const { placeholder } = this.props;
    return (
      <CreatableSelect
        classNamePrefix="app-select"
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        theme={selectTheme}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder={`${placeholder}...`}
        value={value}
      />
    );
  }
}
CreatableInputOnly.propTypes = {
  getTags: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  translate: PropTypes.func.isRequired
}