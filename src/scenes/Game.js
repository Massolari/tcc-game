import Phaser from 'phaser';
import greenSheetXml from '../assets/Spritesheet/greenSheet.xml';
import greenSheetPng from '../assets/Spritesheet/greenSheet.png';
import greySheetXml from '../assets/Spritesheet/greySheet.xml';
import greySheetPng from '../assets/Spritesheet/greySheet.png';
import blueSheetXml from '../assets/Spritesheet/blueSheet.xml';
import blueSheetPng from '../assets/Spritesheet/blueSheet.png';
import fontPng from '../assets/Font/font.png';
import fontFnt from '../assets/Font/font.fnt';
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
        this.load.bitmapFont('font', fontPng, fontFnt);
        this.load.bitmapFont('font_thin', fontThinPng, fontThinFnt);
    }
    create() {
        const { ammo, words } = getSubitemWords(this.data);
        this.words = words;
        this.ammo = ammo;
        this.droppedWords = [];
        this.level = 0;
        this.dropTime = 5000;
        this.cameras.main.setBackgroundColor('#7fe3f4');
        this.panel = this.add.sprite(604, 133, 'blue', 'blue_panel.png')
            .setCrop(1, 1, 98, 97)
            .setScale(4, 10);
        const texts = [];
        this.dropWord(5);
        this.dropWordAccordingToLevel();
    }
    update() {
    }
    getRandomNumberUntil(number) {
        return Math.floor(Math.random() * number);
    }
    takeRandomWord() {
        return this.words[this.getRandomNumberUntil(this.words.length)];
    }
    takeRandomWordDesc() {
        return this.takeRandomWord().desc;
    }
    createTextWord(word) {
        return this.add.bitmapText(604, 0, 'font', word, 32)
            .setOrigin(0.5, 0.5)
            .setTintFill(0);
    }
    createRandomTextWord() {
        return this.createTextWord(this.takeRandomWordDesc());
    }
    addCollisionsText(text) {
        this.physics.world.enableBody(text);
        text.body.setCollideWorldBounds(true);
        console.log(text);
        const that = this;
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
}
