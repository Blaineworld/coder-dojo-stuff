'use strict';

const MinecraftUI = (function() {
	let sound = false, graphics = true, graphicsTimeout = -1;

	const events = {
		"press": new CustomEvent("press", {}),
		"release": new CustomEvent("release", {}),
		"unpress": new CustomEvent("unpress", {})
	};

	if (!document.head.querySelector("#mcui-stylesheet")) {
		let e;

		var fancyGraphics = e = document.head.insertBefore(document.createElement("LINK"), document.head.querySelector("style, link[rel=\"stylesheet\"]"));
		e.href = "mcui/fancy.css";
		e.id = "mcui-fancy-stylesheet";
		e.rel = "stylesheet";

		e = document.head.insertBefore(document.createElement("LINK"), document.head.querySelector("style, link[rel=\"stylesheet\"]"));
		e.id = "mcui-stylesheet";
		e.rel = "stylesheet";
		e.href = "mcui/main.css";
	}

	const passive = { "passive": true };

	const x = {};

	const buttonTypes = [ "stone", "acacia", "birch", "dark_oak", "jungle", "oak", "spruce" ],
		signTypes = [ "acacia", "birch", "dark_oak", "jungle", "oak", "spruce" ];

	async function soundEnded() {
		// When a sound is done playing.
		await this.parentElement.removeChild(this);
	}

	async function play(file = "null", volume = 1.0, pitch = 1.0) {
		// Play a sound.
		if (!sound)
			return;
		const e = await document.head.appendChild(await document.createElement("audio"));
		e.src = "mcui/sounds/" + file + ".ogg";
		await e.addEventListener("ended", soundEnded, passive);
		await e.addEventListener("error", soundEnded, passive);
		e.autoplay = true;
	}

	async function setGraphics(setting) {
		fancyGraphics.disabled = graphics;
	}

	async function deactivateElement(E, e) {
		// Make an element not active anymore.
		E.className = await E.className.replace("mcui-active", "");
		await E.dispatchEvent(events.unpress);
		if (e)
			await play("random/click");
		delete E.deactivateTimeout;
	}

	async function buttonMouseDown() {
		// When you click on a button.
		if (await (" " + this.className + " ").includes(" mcui-locked "))
			return;
		await clearTimeout(this.deactivateTimeout);
		if (!await (" " + this.className + " ").includes(" mcui-active ")) {
			this.className += " mcui-active";
			await this.dispatchEvent(events.press);
			await play("random/click");
		}
	}

	async function buttonMouseEnter(event) {
		// When your cursor enters a button.
		if (await (" " + this.className + " ").includes(" mcui-locked "))
			return;
		if (event.buttons) {
			await clearTimeout(this.deactivateTimeout);
			if (!await (" " + this.className + " ").includes(" mcui-active ")) {
				this.className += " mcui-active";
				await this.dispatchEvent(events.press);
				await play("random/click");
			}
		}
	}

	async function buttonMouseUp() {
		// When you unclick on a button.
		if (await (" " + this.className + " ").includes(" mcui-locked "))
			return;
		if (await (" " + this.className + " ").includes(" mcui-active ")) {
			await clearTimeout(this.deactivateTimeout);
			this.deactivateTimeout = await setTimeout(deactivateElement, 1000, this, "random/click");
			await this.dispatchEvent(events.release);
		}
	}

	const commonProperties = {
		"active": {
			"get": function() {
				return (" " + this.className + " ").includes(" mcui-active ");
			},
			"set": function(state) {
				clearTimeout(this.deactivateTimeout);
				this.className = this.className.replace("mcui-active", "");
				if (state)
					this.className += " mcui-active";
			},
			"enumerable": true
		},
		"locked": {
			"get": function() {
				return (" " + this.className + " ").includes(" mcui-locked ");
			},
			"set": function(state) {
				clearTimeout(this.deactivateTimeout);
				this.className = this.className.replace("mcui-locked", "");
				if (state)
					this.className += " mcui-locked";
			},
			"enumerable": true
		}
	}, buttonProperties = {
		"down": {
			"get": function() {
				return this.active;
			},
			"set": function(state) {
				this.active = state;
			},
			"enumerable": true
		},
		"press": {
			"value": function() {
				clearTimeout(this.deactivateTimeout);
				this.className += " mcui-active";
				this.deactivateTimeout = setTimeout(deactivateElement, 1000, this, "random/click");
				this.dispatchEvent(events.press);
				play("random/click");
			}
		}
	}, redstoneLampProperties = {
		"lit": {
			"get": function() {
				return this.active;
			},
			"set": function(state) {
				this.active = state;
			},
			"enumerable": true
		},
		"deactivate": {
			"value": function() {
				// Yes, it even has the 4-tick delay!
				clearTimeout(this.deactivateTimeout);
				this.deactivateTimeout = setTimeout(deactivateElement, 200, this);
			}
		}
	};

	Object.defineProperties(x, {
		"version": {
			"enumerable": true,
			"value": "alpha-rd"
		},
		"graphics": {
			"enumerable": true,
			"get": function() {
				if (graphics)
					return "Fast";
				return "Fancy";
			},
			"set": function(setting) {
				graphics = String(setting).toUpperCase() !== "FANCY";
				if (graphicsTimeout < 0)
					graphicsTimeout = setTimeout(setGraphics, 1);
			}
		},
		"sound": {
			"enumerable": true,
			"get": function() {
				if (sound)
					return "On";
				return "Off";
			},
			"set": function(setting) {
				sound = String(setting).toUpperCase() === "ON";
			}
		},
		"createButton": {
			"value": function CREATE_BUTTON(type = "stone", container = document.body) {
				// Create an HTML Minecraft button.
				let v = String(type).toLowerCase();
				if (!buttonTypes.includes(v))
					if (v === "random")
						v = buttonTypes[Math.floor(Math.random() * buttonTypes.length)];
					else
						throw Error("Unknown button variant: " + v);
				if (v !== "stone")
					v += "_planks";
				const e = document.createElement("DIV");
				e.className = "mcui mcui-button";
				e.style.backgroundImage = "url('mcui/textures/block/" + v + ".gif')";
				e.addEventListener("mousedown", buttonMouseDown, passive);
				e.addEventListener("mouseup", buttonMouseUp, passive);
				e.addEventListener("mouseenter", buttonMouseEnter, passive);
				e.addEventListener("mouseleave", buttonMouseUp, passive);
				Object.defineProperties(e, commonProperties);
				Object.defineProperties(e, buttonProperties);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createItemFrame": {
			"value": function CREATE_REDSTONE_LAMP(container = document.body) {
				// Create an HTML Minecraft sign.
				const e = document.createElement("DIV");
				e.className = "mcui mcui-item-frame";
				Object.defineProperties(e, commonProperties);
				Object.defineProperties(e, redstoneLampProperties);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createPressurePlate": {
			"value": function CREATE_PRESSURE_PLATE(type = "stone", container = document.body) {
				// Create an HTML Minecraft pressure plate.
				let v = String(type).toLowerCase();
				if (!buttonTypes.includes(v))
					if (v === "random")
						v = buttonTypes[Math.floor(Math.random() * buttonTypes.length)];
					else
						throw Error("Unknown pressure plate variant: " + v);
				if (v !== "stone")
					v += "_planks";
				const e = document.createElement("DIV");
				e.className = "mcui mcui-pressure-plate";
				e.style.backgroundImage = "url('mcui/textures/block/" + v + ".gif')";
				e.addEventListener("mouseenter", buttonMouseDown, passive);
				e.addEventListener("mouseleave", buttonMouseUp, passive);
				Object.defineProperties(e, commonProperties);
				Object.defineProperties(e, buttonProperties);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createRedstoneLamp": {
			"value": function CREATE_REDSTONE_LAMP(lit = false, container = document.body) {
				// Create an HTML Minecraft sign.
				const e = document.createElement("DIV");
				e.className = "mcui mcui-redstone-lamp";
				if (Boolean(lit))
					e.className += " mcui-active";
				Object.defineProperties(e, commonProperties);
				Object.defineProperties(e, redstoneLampProperties);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createWallSign": {
			"value": function CREATE_WALL_SIGN(type = "oak", container = document.body) {
				// Create an HTML Minecraft sign.
				let v = String(type).toLowerCase();
				if (!signTypes.includes(v))
					if (v === "random")
						v = signTypes[Math.floor(Math.random() * signTypes.length)];
					else
						throw Error("Unknown sign variant: " + v);
				const e = document.createElement("PRE");
				e.className = "mcui mcui-wall-sign";
				e.style.backgroundImage = "url('mcui/textures/entity/signs/wall/" + v + ".gif')";
				Object.defineProperties(e, commonProperties);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		}
	});

	addEventListener("load", async () => graphicsTimeout = await setTimeout(setGraphics, 10));

	graphicsTimeout = setTimeout(setGraphics, 10);

	return x;
})();