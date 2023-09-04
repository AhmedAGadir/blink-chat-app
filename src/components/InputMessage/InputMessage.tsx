import React, { useEffect, useRef, useState } from "react";
import { MY_ID } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faEdit } from "@fortawesome/free-solid-svg-icons";
import { MESSAGE_STATUSES, Message, MessageStatus, Status } from "../../types";
import { v4 as uuidv4 } from "uuid";

import styles from "./InputMessage.module.css";
import clsx from "clsx";

const InputMessage = ({
	sendMessage,
	updateMessage,
	editingMessage,
	stopEditing,
}: {
	sendMessage: (newMessage: Message) => void;
	updateMessage: (updatedMessage: Message) => void;
	editingMessage: Message | undefined;
	stopEditing: () => void;
}) => {
	const [text, setText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editingMessage) {
			setText(editingMessage.text);
			inputRef.current?.focus();
		} else {
			setText("");
		}
		// disabled for this line because we only want to run this effect when a different messsage is being edited

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editingMessage?.id]);

	const onSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (text === "" || !editingMessage) return;

		const updatedMessage: Message = {
			...editingMessage,
			text,
			edited: true,
		};
		updateMessage(updatedMessage);
		stopEditing();
		setText("");
	};

	const onSubmitNewMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (text === "") return;

		const newMessage: Message = {
			id: `${MY_ID}-${uuidv4()}`,
			text,
			last_updated: new Date().toISOString(),
			status: MessageStatus.SENDING,
		};

		sendMessage(newMessage);
		setText("");

		// mock status updates
		MESSAGE_STATUSES.forEach((status: Status, i) => {
			if (status === MessageStatus.SENDING) return;
			setTimeout(() => {
				const updatedMessage: Message = {
					...newMessage,
					status,
					// last_updated: new Date().toISOString(),
				};
				updateMessage(updatedMessage);
			}, 1000 * i + 1);
		});
	};

	return (
		/* wrap input in form element so 'enter' key submits */
		<form
			onSubmit={!!editingMessage ? onSubmitEdit : onSubmitNewMessage}
			className={styles["input-message__form"]}
			aria-label="form"
		>
			<input
				type="text"
				className={clsx({
					[styles["input-message__input"]]: true,
					[styles["input-message__input-editing"]]: !!editingMessage,
				})}
				placeholder={editingMessage ? "Edit message..." : "Type a message..."}
				value={text}
				onChange={(e) => setText(e.target.value)}
				ref={inputRef}
			/>
			<button
				type="submit"
				className={clsx({
					[styles["input-message__btn"]]: true,
					[styles["input-message__btn-editing"]]: !!editingMessage,
				})}
				aria-label={editingMessage ? "Edit message" : "Send message"}
			>
				{editingMessage ? (
					<FontAwesomeIcon icon={faEdit} size="2xl" />
				) : (
					<FontAwesomeIcon icon={faLocationArrow} size="2xl" />
				)}
			</button>
		</form>
	);
};

export default InputMessage;
