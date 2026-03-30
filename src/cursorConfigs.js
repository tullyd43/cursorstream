

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
                status: [],
                intent: [],
                commit: [],
                cancel: [],
	}
		},
	) {
		this.#CursorStream = CursorStream;
		this.#CursorBroadcast = CursorBroadcast;
		this.throttleStatus = configs.throttleStatus;
		this.throttlePhases = configs.throttlePhases;
        this.idleDelay = configs.idleDelay;
        this.extraFields = configs.extraFields;
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
    injectFields() {
        // extra fields
        for (let field of this.extraFields.status) {
            this.#CursorStream[field] = null;
            this.#CursorStream.extraFields.status.push(field)
        }
        for (let field of this.extraFields.intent) {
			this.#CursorStream[field] = null;
			this.#CursorStream.extraFields.intent.push(field);
        }
        for (let field of this.extraFields.commit) {
			this.#CursorStream[field] = null;
			this.#CursorStream.extraFields.commit.push(field);
        }
        for (let field of this.extraFields.cancel) {
			this.#CursorStream[field] = null;
			this.#CursorStream.extraFields.cancel.push(field);
        }
        // null fields
        for (let field of this.nullFields.intent) {
			this.#CursorStream.nullFields.status.push(field);
        }
        for (let field of this.nullFields.intent) {
			this.#CursorStream.nullFields.status.push(field);
        }
        for (let field of this.nullFields.commit) {
			this.#CursorStream.nullFields.commit.push(field);
        }
        for (let field of this.nullFields.cancel) {
			this.#CursorStream.nullFields.cancel.push(field);
		}
    }

	applyConfigs() {
		this.setStatusThrottle();
		this.setPhasesThrottle();
        this.setIdleDelay();
        this.injectFields();
	}
}