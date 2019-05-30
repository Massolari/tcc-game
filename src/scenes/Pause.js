import greenSheetXml from '../assets/Spritesheet/greenSheet.xml';
import greenSheetPng from '../assets/Spritesheet/greenSheet.png';
import greySheetXml from '../assets/Spritesheet/greySheet.xml';
import greySheetPng from '../assets/Spritesheet/greySheet.png';
import fontPng from '../assets/Font/font.png';
import fontFnt from '../assets/Font/font.fnt';
import fontThinPng from '../assets/Font/font_thin.png';
import fontThinFnt from '../assets/Font/font_thin.fnt';

export default class Pause extends Phaser.Scene {
    constructor() {
        super({
            key: 'Pause'
        });
    }

    preload() {
        this.cameras.main.setBackgroundColor('#7fe3f4');
        this.load.atlasXML('grey', greySheetPng, greySheetXml);
        this.load.atlasXML('green', greenSheetPng, greenSheetXml);
        this.load.bitmapFont('font', fontPng, fontFnt);
        this.load.bitmapFont('font_thin', fontThinPng, fontThinFnt);
    }
    create() {
        const { centerX } = this.cameras.main;
        this.buttonSelected = 0;
        this.buttons = [];
        this.add.bitmapText(centerX, 60, 'font', 'Jogo Pausado', 42)
            .setOrigin(0.5, 0.5)
            .setTintFill(0);
        this.createButton('Continuar', 160);
        this.createButton('Reiniciar', 260);
        this.createButton('Como jogar', 360);
        this.createButton('Sair', 460);
        this.input.keyboard.on('keydown', this.handleKey.bind(this)); // Sem o bind o 'this' fica associado ao evento
        this.updateButtons();
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
                this.handleChoice();
                break;
            case 'Escape':
                this.backToGame();
                break;
        }
    }
    updateButtons(previousSelected = -1) {
        if (previousSelected > -1) {
            this.buttons[previousSelected].clearTint();
        }
        this.buttons[this.buttonSelected].setTint(0x88e060);
    }
    selectUp() {
        if (this.buttonSelected === 0) {
            return;
        }
        this.buttonSelected--;
        this.updateButtons(this.buttonSelected + 1);
    }
    selectDown() {
        if (this.buttonSelected === this.buttons.length - 1) {
            return;
        }
        this.buttonSelected++;
        this.updateButtons(this.buttonSelected - 1);
    }
    backToGame() {
        this.scene.stop();
        this.scene.resume('Game');
    }
    handleChoice() {
        switch (this.buttonSelected) {
            case 0:
                this.backToGame();
                break;
            case 1:
                this.scene.stop('Game');
                this.scene.start('Game');
                break;
            case 3:
                this.scene.stop('Game');
                this.scene.start('SubjectSelection');
                break;
        }
    }
    createButton(text, posY) {
        const { centerX } = this.cameras.main;
        this.buttons.push(this.add.sprite(centerX, posY, 'grey', 'grey_button15.png'));
        this.add.bitmapText(centerX, posY, 'font_thin', text, 15)
            .setOrigin(0.5, 0.5)
            .setTintFill(0);
    }
    update() { }
}