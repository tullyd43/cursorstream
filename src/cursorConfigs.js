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
			extraFields: {
				status: [],
				intent: [],
				commit: [],
				cancel: [],
			},
			nullFields: {
				intent: [],
				commit: [],
				cancel: [],
			},
		},
	) {
		this.#CursorStream = CursorStream;
		this.#CursorBroadcast = CursorBroadcast;
		this.throttleStatus = configs.throttleStatus;
		this.throttlePhases = configs.throttlePhases;
		this.idleDelay = configs.idleDelay;
		this.extraFields = configs.extraFields;
		this.nullFields = configs.nullFields;
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
	injectFields() {
		// extra fields
		if (this.extraFields.status.length() >= 1) {
			for (let field of this.extraFields.status) {
				this.#CursorStream[field] = null;
				this.#CursorStream.extraFields.status.push(field);
				this.#CursorStream.injectionBypass.status =
					this.#CursorStream.runStatusInjection;
			}
		} else {
			// handle error
		}
		if (this.extraFields.intent.length() >= 1) {
			for (let field of this.extraFields.intent) {
				this.#CursorStream[field] = null;
				this.#CursorStream.extraFields.intent.push(field);
				this.#CursorStream.injectionBypass.intent =
					this.#CursorStream.runIntentInjection;
			}
		} else {
			// handle error
		}
		if (this.extraFields.commit.length() >= 1) {
			for (let field of this.extraFields.commit) {
				this.#CursorStream[field] = null;
				this.#CursorStream.extraFields.commit.push(field);
				this.#CursorStream.injectionBypass.commit =
					this.#CursorStream.runCommitInjeciton;
			}
		} else {
			// handle error
		}
		if (this.extraFields.cancel.length() >= 1) {
			for (let field of this.extraFields.cancel) {
				this.#CursorStream[field] = null;
				this.#CursorStream.extraFields.cancel.push(field);
				this.#CursorStream.injectionBypass.cancel =
					this.#CursorStream.runCancelInjection;
			}
		} else {
			// handle error
		}

		// null fields
		if (this.nullFields.intent.length() >= 1) {
			for (let field of this.nullFields.intent) {
				this.#CursorStream.nullFields.intent.push(field);
				this.#CursorStream.nullInjectionBypass.intent =
					this.#CursorStream.nullIntentInjection;
			}
		}

		if (this.nullFields.commit.length() >= 1) {
			for (let field of this.nullFields.commit) {
				this.#CursorStream.nullFields.commit.push(field);
				this.#CursorStream.nullInjectionBypass.commit =
					this.#CursorStream.nullCommitInjection;
			}
        }
        
        if (this.nullFields.cancel.length() >= 1) {
            for (let field of this.nullFields.cancel) {
				this.#CursorStream.nullFields.cancel.push(field);
				this.#CursorStream.nullInjectionBypass.cancel =
					this.#CursorStream.nullCancelInjection;
			}
        }
	}

	applyConfigs() {
		this.setStatusThrottle();
		this.setPhasesThrottle();
		this.setIdleDelay();
		this.injectFields();
	}
}
