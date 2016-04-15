/*global CanvasRenderingContext2D, Brickout */

// ------------------------------------------------------------------
//
// This provides the rendering code for the game.
//
// ------------------------------------------------------------------
FORTIFY.graphics = (function() {

	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	//------------------------------------------------------------------
	//
	// Public method that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}

	//------------------------------------------------------------------
	//
	// Draws a rectangle
	//
	//------------------------------------------------------------------
	function drawRectangle(spec) {
		context.fillStyle = spec.fill;
		context.fillRect(spec.x, spec.y, spec.width, spec.height);

        if (spec.stroke) {    
            context.strokeStyle = spec.stroke;
            context.strokeRect(spec.x, spec.y, spec.width, spec.height);
        }
	}

	//------------------------------------------------------------------
	//
	// Returns the width of the specified text, in pixels.
	//
	//------------------------------------------------------------------
	function measureTextWidth(spec) {
		context.save();

		context.font = spec.font;
		context.fillStyle = spec.fill;
		if (spec.hasOwnProperty('stroke')) {
			context.strokeStyle = spec.stroke;
		}
		var width = context.measureText(spec.text).width;

		context.restore();

		return width;
	}

	//------------------------------------------------------------------
	//
	// Returns the height of the specified text, in pixels.
	//
	//------------------------------------------------------------------
	function measureTextHeight(spec) {
		var saveText = spec.text;

		spec.text = 'm';	// Clever trick to get font height
		context.save();

		context.font = spec.font;
		context.fillStyle = spec.fill;
		if (spec.hasOwnProperty('stroke')) {
			context.strokeStyle = spec.stroke;
		}
		var width = context.measureText(spec.text).width;
		spec.text = saveText;

		context.restore();

		return width;
	}

	//------------------------------------------------------------------
	//
	// Draw some text to the screen
	//
	//------------------------------------------------------------------
	function drawText(spec) {
		context.save();

		context.font = spec.font,
		context.fillStyle = spec.fill;
		if (spec.hasOwnProperty('stroke')) {
			context.strokeStyle = spec.stroke;
		}
		context.textBaseline = 'top';

		context.fillText(spec.text, spec.position.x, spec.position.y);
		context.strokeText(spec.text, spec.position.x, spec.position.y);

		context.restore();
	}
    
    //------------------------------------------------------------------
	//
	// Draw tower
	//
	//------------------------------------------------------------------
	function drawTower(tower, a) {
        tower.render(context, a);
	}
    
    //------------------------------------------------------------------
	//
	// Draw a projectile
	//
	//------------------------------------------------------------------
	function drawProjectile(projectile) {
        context.save();
        
        // drawText({ font: 'Georgia, serif', fill: 'black', position: { x: 100, y: 100 }, text: projectile.rotation.toString() });
        
        context.translate(projectile.center.x, projectile.center.y);
        context.rotate(projectile.rotation);
        context.translate(-projectile.center.x, -projectile.center.y);
        
        context.fillStyle = projectile.color;
        context.fillRect(projectile.center.x + projectile.headStart, projectile.center.y - projectile.height / 2, projectile.width, projectile.height);
        
        if (projectile.strokeColor) {
            context.strokeStyle = projectile.strokeColor;
            context.strokeRect(projectile.center.x + projectile.headStart, projectile.center.y - projectile.height / 2, projectile.width, projectile.height);
        }
        
        context.restore();
	}
    
    //------------------------------------------------------------------
	//
	// Draw creep
	//
	//------------------------------------------------------------------
	function drawCreep(creep) {
        context.save();
        context.fillStyle = creep.creepColor;
        context.beginPath();
        context.arc(creep.center.x, creep.center.y, creep.radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
        
        // Health bar
        context.save();
        context.strokeStyle = 'black';
        context.fillStyle = 'green';
        var barHeight = creep.height / 3;
        context.strokeRect(creep.origin.x, creep.origin.y - (barHeight * 2), creep.width, barHeight);
        context.fillRect(creep.origin.x, creep.origin.y - (barHeight * 2), creep.width * creep.healthPercentage(), barHeight);
        context.restore();
    }
    

    //------------------------------------------------------------------
	//
	// Return canvas frame
	//
	//------------------------------------------------------------------
    function canvasFrame() {
        return {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height
        };
    }
    
	return {
		clear : clear,
        getCanvas: function() { return canvas; },
        getContext: function() { return context; },
        canvasFrame: canvasFrame,
		drawRectangle : drawRectangle,
		drawText: drawText,
        drawTower: drawTower,
        drawCreep: drawCreep,
        drawProjectile: drawProjectile,
		measureTextWidth: measureTextWidth,
		measureTextHeight: measureTextHeight
	};
}());
