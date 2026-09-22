import { renderErrors } from "../messages.js";

export const unique = async (elements, report = renderErrors) => {
    let failedElements = [];
    for (let element of elements) {
        let unique = element.getAttribute('unique');
        if (unique === '')
            unique = await CoCreate.unique.isUnique(element)
        if (unique === 'false' || unique === false) {
            failedElements.push(element);
        }
    }
    if (failedElements.length) {
        report({
            selector: '[template~="notification"]',
            data: [{
                type: 'unique',
                status: 'error',
                success: false,
                message: 'One or more values are not unique',
                selector: '[unique="false"]',
                elements: failedElements
            }]
        });
        return failedElements;
    }
};
