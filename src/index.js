import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu"
import SubjectSelection from "./scenes/SubjectSelection"
import Game from "./scenes/Game"

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: [MainMenu, SubjectSelection, Game],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true
    }
  }
};

const game = new Phaser.Game(config);