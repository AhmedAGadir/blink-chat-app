import { Message } from "./message";

export type Conversation = {
	id: string;
	name: string;
	last_updated: string;
	messages: Message[];
};
