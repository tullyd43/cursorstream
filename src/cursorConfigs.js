

export default class CursorConfigs {
    #CursorStream
    #CursorBroadcast
    constructor(
        CursorBroadcast,
        CursorStream,
        configs = {
            throttleStatus: "auto",
            throttlePhases: "auto",
            idleDelay: 5000,
        }
    ) {
        this.#CursorStream = CursorStream;
        this.#CursorBroadcast = CursorBroadcast;
        this.throttleStatus = configs.throttleStatus;
        this.throttlePhases = configs.throttlePhases;
        this.idleDelay = configs.idleDelay;
    }

    setStatusThrottle() {
        if (this.throttleStatus === "auto") {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.rAFThrottleStatus;
            return 
        } else if (this.throttleStatus === 0) {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.bypassThrottleStatus;
            return 
        } else if (this.throttleStatus >= 1) {
            this.#CursorBroadcast.statusThrottle = this.#CursorBroadcast.customThrottleStatus;
            this.#CursorBroadcast.customStatusThrottleRate = 1000 / this.throttleStatus;
            return 
        } else {
            return // handle an error
        }
    }
    setPhasesThrottle() {
        if (this.throttlePhases === "auto") {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.rAFThrottlePhases;
            return;
        } else if (this.throttlePhases === 0) {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.bypassThrottlePhases;
            return;
        } else if (this.throttlePhases >= 1) {
            this.#CursorBroadcast.phasesThrottle = this.#CursorBroadcast.customThrottlePhases;
            this.#CursorBroadcast.customPhaseThrottleRate = 1000 / this.throttlePhases;
        } else {
            return // handle an error
        }
    }
    setIdleTimeout() {
        this.#CursorStream.idleDelay = this.idleDelay;
    }

    applyConfigs() {
        this.setStatusThrottle();
        this.setPhasesThrottle();
    }
}