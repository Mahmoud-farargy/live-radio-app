import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { selectTheme } from "../../utilities/tools";

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
        getTags(value?.map(el => typeof el.value === "string" ? el.value.toLowerCase()?.trim()?.split(" ")?.join("_") : el.value) || []);
    }
  };
  handleChange = (value) => {
    this.setState({ value });
  };
  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };
  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    const lowerCasedVal = inputValue.toLowerCase();
    switch (event.key) {
      case 'Enter':
      case 'Tab': {
            if(!value.some(word => word.value.toLowerCase() === lowerCasedVal)){
                this.setState({
                    inputValue: '',
                    value: [...value, createOption(lowerCasedVal)],
                });
            }else{
                // edit this please
                alert("This tag has already been added");
            }
            event.preventDefault();
        break;
      }
      default:
    }
   
  };
  render() {
    const { inputValue, value } = this.state;
    return (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        theme={selectTheme}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Add tags and press enter..."
        value={value}
      />
    );
  }
}