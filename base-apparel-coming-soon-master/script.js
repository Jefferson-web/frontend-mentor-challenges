const txtEmail = document.getElementById('txtEmail');

document.addEventListener('DOMContentLoaded', function (e) {
    setFocusAndBlurEvent(txtEmail);
});

document.forms['emailForm'].addEventListener('submit', function (e) {
    e.preventDefault();
    if (formIsValid()) {
        alert('Formulario enviado!!!');
    }
});

function formIsValid() {
    if (txtEmail.value == '') {
        setErrorFor(txtEmail, 'Please provide a valid email');
        return false;
    }
    removeErrorFrom(txtEmail);
    return true;
}

function setFocusAndBlurEvent(element) {
    element.addEventListener('keyup', formIsValid);
    element.addEventListener('blur', formIsValid);
}

function setErrorFor(field, message) {
    const parent = field.parentNode;
    parent.classList.add('invalid');
    parent.lastElementChild.textContent = message;
}

function removeErrorFrom(field){
    const parent = field.parentNode;
    parent.classList.remove('invalid');
}