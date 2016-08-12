/*jshint node:true */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Formsy = require('formsy-react');
var ComponentMixin = require('./mixins/component');
var Row = require('./row');

var Select = React.createClass({
    displayName: 'Select',


    mixins: [Formsy.Mixin, ComponentMixin],

    changeValue: function changeValue(event) {
        var target = event.currentTarget;
        var value;
        if (this.props.multiple) {
            value = [];
            for (var i = 0; i < target.length; i++) {
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

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // reset the currently selected value if the next set of options
        // has no matching value
        var valueMapper = function valueMapper(item) {
            return item.value;
        };
        var nextOptionValues = nextProps.options.map(valueMapper).sort();
        var curOptionValues = this.props.options.map(valueMapper).sort();

        var optionComparator = function optionComparator(currentValue, index) {
            return currentValue == curOptionValues[index];
        };
        if (nextOptionValues.length !== curOptionValues.length || !nextOptionValues.every(optionComparator)) {
            var curValue = this.getValue();
            var selectedValue = nextProps.options.filter(function (item) {
                return item.value == curValue;
            });
            if (selectedValue.length === 0) {
                this.setValue(nextOptionValues[0]);
            }
        }
    },

    render: function render() {

        if (this.getLayout() === 'elementOnly') {
            return this.renderElement();
        }

        return React.createElement(
            Row,
            _extends({}, this.getRowProperties(), {
                htmlFor: this.getId()
            }),
            this.renderElement(),
            this.renderHelp(),
            this.renderErrorMessage()
        );
    },

    renderElement: function renderElement() {
        var optionNodes = this.props.options.map(function (item, index) {
            return React.createElement(
                'option',
                _extends({ key: index }, item, { label: null }),
                item.label
            );
        });
        return React.createElement(
            'select',
            _extends({
                className: 'form-control'
            }, this.props, {
                id: this.getId(),
                value: this.getValue(),
                onChange: this.changeValue,
                disabled: this.isFormDisabled() || this.props.disabled
            }),
            optionNodes
        );
    }
});

module.exports = Select;