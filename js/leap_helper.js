var space = document.getElementById("space");
var draggingFingerId = null;

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

Leap.loop(controllerOptions, function(frame) {
	if (frame.pointables.length > 0) {
		for (var i = 0; i < frame.pointables.length; i++) {
			var pointable = frame.pointables[i];
			if(draggingFingerId != null && pointable.id === draggingFingerId) {
				console.log("Direction: " + vectorToString(pointable.direction, 2));
				console.log("Tip position: " + vectorToString(pointable.tipPosition));
				console.log("Tip velocity: " + vectorToString(pointable.tipVelocity));
			}
		}
	}

	for (var i = 0; i < frame.gestures.length; i++) {
		var gesture = frame.gestures[i];
		if (frame.gestures.length > 0) {
			switch (gesture.type) {
				case "screenTap":
					draggingFingerId = gesture.pointableIds[0];
				default:
  					console.log("unkown gesture type");
			}
		}
	}
})