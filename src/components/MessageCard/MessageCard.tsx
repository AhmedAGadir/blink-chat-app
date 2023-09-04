import React, { useMemo, useState, useCallback } from "react";
import { Conversation, Message, MessageStatus } from "../../types";
import { MY_ID } from "../../constants";
import { toLocaleTime } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import clsx from "clsx";
import styles from "./MessageCard.module.css";

const MessageCard = ({
	message,
	conversation,
	isEditing,
	onEdit,
}: {
	message: Message;
	conversation: Conversation;
	isEditing: boolean;
	onEdit: (messageId: string | undefined) => void;
}) => {
	const [hover, setHover] = useState(false);

	const messageInd = useMemo(
		() => conversation.messages.findIndex((msg) => msg.id === message.id),
		[conversation.messages, message.id]
	);

	const isMyMessage = useMemo(() => message.id.startsWith(MY_ID), [message.id]);

	// used to add speech bubble arrow to the last message in a chain
	const isLastMessageInChain = useMemo(
		() =>
			// current message is the last message in the conversation or
			messageInd === conversation.messages.length - 1 ||
			// next message has a different author
			(isMyMessage &&
				!conversation.messages[messageInd + 1].id.startsWith(MY_ID)) ||
			(!isMyMessage &&
				conversation.messages[messageInd + 1].id.startsWith(MY_ID)) ||
			// next message has a different date
			new Date(message.last_updated).getDate() !==
				new Date(conversation.messages[messageInd + 1].last_updated).getDate(),
		[conversation.messages, isMyMessage, message.last_updated, messageInd]
	);

	const toggleEditing = useCallback(() => {
		if (isEditing) {
			onEdit(undefined);
		} else {
			onEdit(message.id);
		}
	}, [isEditing, message, onEdit]);

	return (
		<div
			className={clsx({
				[styles["message-card"]]: true,
				[styles["message-card-me"]]: isMyMessage,
				[styles["message-card-them"]]: !isMyMessage,
			})}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div
				className={clsx({
					[styles["message-card__message"]]: true,
					[styles["message-card__message-me"]]: isMyMessage,
					[styles["message-card__message-them"]]: !isMyMessage,
					[styles["message-card__message-last"]]: isLastMessageInChain,
					[styles["message-card__message-editing"]]: isEditing,
				})}
			>
				{message.text}
				<div className={styles["message-card__metadata"]}>
					{/* show edited if edited */}
					{message.edited && (
						<span className={styles["message-card__edited"]}>edited</span>
					)}
					{/* show time */}
					<span className={styles["message-card__time"]}>
						{toLocaleTime(message.last_updated)}
					</span>
					{/* if my message, show message state */}
					{isMyMessage && (
						<span className={styles["message-card__status"]}>
							{message.status === MessageStatus.SENDING && "🕐"}
							{message.status === MessageStatus.SENT && "✓"}
							{message.status === MessageStatus.DELIVERED && "✓✓"}
							{message.status === MessageStatus.READ && (
								<span className={styles["message-card__read-status"]}>✓✓</span>
							)}
						</span>
					)}
				</div>
			</div>
			{/* show edit button on hover and persist visibility while editing */}
			{(hover || isEditing) && isMyMessage && (
				<span className={styles["message-card__edit"]} onClick={toggleEditing}>
					<FontAwesomeIcon icon={faPen} size="sm" />
				</span>
			)}
		</div>
	);
};

export default MessageCard;
