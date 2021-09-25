export const validateInputString = (input) =>
	typeof input !== 'string' || input.length === 0;

export const isValidString = (string) =>
	typeof string === 'string' && string.length > 0;

export const removeEmptyValueObject = (obj) => {
	return Object.entries(obj)
		.filter(([_, v]) => v != null)
		.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}