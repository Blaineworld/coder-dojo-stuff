'use strict';

const MinecraftUI = (function() {
	const events = {
		"press": new CustomEvent("press", {}),
		"release": new CustomEvent("release", {}),
		"unpress": new CustomEvent("unpress", {})
	};

	document.head.insertBefore(document.createElement("STYLE"), document.head.querySelector("style")).innerHTML = ":root{--mcui-pixel:1px}.mcui{background-size:calc(16*var(--mcui-pixel));display:inline-block;image-rendering:-moz-crisp-edges;image-rendering:-webkit-crisp-edges;image-rendering:pixelated;image-rendering:crisp-edges;margin:0;padding:0}.mcui-pressure-plate{background-color:silver;background-position:calc(var(--mcui-pixel)*-1) calc(var(--mcui-pixel)*-1);margin:var(--mcui-pixel);width:calc(var(--mcui-pixel)*14);height:calc(var(--mcui-pixel)*14)}.mcui-pressure-plate.mcui-active,.mcui-button.mcui-active{box-shadow: 0 0 calc(var(--mcui-pixel)*2) black inset}.mcui-button{background-color:silver;background-position:calc(var(--mcui-pixel)*-5) calc(var(--mcui-pixel)*-6);margin:calc(var(--mcui-pixel)*6) calc(var(--mcui-pixel)*5);width:calc(var(--mcui-pixel)*6);height:calc(var(--mcui-pixel)*4)}";

	const passive = { "passive": true };

	const x = {};

	const textures = {
		"stone": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAC1SURBVDhPfZLLDcQgDAUplwJypwRKzuqxGjTxsjmM/MPPhqTNOW8zxriv61rg994fOdNw3ECuEiHEEscugTguQo0tBnsDXwFb82DRZmUXiGMRAfesDeqECqJcCZu+xwZ1in2wcFgCwY/ox+MgsXNLwFOTwOK7VonY4yu4eGp2jnzLunFYjTV9Jdd9JuwNjCe81WL3nwgUnI8fvBV2P+Kpgfhf7mcDDr3BQDi+QbAoh137+uP+AHnkd8OaodPkAAAAAElFTkSuQmCC",
		"acacia_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA1ElEQVQ4y4VTIRICQQzLcxgwDAaJxCBQOBSaf5xD4/gAH0DysWWyM9kJoYDodbftbJs0h8dp3e7HVaN/njcf9it+3S8aeNAjNAZvh+V4NPO6s4aGqlBeRbJ8pE/Az2U378az7tN21k05nT1OD2Fkh8SZMYfCHO9vEJSQdz4Squrh+LyDCK2IdF6QWJODzGcNfM/e5Z8WtEr46nLcXKF7cYSK3Wr3mR8TOMZKB55zTcjGBMmFOjhuceO1+KbxHLdaZ9eBF+Z/4Dqo+BkcJDbnwzmp9PECHCoz2n4Vz4IAAAAASUVORK5CYII=",
		"birch_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA00lEQVQ4T31SMQ4CMQzzV5l4AQzsTIiNGSYkJtZjZUPiAfecQiJcfL7AkKZNrDR2gvG+bY9h08KPz/3c/sSvp3VDAj5FwiJ4u6y+RS3Pd2DCUAHpCaJ5kewgjvNhmRZ3vo+7RRpzvGs8PMgxfnCes5hQydz7PaHABL3q4VSJh/LTHyhoJaTqAufqGnjeMV0D51jO3vTIDnR03q6PUD01QqVuNXvP9w6UY7UHmtOdoKHP27TgD+VeCBY+Y+fci4tWSgkKVABF+iXqZA+cm+qhmlT78QLNQ+ggcLCwKwAAAABJRU5ErkJggg==",
		"dark_oak_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzklEQVQ4y31TMQ4CMQzzAxDSsYBuuInlJhATYmBnYuD/bylyJVfGBAZf2iRqYieH5+XQHqd9o31d5y/889+OUwMPeoSg877uxqMZ1505BKpEWSUJ+UjvgJ/zsu3gWfd13nQoprP7aSGOrJA80+dUGOP9g4ICsq5HUlU+nJ9XkKCVkK4LkmtqkPHMgc/Zq1SzTz16Bz66bDdH6FYaoVK3mn3GRwfOsdoDj/lOCNC8UwtVqPbCc/Frx7PdXHMBnpj/ge9Bpc/QILm5Hq5JtR9v52uBCq4zbNAAAAAASUVORK5CYII=",
		"jungle_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0klEQVQ4y31TsQ0CQQzzRpQsgCiofwSKF1R0MAEdLSX9T0DHaId8kk/GBAp/7pLoEjt5PK/7tlymRvu6Hb/wz38/bBp40CMEnY/Tbjyacd2ZQ6BKlFWSkI/0Dvg5T+sOnnWft6sOxXR2Py3EkRWSZ/qcCmO8f1BQQNb1SKrKh/PzChK0EtJ1QXJNDTKeOfA5e5Vq9qlH78BHl+3mCN1KI1TqVrPP+OjAOVZ74DHfCQGad2qhCtVeeC5+7Xi2m2suwBPzP/A9qPQZGiQ318M1qfbjDQFvY4y3zmbRAAAAAElFTkSuQmCC",
		"oak_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA00lEQVQ4y31TMQ4CMQzzg9iZ7wFILMxIt/ABZiZ2FsSGeMKtzHysyJVcGRMYfGmTqImdHJ7XfVsuu0b7us9f+Oe/HacGHvQIQefjvBmPZlx35hCoEmWVJOQjvQN+TvO6g2fdD9tVh2I6u58W4sgKyTN9ToUx3j8oKCDreiRV5cP5eQUJWgnpuiC5pgYZzxz4nL1KNfvUo3fgo8t2c4RupREqdavZZ3x04ByrPfCY74QAzTu1UIVqLzwXv3Y82801F+CJ+R/4HlT6DA2Sm+vhmlT78QZ+7nLGaC/6FAAAAABJRU5ErkJggg==",
		"spruce_planks": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA00lEQVQ4y31SMQ7CQAzzT1iYOyEkOrOxISGhbh26MyJGJn5d5JNcuSZlyOUusS6xE7zHfn4Nh5n+M51+7F98vHQzeNEnNAYf1275NPN6E0NDBaR/3o8LSJaftA54DOd9M971vvW7Zsrp7nF6iCMrJM+MORXm+F5RUELe9UiqwsP5eQUJWgnpuiC5pgaZTwx8zl6lmn3q0Trw0WW7OUL30giVutXsM7904ByrPfCc74QMmndqoQrVXjgWWzue7bpWTgkOdIBE2hJ1tQfJzfVwTar9+ALLJfdgEDC7owAAAABJRU5ErkJggg=="
	};

	const buttonTextures = {
		"STONE": "stone",
		"ACACIA": "acacia_planks",
		"BIRCH": "birch_planks",
		"DARK_OAK": "dark_oak_planks",
		"JUNGLE": "jungle_planks",
		"OAK": "oak_planks",
		"SPRUCE": "spruce_planks"
	}, buttonTypes = [ "STONE", "ACACIA", "BIRCH", "DARK_OAK", "JUNGLE", "OAK", "SPRUCE" ], signTextures = {
		"ACACIA": "acacia_sign",
		"BIRCH": "birch_sign",
		"DARK_OAK": "dark_oak_sign",
		"JUNGLE": "jungle_sign",
		"OAK": "oak_sign",
		"SPRUCE": "spruce_sign"
	}, signTypes = [ "ACACIA", "BIRCH", "DARK_OAK", "JUNGLE", "OAK", "SPRUCE" ];

	function play(sound = "null", volume = 1.0, pitch = 1.0) {
		// Play a sound.
	}

	function deactivateElement(E) {
		// Make an element not active anymore.
		E.className = E.className.replace("mcui-active", "");
		E.dispatchEvent(events.unpress);
	}

	function buttonMouseDown() {
		// When you click on a button.
		clearTimeout(this.deactivateTimeout);
		if (!(" " + this.className + " ").includes(" mcui-active ")) {
			this.className += " mcui-active";
			this.dispatchEvent(events.press);
		}
	}

	function buttonMouseEnter(event) {
		// When your cursor enters a button.
		clearTimeout(this.deactivateTimeout);
		if (event.buttons)
			if ((" " + this.className + " ").includes(" mcui-active ")) {
				this.className += " mcui-active";
				this.dispatchEvent(events.press);
			}
	}

	function buttonMouseUp() {
		// When you unclick on a button.
		if ((" " + this.className + " ").includes(" mcui-active ")) {
			clearTimeout(this.deactivateTimeout);
			this.deactivateTimeout = setTimeout(deactivateElement, 1000, this);
			this.dispatchEvent(events.release);
		}
	}

	Object.defineProperties(x, {
		"createButton": {
			"value": function CREATE_BUTTON(type = "STONE", container = document.body) {
				// Create an HTML Minecraft button.
				let v = String(type).toUpperCase();
				if (!(v in buttonTextures))
					if (v === "RANDOM")
						v = buttonTypes[Math.floor(Math.random() * buttonTypes.length)];
					else
						throw Error("Unknown button variant: " + v);
				const e = document.createElement("DIV");
				e.className = "mcui mcui-button";
				e.style.backgroundImage = "url('" + textures[buttonTextures[v]] + "')";
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
			"value": function CREATE_PRESSURE_PLATE(type = "STONE", container = document.body) {
				// Create an HTML Minecraft pressure plate.
				let v = String(type).toUpperCase();
				if (!(v in buttonTextures))
					if (v === "RANDOM")
						v = buttonTypes[Math.floor(Math.random() * buttonTypes.length)];
					else
						throw Error("Unknown pressure plate variant: " + v);
				const e = document.createElement("DIV");
				e.className = "mcui mcui-pressure-plate";
				e.style.backgroundImage = "url('" + textures[buttonTextures[v]] + "')";
				e.addEventListener("mouseenter", buttonMouseDown, passive);
				e.addEventListener("mouseleave", buttonMouseUp, passive);
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		},
		"createSign": {
			"value": function CREATE_SIGN(type = "OAK", container = document.body) {
				// Create an HTML Minecraft sign.
				let v = String(type).toUpperCase();
				if (!(v in signTypes))
					if (v === "RANDOM")
						v = signTypes[Math.floor(Math.random() * signTypes.length)];
					else
						throw Error("Unknown sign variant: " + v);
				const e = document.createElement("DIV");
				e.className = "mcui mcui-sign";
				e.style.backgroundImage = "url('" + textures[signTextures[v]] + "')";
				if (container instanceof Element)
					container.appendChild(e);
				return e;
			}
		}
	});

	return x;
})();