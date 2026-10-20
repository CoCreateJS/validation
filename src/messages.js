import { render } from "@cocreate/render";
import "@cocreate/element-prototype";

export function errorTargets(element) {
    const root = element.getRootNode();
    return (element.getAttribute("aria-errormessage") || "")
        .trim().split(/\s+/).filter(Boolean)
        .map(id => root.getElementById?.(id)).filter(Boolean);
}

export function clearError(element) {
    for (const target of errorTargets(element)) {
        target.setValue("");
        target.hidden = true;
    }
}

export function renderErrors({ data }) {
    const shown = new Set();
    const notifications = [];
    for (const error of data) {
        const unlinked = [];
        for (const element of error.elements || []) {
            if (shown.has(element)) continue;
            shown.add(element);
            const targets = errorTargets(element);
            if (!targets.length) {
                unlinked.push(element);
                continue;
            }
            for (const target of targets) {
                target.setValue(error.message);
                target.hidden = false;
            }
        }
        if (!error.elements?.length || unlinked.length) {
            notifications.push({ ...error, elements: unlinked });
        }
    }
    if (notifications.length) {
        render({ selector: '[template~="notification"]', data: notifications });
    }
}
