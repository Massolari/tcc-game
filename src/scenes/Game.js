import Phaser from 'phaser';
import greenSheetXml from '../assets/Spritesheet/greenSheet.xml';
import greenSheetPng from '../assets/Spritesheet/greenSheet.png';
import greySheetXml from '../assets/Spritesheet/greySheet.xml';
import greySheetPng from '../assets/Spritesheet/greySheet.png';
import blueSheetXml from '../assets/Spritesheet/blueSheet.xml';
import blueSheetPng from '../assets/Spritesheet/blueSheet.png';
import fontPng from '../assets/Font/font.png';
import fontFnt from '../assets/Font/font.fnt';
import joystixFontPng from '../assets/Font/joystix/joystix-font.png';
import joystixFontFnt from '../assets/Font/joystix/joystix-font.fnt';
// import fontThinPng from '../assets/Font/font_thin.png';
// import fontThinFnt from '../assets/Font/font_thin.fnt';
import { getSubitemWords } from '../data/subjects';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }
    init(data) {
        this.data = data;
    }
    preload() {
        this.cameras.main.setBackgroundColor('#7fe3f4');
        this.load.atlasXML('grey', greySheetPng, greySheetXml);
        this.load.atlasXML('green', greenSheetPng, greenSheetXml);
        this.load.atlasXML('blue', blueSheetPng, blueSheetXml);
        this.load.bitmapFont('joystixFont', joystixFontPng, joystixFontFnt);
        this.load.bitmapFont('font', fontPng, fontFnt);
    }
    create() {
        const { ammo, words } = getSubitemWords(this.data);
        this.words = words;
        this.ammo = ammo;
        this.droppedWords = [];
        this.level = 0;
        this.dropTime = 5000;
        this.gameOver = false;
        this.cameras.main.setBackgroundColor('#7fe3f4');
		this.wordHeight = 33.44;
        this.panelX = 555;
        this.panelY = 133;
		this.selectedWord = 0;
		this.createPanel();
		this.score = 0;
		this.scoreText = this.add.bitmapText(16, 10, 'joystixFont', '', 23).setTint(0);
		this.levelText = this.add.bitmapText(this.cameras.main.width - 160, 10, 'joystixFont', '', 23).setTint(0);
		this.updateScoreText();
		this.updateLevelText();
		this.dropWord(5).then(() => {
            this.player = this.createRandomTextAmmo();
            this.dropWordAccordingToLevel();
		});
        this.input.keyboard.on('keydown', this.handleKey.bind(this));
		console.log('teste');
    }
    update() {
    }
	createPanel() {
		this.panel = this.add.sprite(this.panelX, this.panelY, 'blue', 'blue_panel.png')
            .setCrop(1, 1, 98, 97)
            .setScale(5, 10);
		this.panelFloor = this.physics.add.sprite(this.panelX, 600, 'blue', 'blue_button04.png')
			.setScale(2, 0.75)
			.setOrigin(0.5, 1)
			.setVisible(true);
		this.panelFloor.body.setCollideWorldBounds(true);
	}
	updateScoreText() {
		this.scoreText.text = `Pontos: ${this.score}`;
	}
	updateLevelText() {
		this.levelText.text = `Nível: ${this.level + 1}`;
	}
	addScore(value) {
		this.score += value;
		this.updateScoreText();
		if ((this.score % 100) === 0) {
			this.raiseLevel();
		}
	}
	raiseLevel() {
		this.level++;
		this.updateLevelText();
		this.dropWordAccordingToLevel();
	}
	handleKey({ key }) {
		console.log(key);
        switch (key) {
            case 'ArrowDown':
                this.selectDown();
                break;
            case 'ArrowUp':
                this.selectUp();
                break;
            case ' ':
                this.shoot();
                break;
            case 'Escape':

                break;
        }
	}
	selectDown() {
		this.selectedWord--;
		if (this.selectedWord < 0 || !this.droppedWords[this.selectedWord].body.touching.down) {
			// this.selectedWord = this.getLastWordTouchingDown();
			this.selectedWord++;
		}
		console.log(this.droppedWords);
		this.player.y = this.droppedWords[this.selectedWord].y;
	}
	getLastWordTouchingDown(index = -1) {
		if (index === -1) {
			index = this.droppedWords.length - 1;
		}
		if (!this.droppedWords[index].body.touching.down) {
			return this.getLastWordTouchingDown(index - 1);
		}
		return index;
	}
	selectUp() {
		this.selectedWord++;
		if (this.selectedWord > this.droppedWords.length - 1 || !this.droppedWords[this.selectedWord].body.touching.down) {
			// this.selectedWord = 0;
			this.selectedWord--;
		}
		this.player.y = this.droppedWords[this.selectedWord].y;
	}
	shoot() {
		const positionX = this.player.x + (this.player.width / 2);
		const positionY = this.player.y + (this.player.height / 4);
		const bullet = this.physics.add.sprite(positionX, positionY, 'green', 'green_sliderRight.png')
			.setOrigin(0.5, 1)
			.setScale(1, 0.5);
		const playerAmmo = this.ammo.find(a => a.desc === this.player.text);
		if (!playerAmmo) {
			console.error('Player ammo not found');
			return;
		}
		bullet.power = playerAmmo.id;
		bullet.setVelocityX(500);
		bullet.body.setAllowGravity(false);
		bullet.body.onWorldBounds = true;
		bullet.body.setCollideWorldBounds(true);
		bullet.body.world.on('worldbounds', function(b) {
			b.gameObject.setActive(false);
			b.gameObject.setVisible(false);
			b.destroy();
		});
		this.physics.add.overlap(bullet, this.droppedWords, this.handleWordShot.bind(this));
		this.changePlayerAmmo();
	}
	changePlayerAmmo() {
		let newText = this.takeRandomAmmoDesc();
		while (newText === this.player.text) {
			newText = this.takeRandomAmmoDesc();
		}
		this.player.text = newText;
	}
	handleWordShot(bullet, wordObject) {
		const word = this.words.find(w => w.desc === wordObject.text);
		bullet.destroy();
		if (bullet.power === word.weakness) {
			this.droppedWords.splice(this.droppedWords.indexOf(wordObject), 1);
			this.addScore(10);
			wordObject.destroy();
			return;
		}
		this.dropWord();
	}
    getRandomNumberUntil(number) {
        return Math.floor(Math.random() * number);
    }
    takeRandomAmmo() {
        return this.ammo[this.getRandomNumberUntil(this.ammo.length)];
    }
    takeRandomWord() {
        return this.words[this.getRandomNumberUntil(this.words.length)];
    }
    takeRandomAmmoDesc() {
        return this.takeRandomAmmo().desc;
    }
    takeRandomWordDesc() {
        return this.takeRandomWord().desc;
    }
    createTextAmmo(word) {
        const firsWordDropped = this.droppedWords[0];
        return this.add.bitmapText(145, firsWordDropped.y, 'joystixFont', word, 28)
            .setOrigin(0.5, 0.5);
    }
    createRandomTextAmmo() {
        return this.createTextAmmo(this.takeRandomAmmoDesc());
    }
    createTextWord(word) {
        return this.add.bitmapText(this.panelX, 0, 'joystixFont', word, 28)
            .setOrigin(0.5);
    }
    createRandomTextWord() {
        return this.createTextWord(this.takeRandomWordDesc());
    }
    addCollisionsText(text) {
        this.physics.world.enableBody(text);
		this.physics.add.collider(text, this.panelFloor, this.preventFallThrough);
        this.physics.add.collider(text, this.droppedWords, this.preventFallThrough);
        this.lastDroppedWord = text;
        text.body.setCollideWorldBounds(true);
    }
	preventFallThrough(s1, s2) {
		const b1 = s1.body;
		const b2 = s2.body;

		if (b1.y > b2.y) {
			b2.y += (b1.top - b2.bottom);
			b2.stop();
			return;
		}
		b1.y += (b2.top - b1.bottom);
		b1.stop();
	}
    dropWord(count = 1) {
		return new Promise(resolve => {
			if (this.droppedWords.length > 0) {
				const towerHeight = this.droppedWords.length * this.droppedWords[0].height;
				if (towerHeight > this.cameras.main.worldView.height) {
					this.endGame();
					resolve();
					return;
				}
			}
			const text = this.createRandomTextWord();
			this.addCollisionsText(text);
			this.droppedWords.push(text);
			count--;
			if (count <= 0) {
				resolve();
				return;
			}
			setTimeout(() => {
				this.dropWord(count).then(() => {
					resolve();
				});
			}, 650);
		});
    }
    dropWordEvery(time) {
        return setInterval(this.dropWord.bind(this), time);
    }
    dropWordAccordingToLevel() {
        if (this.dropTimer) {
            clearInterval(this.dropTimer);
        }
        this.dropTimer = this.dropWordEvery(this.dropTime - (this.level * 500));
    }
    endGame() {
		this.add.text(400, 300, 'GAME OVER', { fontSize: 42, fill: '#000' }).setOrigin(0.5, 0.5);
		this.gameOver = true;
		clearInterval(this.dropTimer);
		this.lastDroppedWord.body.setCollideWorldBounds(false);
    }
}
