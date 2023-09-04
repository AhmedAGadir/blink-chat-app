import StartChatImg from "../../assets/start-chat.svg";

import styles from "./NoConversationSelected.module.css";

const NoConversationSelected = () => (
	<div className={styles["no-conversation-selected"]}>
		<img src={StartChatImg} alt="Start a conversation" />
		<h1>Start a conversation</h1>
	</div>
);

export default NoConversationSelected;
