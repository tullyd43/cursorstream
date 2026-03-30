

export default class CursorConfigs {
	#CursorStream;
	#CursorBroadcast;
	constructor(
		CursorStream,
		CursorBroadcast,
		configs = {
			throttleStatus: "auto",
			throttlePhases: "auto",
			idleDelay: 5000,
		},
	) {
		this.#CursorStream = CursorStream;
		this.#CursorBroadcast = CursorBroadcast;
		this.throttleStatus = configs.throttleStatus;
		this.throttlePhases = configs.throttlePhases;
		this.idleDelay = configs.idleDelay;
	}

	setStatusThrottle() {
		if (this.throttleStatus === "auto") {
			this.#CursorBroadcast.statusThrottle =
				this.#CursorBroadcast.rAFThrottleStatus;
			return;
		} else if (this.throttleStatus === 0) {
			this.#CursorBroadcast.statusThrottle =
				this.#CursorBroadcast.bypassThrottleStatus;
			return;
		} else if (this.throttleStatus >= 1) {
			this.#CursorBroadcast.statusThrottle =
				this.#CursorBroadcast.customThrottleStatus;
			this.#CursorBroadcast.customStatusThrottleRate =
				1000 / this.throttleStatus;
			return;
		} else {
			return; // handle an error
		}
	}
	setPhasesThrottle() {
		if (this.throttlePhases === "auto") {
			this.#CursorBroadcast.phaseThrottle =
                this.#CursorBroadcast.rAFThrottlePhases;
                this.#CursorBroadcast.
			return;
		} else if (this.throttlePhases === 0) {
			this.#CursorBroadcast.phaseThrottle =
				this.#CursorBroadcast.bypassThrottlePhases;
			return;
		} else if (this.throttlePhases >= 1) {
			this.#CursorBroadcast.phaseThrottle =
				this.#CursorBroadcast.customThrottlePhases;
			this.#CursorBroadcast.customPhaseThrottleRate =
				1000 / this.throttlePhases;
		} else {
			return; // handle an error
		}
	}
	setIdleDelay() {
        this.#CursorStream.idleDelay = this.idleDelay;
	}

	applyConfigs() {
		this.setStatusThrottle();
		this.setPhasesThrottle();
		this.setIdleDelay();
	}
}