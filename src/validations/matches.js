import { renderErrors } from "../messages.js";

function initMatches() {
    let elements = document.querySelectorAll('[match-query]');
    for (let element of elements) {
        let targetSelector = element.getAttribute('match-query');
        let target = document.querySelector(targetSelector);
        element.validations = { matches: target };
        element.addEventListener('input', validateMatchEvent);
    }
}

function validateMatchEvent(e) {
    validateMatch(e.target);
}

function validateMatch(element) {
    let target = element.queryElements();
    if (!target) {
        element.setAttribute('match', 'false');
        return;
    }
    if (target.value == element.value) {
        element.setAttribute('match', 'true');
    }
    else {
        element.setAttribute('match', 'false');
    }
}

function matches(elements, report = renderErrors) {
    let failedElements = [];
    for (let element of elements) {
        validateMatch(element);
        let isValid = element.getAttribute('match');
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
                selector: '[match-query][match="false"]'
            }]
        });
        return failedElements;
    }
}

initMatches();

export { matches };