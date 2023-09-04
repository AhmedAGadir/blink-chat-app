import React, {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { Conversation, Message } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPhone,
	faVideo,
	faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";

import MessageCard from "../MessageCard/MessageCard";

import styles from "./ActiveConversation.module.css";
import { toLocaleDate } from "../../utils";
import InputMessage from "../InputMessage/InputMessage";

type ActiveConversationProps = {
	conversation: Conversation;
	onMessageSent: (message: Message, conversationId: string) => void;
	onMessageUpdated: (message: Message, conversationId: string) => void;
	expandConversationList: () => void;
};

const ActiveConversation = ({
	conversation,
	onMessageSent,
	onMessageUpdated,
	expandConversationList,
}: ActiveConversationProps) => {
	const [editingMessageId, setEditingMessageId] = useState<string>();
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const editingMessage = useMemo(
		() => conversation.messages.find((msg) => msg.id === editingMessageId),
		[conversation.messages, editingMessageId]
	);

	useEffect(() => {
		scrollToBottom();
	}, [conversation.id]);

	const scrollToBottom = () => {
		// because were using flex-direction: column-reverse on the parent container
		// we need to scroll to the top of the container
		messagesContainerRef.current?.scrollTo(0, 0);
	};

	const sendMessage = useCallback(
		(newMessage: Message) => {
			onMessageSent(newMessage, conversation.id);
			scrollToBottom();
		},
		[conversation.id, onMessageSent]
	);

	const updateMessage = useCallback(
		(updatedMessage: Message) => {
			onMessageUpdated(updatedMessage, conversation.id);
		},
		[conversation.id, onMessageUpdated]
	);

	return (
		<div className={styles["active-conversation"]}>
			<header className={styles["active-conversation__header"]}>
				<div className={styles["active-conversation__heading-wrapper"]}>
					<div
						className={styles["active-conversation__expand-sidebar-btn"]}
						aria-label="Expand sidebar"
						onClick={expandConversationList}
					>
						<FontAwesomeIcon icon={faCaretLeft} size="2x" />
					</div>
					<h1 className={styles["active-conversation__name"]}>
						{conversation.name}
					</h1>
				</div>
				<div className={styles["active-conversation__actions"]}>
					<FontAwesomeIcon icon={faVideo} size="lg" />
					<FontAwesomeIcon icon={faPhone} size="lg" />
				</div>
			</header>

			<main className={styles["active-conversation__main"]}>
				{/* were using flex-direction: column-reverse on this container in order to 
				have default bottom scroll position */}
				<div
					className={styles["active-conversation__messages"]}
					ref={messagesContainerRef}
				>
					{/* the wrapper div below this comment is required so that the messages don't 
					display in reverse order */}
					<div>
						{conversation.messages.map((message, ind) => {
							// new date if:
							// first message in chat or
							// date of current iterated message is different from date of previous message
							const isNewDate =
								ind === 0 ||
								new Date(message.last_updated).getDate() !==
									new Date(
										conversation.messages[ind - 1].last_updated
									).getDate();

							return (
								<div key={message.id}>
									{isNewDate && (
										<span
											className={
												styles["active-conversation_message-date-badge"]
											}
										>
											{toLocaleDate(message.last_updated)}
										</span>
									)}
									<MessageCard
										message={message}
										conversation={conversation}
										isEditing={message.id === editingMessageId}
										onEdit={setEditingMessageId}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<InputMessage
					sendMessage={sendMessage}
					updateMessage={updateMessage}
					editingMessage={editingMessage}
					stopEditing={() => setEditingMessageId(undefined)}
				/>
			</main>
		</div>
	);
};

export default ActiveConversation;
