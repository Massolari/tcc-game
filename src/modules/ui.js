export const createButton = (scene, text, { posX, posY, scaleX, scaleY, font = 'font_thin', fontSize = 15 } = {}) => {
    if (!scene) {
        throw new Error('É obrigatório passar a scene');
    }
    if (!text) {
        throw new Error('É obrigatório passar o texto do botão');
    }
    if (scaleY && !scaleX) {
        throw new Error('Para usar o scaleY deve se passar o scaleX');
    }
    if (!posX) {
        posX = scene.cameras.main.centerX;
    }
    if (!posY) {
        posY = scene.cameras.main.centerY;
    }
    const button = scene.add.sprite(posX, posY, 'grey', 'grey_button15.png');
    const label = scene.add.bitmapText(posX, posY, font, text, fontSize)
        .setOrigin(0.5, 0.5)
        .setTintFill(0);

    if (scaleX) {
        if (scaleY) {
            button.setScale(scaleX, scaleY)
        } else {
            button.setScale(scaleX)
        }
    }
    return { button, label };
}

export const selectButton = (button) => button.setTint(0x88e060);

export const deselectButton = (button) => button.clearTint();
