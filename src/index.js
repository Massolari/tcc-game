import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import SubjectSelection from "./scenes/SubjectSelection";
import Game from "./scenes/Game";

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 600,
    scene: [MainMenu, SubjectSelection, Game],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    }
};

new Phaser.Game(config);
// const game = new Phaser.Game(config);