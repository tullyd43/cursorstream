//
// Make a config that can turn on and off different listeners
// Also include things like rate limiters/coalescing and timout


// CursorStream instance listener callback storage
let onMove = null;
let onDown = null;
let onUp = null;
let onCancel = null;
let buttonDownTracker = null;
let buttonUpTracker = null;

// Accepts CursorStream objects
function moveListener(stream) {
	onMove = (e) => stream.setStreamActivity(e);
	window.addEventListener("pointermove", onMove);
	return onMove;
}

function downListener(stream) {
	onDown = (e) => stream.streamPhase(e);
	buttonDownTracker = (e) => stream.streamButtons(e);
	window.addEventListener("pointerdown", buttonDownTracker);
	window.addEventListener("pointerdown", onDown);
	return (onDown, buttonDownTracker);
}

function upListener(stream) {
	onUp = (e) => stream.streamPhase(e);
	buttonUpTracker = (e) => stream.streamButtons(e);
	window.addEventListener("pointerup", buttonUpTracker);
	window.addEventListener("pointerup", onUp);
	return (onUp, buttonUpTracker);
}

function cancelListener(stream) {
	onCancel = (e) => stream.clear();
	window.addEventListener("pointercancel", onCancel);
	return onCancel;
}

export {
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
};