document.addEventListener('DOMContentLoaded', function (e) {
    Form.validate(document.forms['myForm'], {
        rules: {
            firstname: {
                empty: false,
                pattern: '^[a-zA-Z]+$'
            },
            lastname: {
                empty: false,
                pattern: '^[a-zA-Z]+$'
            },
            email: {
                empty: false,
                pattern: "^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$"
            },
            password: {
                empty: false
            }
        },
        messages: {
            firstname: ['Firstname cannot be empty', 'Only letters accepted.'],
            lastname: ['Lastname cannot be empty', 'Only letters accepted.'],
            email: ['Email cannot be empty', 'Looks like this is not an email.'],
            password: ['Password cannot be empty']
        }
    });
    e.preventDefault();
});

class Form {

    static allowedRules = ['empty', 'pattern', 'minlength', 'maxlength'];
    static typesNotAllowed = ['submit', 'button', 'reset'];
    static controls = [];
    static rules;
    static messages = {};
    static validFields = {};

    /**
     * 
     * @param {*} form 
     * @param {*} conf 
     */
    static validate(form, conf) {
        if (form == null) {
            console.error('The form does not exists.');
            return;
        }
        const elements = Array.from(form.elements);
        this.rules = conf['rules'];
        this.messages = conf['messages'];
        this.controls = this.filterElements(elements, this.rules);
        this.createObjectValidFields(this.rules);
        this.addEventsToItems(this.controls, form);
    }

    /**
     * 
     * @param {*} fields 
     */
    static createObjectValidFields(fields) {
        Object.keys(fields).forEach(field => {
            this.validFields[`${field}`] = false;
        });
    }

    /**
     * 
     * @param {*} elements 
     * @param {*} rules 
     */
    static filterElements(elements, rules) {
        let controls = [];
        let fields = Object.keys(rules);
        for (const field of fields) {
            let fieldExists = false;
            for (const element of elements) {
                if (Object.is(field, element.name)) {
                    fieldExists = true;
                    controls.push(element);
                    break;
                }
            }
            if (!fieldExists) {
                console.error(`The element ${field} does not exists.`);
                return;
            };
        }
        return controls;
    }

    static activateControls() {
        this.controls.forEach(control => {
            control.focus();
            control.blur();
        });
    }

    /**
     * 
     * @param {*} controls 
     */
    static addEventsToItems(controls, form) {
        controls.forEach(control => {
            control.addEventListener('blur', this.makeValidations);
            control.addEventListener('keyup', this.makeValidations);
        });
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            Form.activateControls();
            for (const key of Object.keys(Form.rules)) {
                if (!Form.validFields[key]) {
                    console.log("Formulario Invalido");
                    return;
                }
            }
            console.log("Formulario enviado");
        });
    }

    static makeValidations(e) {
        let value = this.value;
        let validations = Form.rules[`${this.name}`];
        let keys = Object.keys(validations);
        let indexKey = 0;
        let canContinue = true;
        for (const key of keys) {
            let keyValue = Form.rules[this.name][key];
            if (!canContinue) continue;
            switch (key) {
                case 'empty':
                    let isEmpty = Validator.isEmpty(value, keyValue);
                    if (isEmpty) {
                        Form.addErrorMessage(this, this.name, indexKey);
                        Form.validFields[this.name] = false;
                        canContinue = false;
                    } else {
                        Form.removeErrorMessage(this);
                        Form.validFields[this.name] = true;
                        canContinue = true;
                    }
                    break;
                case 'pattern':
                    let isValidValue = Validator.matches(value, keyValue);
                    if (!isValidValue) {
                        Form.addErrorMessage(this, this.name, indexKey);
                        Form.validFields[this.name] = false;
                        canContinue = false;
                    } else {
                        Form.removeErrorMessage(this);
                        Form.validFields[this.name] = true;
                        canContinue = true;
                    }
                    break;
                default:
                    break;
            }
            indexKey++;
        }
    }

    static addErrorMessage(element, fieldName, indexMessage) {
        let message = this.messages[`${fieldName}`][indexMessage];
        element.parentNode.classList.add('invalid');
        element.nextElementSibling.textContent = message;
    }

    static removeErrorMessage(element) {
        element.parentNode.classList.remove('invalid');
        element.nextElementSibling.textContent = '';
    }

}

class Validator {

    static isEmpty(val, keyValue) {
        if (keyValue) {
            return false;
        }
        if (val == '') {
            return true;
        }
        return false;
    }

    static matches(val, pattern) {
        let regExp = new RegExp(pattern);
        if (regExp.test(val)) {
            return true;
        }
        return false;
    }

}