/*jshint node:true */

'use strict';

var React = require('react');
var Formsy = require('formsy-react');
var ComponentMixin = require('./mixins/component');
var Row = require('./row');

var Select = React.createClass({

    mixins: [Formsy.Mixin, ComponentMixin],

    changeValue: function(event) {
        var target = event.currentTarget;
        var value;
        if (this.props.multiple) {
            value = [];
            for (var i = 0; i < target.length; i++){
                var option = target.options[i];
                if (option.selected) {
                    value.push(option.value);
                }
            }
        } else {
            value = target.value;
        }
        this.setValue(value);
        this.props.onChange(this.props.name, value);
    },

    componentWillReceiveProps: function(nextProps) {
        // reset the currently selected value if the next set of options
        // has no matching value
        var valueMapper = function(item) {
            return item.value
        };
        var nextOptionValues = nextProps.options.map(valueMapper).sort();
        var curOptionValues = this.props.options.map(valueMapper).sort();

        var optionComparator = function(currentValue, index) {
            return currentValue == curOptionValues[index];
        };
        // next set of options are not equal to current, check the selected value
        if (nextOptionValues.length !== curOptionValues.length ||
            !nextOptionValues.every(optionComparator)) {
            var curValue = this.getValue();
            var selectedValue = nextProps.options.filter(function(item) {
                return item.value == curValue;
            });
            // set selected value to first on list for new options
            if (selectedValue.length === 0) {
                // TODO: should use resetValue() but this requires more control
                // over this.state._pristineValue than we have currently
                this.setValue(nextOptionValues[0]);
            }
        }
    },

    render: function() {

        if (this.getLayout() === 'elementOnly') {
            return this.renderElement();
        }

        return (
            <Row
                {...this.getRowProperties()}
                htmlFor={this.getId()}
            >
                {this.renderElement()}
                {this.renderHelp()}
                {this.renderErrorMessage()}
            </Row>
        );
    },

    renderElement: function() {
        var optionNodes = this.props.options.map(function(item, index) {
            return (
                <option key={index} {...item} label={null}>{item.label}</option>
            );
        });
        return (
            <select
                className="form-control"
                {...this.props}
                id={this.getId()}
                value={this.getValue()}
                onChange={this.changeValue}
                disabled={this.isFormDisabled() || this.props.disabled}
            >
                {optionNodes}
            </select>
        );
    }
});

module.exports = Select;
