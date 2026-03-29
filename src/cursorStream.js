import PayloadRouter from "./payloadRouter.js";
import StreamSources from "./streamSources.js";

export default class CursorStream {
	static lastEventTime;
	static idleTimer;
	idleDelay;
	StreamSources = new StreamSources(this);
	payloadRouter = new PayloadRouter();
	constructor() {
		this.x;
		this.y;
		this.buttons;
		this.phase;
		this.status;
		this.target;
	}
	start() {
		this.StreamSources.moveListener();
		this.StreamSources.downListener();
		this.StreamSources.upListener();
		this.StreamSources.cancelListener();
		this.idleTimer = null;
		return;
	}
	stop() {
		window.removeEventListener("pointermove", this.StreamSources.onMove);
		window.removeEventListener("pointerdown", this.StreamSources.onDown);
		window.removeEventListener("pointerup", this.StreamSources.onUp);
		window.removeEventListener("pointercancel", this.StreamSources.onCancel);
		return;
	}
	streamPhase(e) {
		switch (e.type) {
			case "pointerdown":
				this.phase = "intent";
				this.buttons = e.buttons;
				this.forwardPayload();
				break;
			case "pointerup":
				this.phase = "commit";
				this.buttons = e.buttons;
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				break;
			// Cancel might need another path for a dedicated cancel button
			case "pointercancel":
				this.phase = "cancel";
				this.buttons = e.buttons
				this.forwardPayload();
				this.phase = null;
				this.buttons = 0;
				break;
		}
		return;
	}
	streamStatus() {
		this.status = "active";
		this.stopIdleTimer();
		this.startIdleTimer();
		this.forwardPayload();
		return;
	}
	setStreamActivity(e) {
		this.lastEventTime = e.timeStamp;
		this.x = e.clientX;
		this.y = e.clientY;
		this.target = e.target;
		this.lastEventTime = e.timeStamp;
		this.streamStatus();
		return;
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
		this.status = "active";
	}
	setStreamIdle = () => {
		this.status = "idle";
	};
	startIdleTimer() {
		this.idleTimer = setTimeout(() => {
			this.setStreamIdle();
			this.forwardPayload();
		}, this.idleDelay);
	}
	stopIdleTimer() {
		clearTimeout(this.idleTimer);
		this.idleTimer = null;
	}
}