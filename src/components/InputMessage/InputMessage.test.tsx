import { screen } from "@testing-library/react";
import { fireEvent, render } from "@testing-library/react";
import InputMessage from "./InputMessage";
import { Message } from "../../types";

describe("InputMessage", () => {
	it("should render component", () => {
		render(
			<InputMessage
				sendMessage={jest.fn()}
				updateMessage={jest.fn()}
				editingMessage={undefined}
				stopEditing={jest.fn()}
			/>
		);

		expect(screen.getByLabelText("form")).toBeInTheDocument();
	});

	describe("Not editing", () => {
		it("says 'Type a message' when not editing", () => {
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={jest.fn()}
					editingMessage={undefined}
					stopEditing={jest.fn()}
				/>
			);
			expect(
				screen.getByPlaceholderText("Type a message...")
			).toBeInTheDocument();
		});
		it("calls sendMessage when form is submitted", () => {
			const sendMessage = jest.fn();
			render(
				<InputMessage
					sendMessage={sendMessage}
					updateMessage={jest.fn()}
					editingMessage={undefined}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Type a message...");
			input.focus();
			fireEvent.change(input, { target: { value: "test message" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(sendMessage).toHaveBeenCalled();
		});
		it("does not call sendMessage when form is submitted with empty input value", () => {
			const sendMessage = jest.fn();
			render(
				<InputMessage
					sendMessage={sendMessage}
					updateMessage={jest.fn()}
					editingMessage={undefined}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Type a message...");
			input.focus();
			fireEvent.change(input, { target: { value: "" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(sendMessage).not.toHaveBeenCalled();
		});
		it("clears input value on submitting form", () => {
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={jest.fn()}
					editingMessage={undefined}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Type a message...");
			input.focus();
			fireEvent.change(input, { target: { value: "test message" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(input).toHaveValue("");
		});
	});

	describe("Editing", () => {
		const editingMessage: Message = {
			id: "test",
			text: "test message",
			last_updated: new Date().toISOString(),
			status: "sent",
		};
		it('should say "Edit message" when editing', () => {
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={jest.fn()}
					editingMessage={editingMessage}
					stopEditing={jest.fn()}
				/>
			);
			expect(
				screen.getByPlaceholderText("Edit message...")
			).toBeInTheDocument();
		});
		it("calls updateMessage when form is submitted", () => {
			const updateMessage = jest.fn();
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={updateMessage}
					editingMessage={editingMessage}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Edit message...");
			input.focus();
			fireEvent.change(input, { target: { value: "updated test message" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(updateMessage).toHaveBeenCalled();
		});
		it("does not call updateMessage when form is submitted with empty input value", () => {
			const updateMessage = jest.fn();
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={updateMessage}
					editingMessage={editingMessage}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Edit message...");
			input.focus();
			fireEvent.change(input, { target: { value: "" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(updateMessage).not.toHaveBeenCalled();
		});
		it("clears input value on submitting form", () => {
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={jest.fn()}
					editingMessage={editingMessage}
					stopEditing={jest.fn()}
				/>
			);
			const input = screen.getByPlaceholderText("Edit message...");
			input.focus();
			fireEvent.change(input, { target: { value: "updated test message" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(input).toHaveValue("");
		});
		it("calls stopEditing when form is submitted", () => {
			const stopEditing = jest.fn();
			render(
				<InputMessage
					sendMessage={jest.fn()}
					updateMessage={jest.fn()}
					editingMessage={editingMessage}
					stopEditing={stopEditing}
				/>
			);
			const input = screen.getByPlaceholderText("Edit message...");
			input.focus();
			fireEvent.change(input, { target: { value: "updated test message" } });
			const button = screen.getByRole("button");
			fireEvent.click(button);

			expect(stopEditing).toHaveBeenCalled();
		});
	});
});
