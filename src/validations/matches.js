import { renderErrors } from "../messages.js";

function initMatches() {
    let elements = document.querySelectorAll('[matches]');
    for (let element of elements) {
        let targetSelector = element.getAttribute('matches');
        let target = document.querySelector(targetSelector);
        element.validations = { matches: target };
        element.addEventListener('input', validateMatchEvent);
    }
}

function validateMatchEvent(e) {
    validateMatch(e.target);
}

function validateMatch(element) {
    // let element = e.target;
    let target = document.querySelector(element.getAttribute('matches'));
    if (!target) {
        element.setAttribute('validation', 'false');
        return;
    }
    if (target.value == element.value) {
        element.setAttribute('validation', 'true');
    }
    else {
        element.setAttribute('validation', 'false');
    }
}

function matches(elements, report = renderErrors) {
    let failedElements = [];
    for (let element of elements) {
        validateMatch(element);
        let isValid = element.getAttribute('validation');
        if (isValid == 'false') {
            failedElements.push(element);
        }
    }
    if (failedElements.length) {
        report({
            selector: '[template~="notification"]',
            data: [{
                type: 'matches',
                status: 'error',
                success: false,
                message: 'One or more values do not match',
                selector: '[matches][validation="false"]',
                elements: failedElements
            }]
        });
        return failedElements;
    }
}

initMatches();

export { matches };