import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import Autosuggest from 'react-autosuggest'

class SearchBox extends React.Component {

    static propTypes = {
        data: PropTypes.array
    };

    handleClick (evt) {
        evt.preventDefault()
    }

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this)

        this.state = {
            value: '',
            suggestions: this.getSuggestions('')
        };
    }

    onChange(event, { newValue }) {
        this.setState({value: newValue});
    }

    onSuggestionsUpdateRequested({ value }) {
        this.setState({suggestions: this.getSuggestions(value)});
    }

    getSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.data.filter(server =>
            server.host_name.toLowerCase().slice(0, inputLength) === inputValue
        );
    }

    getSuggestionValue(suggestion) {
        return suggestion.host_name;
    }

    renderSuggestion(suggestion) {
        return (
            <span>{suggestion.site+': '+suggestion.host_name}</span>
        );
    }

    render () {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Find server',
            value,
            onChange: this.onChange
        };
        return (
            <Autosuggest suggestions={suggestions}
                         onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                         getSuggestionValue={this.getSuggestionValue}
                         renderSuggestion={this.renderSuggestion}
                         inputProps={inputProps} />    )
    }
}

export default SearchBox