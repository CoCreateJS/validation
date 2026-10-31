/********************************************************************************
 * Copyright (C) 2020 CoCreate LLC.
 *
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import actions from "@cocreate/actions";
import "@cocreate/element-prototype";
import { render } from "@cocreate/render";
import { clearError, errorTargets, renderErrors } from "./messages.js";
import { matches } from "./validations/matches.js";
import { value } from "./validations/value.js";

const validations = new Map();
validations.set("matches", matches);
validations.set("valid", validState);
validations.set("validate", value);

function validState(elements, report = renderErrors) {
    const failedElements = elements.filter(element => element.getAttribute("valid") === "false");

    if (failedElements.length) {
        report({
            data: failedElements.map(element => ({
                type: "valid",
                status: "error",
                success: false,
                message: element.validationMessage || "This value is not valid.",
                elements: [element]
            }))
        });
        return failedElements;
    }
}

async function validate(action) {
    try {
        const selectors = [...validations.keys()].map(name => `[${name}]`).concat("[component][required]").join(", ");
        const candidates = new Set();
        const form = action.element.form || action.form || action.element.closest("form");
        const roots = action.params ? document.querySelectorAll(action.params) : [form];
        if (!roots.length || !roots[0]) throw new Error("No validation target found");

        for (const root of roots) {
            if (root.matches(selectors) || root.willValidate) candidates.add(root);
            for (const element of root.querySelectorAll(selectors)) candidates.add(element);
            for (const element of root.elements || root.querySelectorAll("input, select, textarea, button")) {
                candidates.add(element);
            }
        }
        const elements = [...candidates].filter(element =>
            !element.closest("[template]") &&
            !element.matches(":disabled") && element.willValidate !== false
        );
        const failed = new Set();
        const nativeEnabled = !form?.noValidate && !action.element.formNoValidate;
        if (nativeEnabled) {
            for (const element of elements) {
                if (element.willValidate && !element.checkValidity()) failed.add(element);
                if (element.hasAttribute("required")) {
                    const value = await element.getValue();
                    if (value == null || value === "" || Array.isArray(value) && !value.length)
                        failed.add(element);
                }
            }
            if (failed.size) {
                for (const element of elements) markValidity(element, !failed.has(element));
                action.abort();
                const first = failed.values().next().value;
                renderErrors({
                    data: [...failed].map(element => ({
                        type: "validate", status: "error", success: false,
                        message: element.validationMessage || "A value is required.", elements: [element]
                    }))
                });
                if (errorTargets(first).length) first.focus();
                else first.reportValidity?.();
                return;
            }
        }

        const errors = [];
        for (const [name, validator] of validations) {
            const targets = elements.filter(element => element.hasAttribute(name));
            if (!targets.length) continue;
            const failures = await validator(targets, ({ data }) => errors.push(...data));
            if (failures) for (const element of failures) failed.add(element);
        }
        for (const element of elements) markValidity(element, !failed.has(element));
        if (failed.size) {
            action.abort();
            renderErrors({ data: errors });
            failed.values().next().value.focus?.();
        } else {
            action.end();
        }
    } catch (error) {
        action.abort();
        render({
            selector: '[template~="notification"]',
            data: [{ type: "validate", status: "error", success: false,
                message: error.message || "Unable to validate the form. Please try again." }]
        });
    }
}

function markValidity(element, valid) {
    const state = String(valid);
    element.setAttribute("validation", state);
    element.setAttribute("aria-invalid", String(!valid));
    if (valid) clearError(element);
}

actions.init({ name: "validate", callback: validate });

export default { validations };
