export const preventSubmit = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		e.target?.blur();
	}
};
