// Any newly created item will inherit the following styles:
	console.log(tool);
		project.currentStyle = {
			strokeColor: 'black',
			strokeWidth: 5,
			strokeJoin: 'round',
			strokeCap: 'round'
		};

		// The user has to drag the mouse at least 30pt before the mouse drag
		// event is fired:
		tool.minDistance = 30;

		var path;
		function onMouseDown(event) {
			path = new Path();
			path.add(event.point);
		}

		function onMouseDrag(event) {
			path.arcTo(event.point, true);
		}
