import greenSheetXml from '../assets/Spritesheet/greenSheet.xml';
import greenSheetPng from '../assets/Spritesheet/greenSheet.png';
import greySheetXml from '../assets/Spritesheet/greySheet.xml';
import greySheetPng from '../assets/Spritesheet/greySheet.png';
import fontPng from '../assets/Font/font.png';
import fontFnt from '../assets/Font/font.fnt';
import fontThinPng from '../assets/Font/font_thin.png';
import fontThinFnt from '../assets/Font/font_thin.fnt';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    preload() {
        this.cameras.main.setBackgroundColor('#7fe3f4')
        this.load.atlasXML('grey', greySheetPng, greySheetXml)
        this.load.atlasXML('green', greenSheetPng, greenSheetXml)
        this.load.bitmapFont('font', fontPng, fontFnt)
        this.load.bitmapFont('font_thin', fontThinPng, fontThinFnt)
    }
    create() {
        const { centerX, centerY } = this.cameras.main;
        const btnStart = this.add.sprite(centerX, centerY, 'grey', 'grey_button15.png').setVisible(false)
        const btnStartSelected = this.add.sprite(centerX, centerY, 'green', 'green_button00.png')
        const titleText = this.add.bitmapText(centerX, 56, 'font', 'Titulo do jogo', 42)
            .setOrigin(0.5, 0.5)
            .setTintFill(0)
        const startText = this.add.bitmapText(centerX, centerY, 'font_thin', 'Iniciar', 15)
            .setOrigin(0.5, 0.5)
            .setTintFill(0)
        this.keys = this.input.keyboard.addKeys('SPACE')
    }
    update() {
        if (this.keys.SPACE.isDown) {
            this.scene.start('SubjectSelection');
        }
    }
}