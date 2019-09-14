'use strict';

{
	let e = document.scrollingElement;

	const infinityRegex = /Infinity/g; // Regexes are objects, people!

	var parallax = async function(v = e.scrollTop, h = e.scrollLeft) {
		// Update the parallax effect.
		let d = 0, x = "";
		for await (d of layers)
			x += -(h / d || 0) + "px " + -(v / d || 0) + "px,";
		e.style.backgroundAttachment = "fixed";
		e.style.backgroundPosition = await x.substr(0, x.length - 1).replace(infinityRegex, "0");
	};

	const meta = document.querySelector('meta[name="parallax-layers"]');

	let layers = [];

	if (meta)
		layers = meta.content.split(" ");

	Object.defineProperties(parallax, {
		"initialize": {
			"value": element => {
				if (element instanceof Element)
					e = element;
				else
					if (typeof element === "string")
						e = document.querySelector(element) || e;
				addEventListener("scroll", async () => await parallax(), { "passive": true });
				return e;
			}
		},
		"init": {
			"get": () => parallax.initialize
		},
		"element": {
			"get": () => e,
			"set": element => {
				if (typeof element === "string")
					e = document.querySelector(element) || e;
				else
					if (e instanceof Element)
						e = e;
			}
		},
		"layers": {
			"get": () => Array.from(layers),
			"set": depths => layers = Array.from(depths)
		},
		"version": {
			"value": "0.2.0"
		}
	});

	console.info("Parallax scrolling script made with 🌙 by Blaine Hargett.");
}