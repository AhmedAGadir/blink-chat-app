export const toLocaleDate = (date: string) =>
	new Date(date).toLocaleDateString();

export const toLocaleTime = (date: string) =>
	new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
