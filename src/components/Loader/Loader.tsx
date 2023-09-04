import React, { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";
import styles from "./Loader.module.css";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const Loader = () => {
	return (
		<div className={styles["loader"]}>
			<HashLoader
				color="#4D3DF7"
				cssOverride={override}
				size={70}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
	);
};

export default Loader;
