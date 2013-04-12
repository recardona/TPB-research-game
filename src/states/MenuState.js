/*
 *
 * MenuState is our lobby/welcome menu were gamer can chose start, high score and settings.
 * For this example we have only implemented start. Start switches active game state by simply:
 *   jaws.switchGameState(play)   (jaws.switchGameState(PlayState) would have worked too)
 *
 */
function MenuState() {
	var index = 0;
	var items = ["Start"];
	var title_anim;
	var title_img;
	var lightbulb_on = true;

	this.setup = function() {
		index = 0;
		jaws.on_keydown(["down", "s"], function() {
			index++;
			if (index >= items.length) {
				index = items.length - 1
			}
		});
		jaws.on_keydown(["up", "w"], function() {
			index--;
			if (index < 0) {
				index = 0
			}
		});
		jaws.on_keydown(["enter", "space"], function() {
			if (items[index] == "Start") {
				jaws.switchGameState(PlayState, {
					fps : 41
				})
			}
		});
		title_anim = new jaws.Animation({
			sprite_sheet : "./assets/art/title_animation.png",
			frame_size : [874, 579],
			loop : true
		});
		title_img = new jaws.Sprite({
			x : jaws.width / 2,
			y : jaws.height / 2,
			anchor : "center"
		});
		title_img.setImage(title_anim.next());
	}

	this.update = function() {
		if (lightbulb_on) {
			var rand = random_sigmoid();

			if (rand > 0.8 || rand < -0.8) {
				rand = Math.abs(rand);
				lightbulb_on = false;
				title_img.setImage(title_anim.next());
				setTimeout(function() {
					lightbulb_on = true;
				}, 750 * rand);
			}
		}
	}

	this.draw = function() {
		jaws.context.clearRect(0, 0, jaws.width, jaws.height);
		title_img.draw();
		for (var i = 0; items[i]; i++) {

			jaws.context.font = "36pt Denk One";
			jaws.context.lineWidth = 20;
			jaws.context.fillStyle = (i == index) ? "#E5F361" : "#62625F";
			jaws.context.strokeStyle = "rgba(200,200,200,0.0)";
			jaws.context.fillText(items[i], jaws.width * 3 / 4, jaws.height * 7 / 8 + i * (50));
		}
	}
}