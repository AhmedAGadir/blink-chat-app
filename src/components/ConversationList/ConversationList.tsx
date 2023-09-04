import React from "react";
import { Conversation } from "../../types/conversation";
import { toLocaleDate, toLocaleTime } from "../../utils";

import clsx from "clsx";
import styles from "./ConversationList.module.css";

const ConversationList = ({
	conversations,
	selectConversation,
	activeConversation,
}: {
	conversations: Conversation[];
	selectConversation: (id: string) => void;
	activeConversation: Conversation | undefined;
}) => {
	return (
		<aside
			className={clsx({
				[styles["conversation-list"]]: true,
				[styles["conversation-list-expanded"]]:
					activeConversation === undefined,
			})}
		>
			<ul>
				{conversations.map((conversation) => (
					<li
						key={conversation.id}
						onClick={() => selectConversation(conversation.id)}
						className={clsx({
							[styles["conversation-list__conversation"]]: true,
							[styles["conversation-list__conversation-active"]]:
								conversation.id === activeConversation?.id,
						})}
					>
						{conversation.name}
						<span className={styles["conversation-list__conversation-date"]}>
							{/* if date is today show time */}
							{new Date(conversation.last_updated).getDate() ===
							new Date().getDate()
								? toLocaleTime(conversation.last_updated)
								: // else show date
								  toLocaleDate(conversation.last_updated)}
						</span>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default ConversationList;
