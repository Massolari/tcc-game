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
import { selectButton, deselectButton, createButton } from '../modules/ui';

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
        this.buttons = [];
        this.subjects = getSubjects();
        this.selected = 0;
        this.panelSelected = 0;
        this.panelButtons = [];
        this.subitens = [];
        this.panelOpened = false;
        const { centerX, centerY } = this.cameras.main;
        const initX = 180;
        let buttonX = initX;
        let buttonY = centerY - 150;
        let buttonsOnLine = 1;
        this.subjects.forEach(s => {
            const { button } = createButton(this, s.desc, { posX: buttonX, posY: buttonY });
            this.buttons.push({
                subject: s.id,
                button
            });
            if (buttonsOnLine < 4) {
                buttonX += 220;
                buttonsOnLine++;
                return;
            }
            buttonX = initX;
            buttonY += 60;
            buttonsOnLine = 1;
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
    update() { }
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
            deselectButton(this.buttons[previousSelected].button);
        }
        selectButton(this.buttons[this.selected].button);
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
        const subjectSelected = this.buttons[this.selected].subject;
        console.log("Selecionado: ", subjectSelected);
        this.panel.setVisible(true);
        this.panelOpened = true;
        let buttonY = 180;
        const subitens = getSubjectSubitens(subjectSelected);
        if (!subitens || !subitens.itens) {
            throw new Error(`Erro ao buscar subitens! Retorno: ${JSON.stringify(subitens)}`);
        }
        this.subitens = subitens.itens;
        const scaleX = 2.3;
        const scaleY = 0.5;
        this.subitens.forEach(s => {
            const button = createButton(this, s.desc, { posY: buttonY, fontSize: 13, scaleX, scaleY });
            this.panelButtons.push({ ...button, subitem: s.id });
            buttonY += 30;
        });
        this.updatePanelButtons();
    }
    closePanel() {
        this.panel.setVisible(false);
        this.panelSelected = 0;
        this.panelOpened = false;
        this.panelButtons.forEach(b => {
            b.button.destroy();
            b.label.destroy();
        });
        this.panelButtons = [];
    }
    updatePanelButtons(previousSelected = -1) {
        if (previousSelected > -1) {
            deselectButton(this.panelButtons[previousSelected].button);
        }
        selectButton(this.panelButtons[this.panelSelected].button);
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
                    subject: this.buttons[this.selected].subject,
                    subitem: this.panelButtons[this.panelSelected].subitem
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