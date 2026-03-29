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
	static lastEventTime;
	static idleTimer;
	idleDelay;
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
		this.idleTimer = this.startidleTimer();
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
		this.status= "active"
		this.stopTimer();
		this.startTimer();
		this.forwardPayload();
		return;
	}
	setStreamActivity(e) {
		this.setStreamTime(e)
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
	setStreamTime(e) {
		CursorStream.lastEventTime = e.timeStamp;
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
	setStreamActive() {
		this.status = "active"
	}
	setStreamIdle = () => {
		this.status = "idle";
	}
	startIdleTimer() {
		setTimeout(() => {
			this.setStreamIdle();
			this.forwardPayload();
		}, this.idleDelay);
	}
	stopIdleTimer() {
		clearTimeout(this.idleTimer)
		this.idleTimer = null;
	}
}