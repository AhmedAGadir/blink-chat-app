export const MESSAGE_STATUSES = [
	"sending",
	"sent",
	"delivered",
	"read",
] as const;

export type Status = (typeof MESSAGE_STATUSES)[number];

export enum MessageStatus {
	SENDING = "sending",
	SENT = "sent",
	DELIVERED = "delivered",
	READ = "read",
}

export type Message = {
	id: string;
	text: string;
	last_updated: string;
	edited?: boolean;
	status?: Status;
};
