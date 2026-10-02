import { renderErrors } from "../messages.js";

export async function value(elements, report = renderErrors) {
	const failedElements = [];
	for (const element of elements) {
		try {
			const resolvedValue = await element.getValue();
			if (
				resolvedValue === null ||
				typeof resolvedValue !== "object" ||
				Array.isArray(resolvedValue)
			) {
				failedElements.push(element);
			}
		} catch {
			failedElements.push(element);
		}
	}

	if (failedElements.length) {
		report({
			data: failedElements.map((element) => ({
				type: "validate",
				status: "error",
				success: false,
				message: "Value must resolve to an object.",
				elements: [element]
			}))
		});
		return failedElements;
	}
}
