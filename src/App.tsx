import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ConversationList from "./components/ConversationList/ConversationList";
import ActiveConversation from "./components/ActiveConversation/ActiveConversation";
import { Conversation, Message } from "./types";

import styles from "./App.module.css";
import NoConversationSelected from "./components/NoConversationSelected/NoConversationSelected";
import Loader from "./components/Loader/Loader";

function App() {
	const [unsortedConversations, setConversations] = useState<Conversation[]>(
		[]
	);
	const [activeConversationId, setActiveConversationId] = useState<string>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const getConversations = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				const res = await axios.get("conversations.json");
				setConversations(res.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(true);
				setLoading(false);
			}
		};

		setLoading(true);
		getConversations();
	}, []);

	// easier to sort conversations in derived state, rather than sorting after fetching and on every update
	const conversations = useMemo(() => {
		const sortedConversations = [...unsortedConversations];
		// sort conversations descending by last_updated. timestamp
		unsortedConversations.sort(
			(a: Conversation, b: Conversation) =>
				new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
		);
		// sort messages ascending by last_updated. timestamp
		unsortedConversations.forEach((conversation: Conversation) => {
			conversation.messages.sort(
				(a, b) =>
					new Date(a.last_updated).getTime() -
					new Date(b.last_updated).getTime()
			);
		});

		return sortedConversations;
	}, [unsortedConversations]);

	const activeConversation = useMemo(() => {
		if (!activeConversationId) return undefined;
		return conversations.find(
			(conversation) => conversation.id === activeConversationId
		);
	}, [activeConversationId, conversations]);

	const onConversationSelected = (id: string) => {
		setActiveConversationId(id);
	};

	const onMessageSent = (message: Message, conversationId: string) => {
		setConversations((prevConversations) => {
			const updatedConversations = [...prevConversations];
			const conversationIndex = updatedConversations.findIndex(
				(conversation) => conversation.id === conversationId
			);
			const updatedMessages = [
				...updatedConversations[conversationIndex].messages,
				message,
			];
			updatedConversations[conversationIndex] = {
				...updatedConversations[conversationIndex],
				messages: updatedMessages,
				last_updated: message.last_updated,
			};

			return updatedConversations;
		});
	};

	const onMessageUpdated = (message: Message, conversationId: string) => {
		setConversations((prevConversations) => {
			const updatedConversations = [...prevConversations];
			const conversationIndex = updatedConversations.findIndex(
				(conversation) => conversation.id === conversationId
			);
			const updatedMessages = [
				...updatedConversations[conversationIndex].messages,
			];
			const messageIndex = updatedMessages.findIndex(
				(msg) => msg.id === message.id
			);
			updatedMessages[messageIndex] = message;

			updatedConversations[conversationIndex] = {
				...updatedConversations[conversationIndex],
				messages: updatedMessages,
				// last_updated: message.last_updated,
			};

			return updatedConversations;
		});
	};

	const expandConversationList = () => {
		setActiveConversationId(undefined);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <h1>Error fetching conversations, try again later</h1>;
	}

	return (
		<div className={styles.app}>
			<ConversationList
				conversations={conversations}
				selectConversation={onConversationSelected}
				activeConversation={activeConversation}
			/>
			{activeConversation ? (
				<ActiveConversation
					conversation={activeConversation}
					onMessageSent={onMessageSent}
					onMessageUpdated={onMessageUpdated}
					expandConversationList={expandConversationList}
				/>
			) : (
				<NoConversationSelected />
			)}
		</div>
	);
}

export default App;
