'use strict';

const MinecraftUI = (function() {
	document.head.insertBefore(document.createElement("STYLE"), document.head.querySelector("style")).innerHTML = ":root{--mcui-pixel:1px}.mcui{background-size:calc(16*var(--mcui-pixel));display:inline-block;image-rendering:-moz-crisp-edges;image-rendering:-webkit-crisp-edges;image-rendering:pixelated;image-rendering:crisp-edges;margin:0;padding:0}.mcui-pressure-plate{background-color:silver;background-position:calc(var(--mcui-pixel)*-1) calc(var(--mcui-pixel)*-1);margin:var(--mcui-pixel);width:calc(var(--mcui-pixel)*14);height:calc(var(--mcui-pixel)*14)}.mcui-pressure-plate.mcui-active,.mcui-button.mcui-active{box-shadow: 0 0 calc(var(--mcui-pixel)*2) black inset}.mcui-button{background-color:silver;width:calc(var(--mcui-pixel)*1);height:calc(var(--mcui-pixel)*1)}";

	const passive = { "passive": true };

	const x = {};

	const textures = {
		"stone": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAC1SURBVDhPfZLLDcQgDAUplwJypwRKzuqxGjTxsjmM/MPPhqTNOW8zxriv61rg994fOdNw3ECuEiHEEscugTguQo0tBnsDXwFb82DRZmUXiGMRAfesDeqECqJcCZu+xwZ1in2wcFgCwY/ox+MgsXNLwFOTwOK7VonY4yu4eGp2jnzLunFYjTV9Jdd9JuwNjCe81WL3nwgUnI8fvBV2P+Kpgfhf7mcDDr3BQDi+QbAoh137+uP+AHnkd8OaodPkAAAAAElFTkSuQmCC"
	};

	const buttonTypes = {
		"STONE": "stone",
		"ACACIA": "acacia_planks",
		"BIRCH": "birch_planks",
		"DARK_OAK": "dark_oak_planks",
		"JUNGLE": "jungle_planks",
		"OAK": "oak_planks",
		"SPRUCE": "spruce_planks"
	};

	function play(sound, volume, pitch) {
		// Play a sound.
	}

	function deactivateElement(E) {
		E.className = E.className.replace("mcui-active", "");
	}

	function buttonMouseDown() {
		clearTimeout(this.deactivateTimeout);
		if (!(" " + this.className + " ").includes(" mcui-active ")) {
			this.className += " mcui-active";
			play("random.click");
		}
	}

	function buttonMouseEnter(event) {
		clearTimeout(this.deactivateTimeout);
		if (event.buttons)
			if ((" " + this.className + " ").includes(" mcui-active ")) {
				this.className += " mcui-active";
				play("random.click");
			}
	}

	function buttonMouseUp() {
		if ((" " + this.className + " ").includes(" mcui-active ")) {
			clearTimeout(this.deactivateTimeout);
			this.deactivateTimeout = setTimeout(deactivateElement, 1000, this);
			play("random.click");
		}
	}

	Object.defineProperties(x, {
		"createButton": {
			"value": function CREATE_BUTTON(type = "STONE", container) {
				const v = String(type).toUpperCase();
				if (!(v in buttonTypes))
					throw Error("Unknown button variant: " + v);
				const e = document.createElement("DIV");
				e.className = "mcui mcui-button";
				e.style.backgroundImage = "url('" + textures[buttonTypes[v]] + "')";
				e.addEventListener("mousedown", buttonMouseDown, passive);
				e.addEventListener("mouseup", buttonMouseUp, passive);
				e.addEventListener("mouseenter", buttonMouseEnter, passive);
				e.addEventListener("mouseleave", buttonMouseUp, passive);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createPressurePlate": {
			"value": function CREATE_PRESSURE_PLATE(type = "STONE", container) {
				const v = String(type).toUpperCase();
				if (!(v in buttonTypes))
					throw Error("Unknown pressure plate variant: " + v);
				const e = document.createElement("DIV");
				e.className = "mcui mcui-pressure-plate";
				e.style.backgroundImage = "url('" + textures[buttonTypes[v]] + "')";
				e.addEventListener("mouseenter", buttonMouseDown, passive);
				e.addEventListener("mouseleave", buttonMouseUp, passive);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		}
	});

	return x;
})();