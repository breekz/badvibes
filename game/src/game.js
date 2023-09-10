class Game extends Phaser.Scene{
	constructor(){
		super({
			key: "Game",
			physics: {
				default: "arcade",
				arcade: {
					debug: false
				}
			}
		});
	}
	preload(){
		this.load.setBaseURL("assets");

		this.load.image("cursor", "goodguy.png");
		this.load.image("enemy", "badvibes2.png");
		this.load.image("play", "play.png");
	}
	create(){
		this.loaded();
		this.createBackground();
		this.createTimer();
		this.createEnemies();
		this.createCursor();
	}
	createBackground(){
		this.cameras.main.setBackgroundColor("#000");
	}
	createGameOver(){
		document.body.style.cursor = "default";

		this.gameOverText = this.add.text(600, 350, "Game Over", {
		    font: "35px Arial",
		    fill: "#fff",
		    stroke: "#fff",
		    strokeThickness: 1
		}).setOrigin(0.5);

		this.playButton = this.physics.add.image(600, 400, "play").setScale(0.3).setInteractive();

		this.playButton.on("pointerdown", () => {
			this.tweens.add({
				targets: this.playButton,
				scale: 0.2,
				duration: 100,
				onComplete: () => {
					this.tweens.add({
						targets: this.playButton,
						scale: 0.3,
						duration: 100,
						onComplete: () => {
							this.restart();
						}
					});
				}
			});
		});
	}
	createTimer(){
		this.timerCount = 0;

		this.timerEvent = this.time.addEvent({
		    delay: 1000,
		    loop: true,
		    callback: () => {
		        this.timerCount++;

		        const minutes = Math.floor(this.timerCount/60);
		        const seconds = this.timerCount % 60;
		        const formattedMinutes = String(minutes).padStart(2, "0");
		        const formattedSeconds = String(seconds).padStart(2, "0");

		        this.timerText.setText(`${formattedMinutes}:${formattedSeconds}`);
		    
		        if (this.timerCount % 10 === 0){
		        	if (this.enemyInterval > 100){
			        	this.enemyInterval -= 50;

			        	this.enemyEvent.delay = this.enemyInterval;
			        }

		        	this.enemySpeed += 50;
		        }
		    }
		});

		this.timerText = this.add.text(600, 300, "00:00", {
		    font: "70px Arial",
		    fill: "#fff",
		    stroke: "#fff",
		    strokeThickness: 1
		}).setOrigin(0.5);
	}
	createCursor(){
		this.cursor = this.physics.add.image(600, 300, "cursor").setScale(0.45);
	
		this.cursorBody = this.physics.add.image(this.cursor.x, this.cursor.y, "cursor").setScale(0.2).setVisible(false);

		this.cursor.setSize(170, 80);

		this.cursorBody.setSize(220, 240);

		this.physics.add.overlap(this.cursor, this.enemies, () => {
			this.over();
		});

		this.physics.add.overlap(this.cursorBody, this.enemies, () => {
			this.over();
		});
	}
	createEnemy(){
		const enemy = this.physics.add.image(Phaser.Math.Between(0, 1200), Phaser.Math.Between(-500, -100), "enemy").setScale(0.45);
	
		this.enemies.add(enemy);

		enemy.setSize(230, 180);

		enemy.flipX = Phaser.Math.Between(0, 1);

		enemy.setGravityY(Phaser.Math.Between(10 + this.enemySpeed, 100 + this.enemySpeed));
	}
	createEnemies(){
		this.enemies = this.physics.add.group();

		this.enemyInterval = 500;

		this.enemySpeed = 0;

		this.enemyEvent = this.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				this.createEnemy();
			}
		});
	}
	over(){
		this.createGameOver();

		this.cursor.destroy();

		this.cursorBody.destroy();

		this.enemyEvent.destroy();

		this.enemies.clear(true, true);

		this.timerEvent.destroy();
	}
	restart(){
		document.body.style.cursor = "none";

		this.gameOverText.destroy();

		this.playButton.destroy();

		this.timerText.destroy();

		this.createTimer();

		this.createEnemies();

		this.createCursor();
	}
	loaded(){
		this.loader = document.querySelector("#loader");

		this.loader.remove();
	}
	update(){
		if (this.cursor){
			const activePointer = this.input.manager.activePointer;
		
			this.cursor.setPosition(activePointer.x, activePointer.y);
		
			this.cursorBody.setPosition(this.cursor.x, this.cursor.y + 20);
		}
	}
}

const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: 1200,
	height: 600,
	parent: "game",
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [Game]
});

document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});