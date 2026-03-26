import {
	moveListener,
	downListener,
	upListener,
	cancelListener,
	onMove,
	onDown,
	onUp,
	onCancel,
	buttonDownTracker,
	buttonUpTracker,
} from "./pointerAdapter.js";
import PayloadRouter from "./payloadRouter.js";

export default class CursorStream {
	payloadRouter;
	constructor() {
		this.x;
		this.y;
		this.buttons;
		this.phase;
		this.status;
		this.target;
		this.payloadRouter = new PayloadRouter();
	}
	start() {
		moveListener(this);
		downListener(this);
		upListener(this);
		cancelListener(this);
		return;
	}
	stop() {
		window.removeEventListener("pointermove", onMove);
		window.removeEventListener("pointerdown", onDown);
		window.removeEventListener("pointerup", onUp);
		window.removeEventListener("pointercancel", onCancel);
		window.removeEventListener("pointerdown", buttonDownTracker);
		window.removeEventListener("pointerup", buttonUpTracker);
		return;
	}
	streamPhase(e) {
		switch (e.type) {
			case "pointerdown":
				this.phase = "intent";
				this.forwardPayload();
				break;
			case "pointerup":
				this.phase = "commit";
				this.forwardPayload();
				this.resetPhase();
				this.resetButtons();
				break;
			// Cancel might need another path for a dedicated cancel button
			case "pointercancel":
				this.phase = "cancel";
				this.streamButtons(e);
				this.forwardPayload();
				this.resetPhase();
				this.resetButtons();
				break;
		}
		return;
	}
	resetPhase() {
		this.phase = null;
		return;
	}
	streamStatus() {
		setStreamActive(this);
		if (!idleTimer.timer) {
			idleTimer.startTimer(this);
		} else {
			idleTimer.stopTimer();
			idleTimer.startTimer(this);
		}
		this.forwardPayload();
		return;
	}
	setStreamActivity(e) {
		this.setStreamPosition(e);
		this.setStreamTarget(e);
		this.streamStatus();
		return;
	}
	setStreamPosition(e) {
		this.x = e.clientX;
		this.y = e.clientY;
		return;
	}
	setStreamTarget(e) {
		this.target = e.target;
		return;
	}
	streamButtons(e) {
		this.buttons = e.buttons;
		return;
	}
	resetButtons() {
		this.buttons = 0;
	}
	forwardPayload() {
		this.payloadRouter.payloadBuffer.x = this.x;
		this.payloadRouter.payloadBuffer.y = this.y;
		this.payloadRouter.payloadBuffer.buttons = this.buttons;
		this.payloadRouter.payloadBuffer.phase = this.phase;
		this.payloadRouter.payloadBuffer.status = this.status;
		this.payloadRouter.payloadBuffer.target = this.target;
		console.log("live mutable", this);
		this.payloadRouter.route();
	}
}

// CursorStream class helpers
function setStreamIdle(stream) {
	stream.status = "idle";
}
function setStreamActive(stream) {
	stream.status = "active";
}
const idleTimer = {
	timer: null,
	startTimer(stream) {
		this.timer = setTimeout(() => {
			setStreamIdle(stream);
			stream.forwardPayload();
		}, 5000);
	},
	stopTimer() {
		clearTimeout(this.timer);
		this.timer = null;
	},
};
