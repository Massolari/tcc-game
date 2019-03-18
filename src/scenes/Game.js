import Phaser from 'phaser';
import greenSheetXml from '../assets/Spritesheet/greenSheet.xml';
import greenSheetPng from '../assets/Spritesheet/greenSheet.png';
import greySheetXml from '../assets/Spritesheet/greySheet.xml';
import greySheetPng from '../assets/Spritesheet/greySheet.png';
import blueSheetXml from '../assets/Spritesheet/blueSheet.xml';
import blueSheetPng from '../assets/Spritesheet/blueSheet.png';
// import fontPng from '../assets/Font/font.png';
// import fontFnt from '../assets/Font/font.fnt';
import joystixFontPng from '../assets/Font/joystix/joystix-font.png';
import joystixFontFnt from '../assets/Font/joystix/joystix-font.fnt';
import fontThinPng from '../assets/Font/font_thin.png';
import fontThinFnt from '../assets/Font/font_thin.fnt';
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
        this.load.bitmapFont('joystixFont_thin', fontThinPng, fontThinFnt);
    }
    create() {
        const { ammo, words } = getSubitemWords(this.data);
        this.words = words;
        this.ammo = ammo;
        this.droppedWords = [];
        this.level = 8;
        this.dropTime = 5000;
        this.gameOver = false;
        this.cameras.main.setBackgroundColor('#7fe3f4');
        this.panelX = 550;
        this.panelY = 133;
        this.panel = this.add.sprite(this.panelX, this.panelY, 'blue', 'blue_panel.png')
            // .setCrop(1, 1, 98, 97)
            .setScale(5, 10);
        this.dropWord(5);
        // setTimeout(this.dropWordAccordingToLevel.bind(this), this.dropTime);
        setTimeout(() => {
            this.createRandomTextAmmo();
            this.dropWordAccordingToLevel();
        }, this.dropTime);
    }
    update() {
        if (this.gameOver) {
            return;
        }
        this.checkGameOver();
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
        console.log(firsWordDropped.y);
        return this.add.bitmapText(50, firsWordDropped.y, 'joystixFont', word, 28)
            .setOrigin(0, 0.5);
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
        this.physics.add.collider(text, this.droppedWords, (s1, s2) => {
            const b1 = s1.body;
            const b2 = s2.body;

            if (b1.y > b2.y) {
                b2.y += (b1.top - b2.bottom);
                b2.stop();
                return;
            }
            b1.y += (b2.top - b1.bottom);
            b1.stop();
        });
        this.lastDroppedWord = text;
        text.body.setCollideWorldBounds(true);
    }
    dropWord(count = 1) {
        const text = this.createRandomTextWord();
        this.addCollisionsText(text);
        this.droppedWords.push(text);
        count--;
        if (count <= 0) {
            return;
        }
        setTimeout(() => this.dropWord(count), 650);
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
    createPlayer() {
        this.player = this.createTextAmmo();
    }
    checkGameOver() {
        if (this.lastDroppedWord && this.lastDroppedWord.body.touching.down && this.lastDroppedWord.body.y < 0) {
            this.add.text(400, 300, 'GAME OVER', { fontSize: 42, fill: '#000' }).setOrigin(0.5, 0.5);
            this.gameOver = true;
            clearInterval(this.dropTimer);
            this.lastDroppedWord.body.setCollideWorldBounds(false);
        }
    }
}
