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
import { getSubjects, getSubjectSubitens } from '../data/subjects';

export default class SubjectSelection extends Phaser.Scene {
    constructor() {
        super({
            key: 'SubjectSelection'
        });
    }

    preload() {
        this.cameras.main.setBackgroundColor('#7fe3f4');
        this.load.atlasXML('grey', greySheetPng, greySheetXml);
        this.load.atlasXML('blue', blueSheetPng, blueSheetXml);
        this.load.atlasXML('green', greenSheetPng, greenSheetXml);
        this.load.bitmapFont('font', fontPng, fontFnt);
        this.load.bitmapFont('font_thin', fontThinPng, fontThinFnt);
    }
    create() {
        this.buttons = {
            normal: [],
            selected: []
        };
        this.subjects = getSubjects();
        this.selected = 0;
        this.panelSelected = 0;
        this.panelButtons = {
            normal: [],
            selected: [],
            texts: []
        };
        this.subitens = [];
        this.panelOpened = false;
        const { centerX, centerY } = this.cameras.main;
        const initX = 180;
        let buttonX = initX;
        let buttonY = centerY - 150;
        let buttonInLine = 1;
        // this.add.sprite(centerX, centerY, 'blue', 'blue_button13.png').setScale(1, 5)
        this.subjects.forEach(s => {
            this.buttons.normal.push(this.add.sprite(buttonX, buttonY, 'grey', 'grey_button15.png'));
            this.buttons.selected.push({
                subject: s.id,
                button: this.add.sprite(buttonX, buttonY, 'green', 'green_button00.png').setVisible(false)
            });
            this.add.bitmapText(buttonX, buttonY, 'font_thin', s.desc, 15)
                .setOrigin(0.5, 0.5)
                .setTintFill(0);
            if (buttonInLine < 3) {
                buttonX += 220;
                buttonInLine++;
                return;
            }
            buttonX = initX;
            buttonY += 60;
            buttonInLine = 1;
        });
        this.add.bitmapText(centerX, 56, 'font', 'Escolha o assunto', 42)
            .setOrigin(0.5, 0.5)
            .setTintFill(0);
        this.panel = this.add.sprite(centerX, centerY, 'grey', 'grey_panel.png')
            .setScale(5, 5)
            .setVisible(false);
        this.updateButtons();

        this.input.keyboard.on('keydown', this.handleKey.bind(this)); // Sem o bind o 'this' fica associado ao evento
    }
    update() {
        // if (this.keys.right.isDown) {
        //     this.selectNext()
        // }
    }
    handleKey({ key }) {
        console.log(key);
        if (this.panelOpened) {
            this.handleKeyPanel(key);
            return;
        }
        switch (key) {
            case 'ArrowRight':
                this.selectNext();
                break;
            case 'ArrowLeft':
                this.selectPrev();
                break;
            case 'ArrowDown':
                this.selectDown();
                break;
            case 'ArrowUp':
                this.selectUp();
                break;
            case ' ':
                this.openPanel();
                break;
            case 'Escape':
                this.scene.start('MainMenu');
                break;
        }
    }
    updateButtons(previousSelected = -1) {
        if (previousSelected > -1) {
            this.buttons.selected[previousSelected].button.setVisible(false);
            this.buttons.normal[previousSelected].setVisible(true);
        }
        this.buttons.selected[this.selected].button.setVisible(true);
        this.buttons.normal[this.selected].setVisible(false);
    }
    selectPrev() {
        if (this.selected === 0) {
            return;
        }
        this.selected--;
        this.updateButtons(this.selected + 1);
    }
    selectNext() {
        if (this.selected === this.subjects.length - 1) {
            return;
        }
        this.selected++;
        this.updateButtons(this.selected - 1);
    }
    selectDown() {
        if (this.selected + 3 > this.subjects.length - 1) {
            return;
        }
        const previousSelected = this.selected;
        this.selected += 3;
        this.updateButtons(previousSelected);
    }
    selectUp() {
        if (this.selected - 3 < 0) {
            return;
        }
        const previousSelected = this.selected;
        this.selected -= 3;
        this.updateButtons(previousSelected);
    }
    openPanel() {
        const subjectSelected = this.buttons.selected[this.selected].subject;
        console.log("Selecionado: ", subjectSelected);
        const { centerX } = this.cameras.main;
        this.panel.setVisible(true);
        this.panelOpened = true;
        let buttonY = 100;
        const subitens = getSubjectSubitens(subjectSelected);
        if (!subitens || !subitens.itens) {
            console.error("Erro ao buscar subitens! Retorno: ", subitens);
            return;
        }
        this.subitens = subitens.itens;
        const scaleX = 2.3;
        const scaleY = 0.5;
        this.subitens.forEach(s => {
            this.panelButtons.normal.push(
                this.add.sprite(centerX, buttonY, 'grey', 'grey_button15.png')
                    .setScale(scaleX, scaleY)
            );
            this.panelButtons.selected.push({
                subitem: s.id,
                button: this.add.sprite(centerX, buttonY, 'green', 'green_button00.png')
                    .setVisible(false)
                    .setScale(scaleX, scaleY)
            });
            this.panelButtons.texts.push(
                this.add.bitmapText(centerX, buttonY, 'font_thin', s.desc, 13)
                    .setOrigin(0.5, 0.5)
                    .setTintFill(0)
            );
            buttonY += 30;
        });
        this.updatePanelButtons();
    }
    closePanel() {
        this.panel.setVisible(false);
        this.panelSelected = 0;
        this.panelOpened = false;
        this.panelButtons.normal.forEach(b => b.destroy());
        this.panelButtons.selected.forEach(b => b.button.destroy());
        this.panelButtons.texts.forEach(t => t.destroy());
        this.panelButtons.normal = [];
        this.panelButtons.selected = [];
        this.panelButtons.texts = [];
    }
    updatePanelButtons(previousSelected = -1) {
        if (previousSelected > -1) {
            this.panelButtons.selected[previousSelected].button.setVisible(false);
            this.panelButtons.normal[previousSelected].setVisible(true);
        }
        this.panelButtons.selected[this.panelSelected].button.setVisible(true);
        this.panelButtons.normal[this.panelSelected].setVisible(false);
    }
    handleKeyPanel(key) {
        switch (key) {
            case 'ArrowDown':
                this.selectPanelNext();
                break;
            case 'ArrowUp':
                this.selectPanelPrev();
                break;
            case ' ':
                this.scene.start('Game', {
                    subject: this.buttons.selected[this.selected].subject,
                    subitem: this.panelButtons.selected[this.panelSelected].subitem
                });
                break;
            case 'Escape':
                this.closePanel();
                break;
        }
    }
    selectPanelPrev() {
        if (this.panelSelected === 0) {
            return;
        }
        this.panelSelected--;
        this.updatePanelButtons(this.panelSelected + 1);
    }
    selectPanelNext() {
        if (this.panelSelected === this.subitens.length - 1) {
            return;
        }
        this.panelSelected++;
        this.updatePanelButtons(this.panelSelected - 1);
    }
}