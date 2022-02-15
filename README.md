# Phaser 3 RPG Game ⚔️

This is a simple RPG game built mostly from scratch using `Phaser 3`. Not sure what it's going to be like yet, but I'm sure it will be fun!

## The Todo 📋

- Dialogue system
  - ✅ get something working
  - ✅ make box spawn at the right position even when you have moved away
    - layer multiple scenes: TOOK ME FOREVER... didn't know how default draw order was determined. didn't know it was even a thing
  - ✅ dialogue spawning interaction 
  - many dialogue boxes can be spawned at once !?!?!?!? 🤯🤯🤯
- Should all this logic be in the TestScene?
  - after creating the TestScene, it is clear that it should not be. Refactor time!
- Get an idea of what the game will be about
  - generate more todos

### Known Issues 🦗

- my game is perfect ;]

### The Done ✅

- Set up Phaser 3 + TypeScript
- Add webpack
- Static maps from tiled
- Get a character working
  - movement
  - animations
  - idles
- Lock character movements to 16x16 grid
  - took a lot longer than I expected...
  - mirrors [Annoraaq's grid engine](https://github.com/Annoraaq/grid-engine)
- Add babel 🤷 seems like not needed for our purposes

---

### Resource Attribution

Based on:
- [this Phaser 3 + TS guide](https://spin.atomicobject.com/2019/07/13/phaser-3-typescript-tutorial/)
- [and this RPG guide](https://gamedevacademy.org/how-to-create-a-turn-based-rpg-game-in-phaser-3-part-1/)
- [making maps & grid movement; very good 👍](https://medium.com/swlh/grid-based-movement-in-a-top-down-2d-rpg-with-phaser-3-e3a3486eb2fd)
- [dialogue box](https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/)

Pixel art:
- [alot: kenney.nl](https://kenney.nl/assets)
- [player](https://opengameart.org/content/tiny-characters-set)
- [more tiles](https://opengameart.org/content/zelda-like-tilesets-and-sprites)
- [reaper](http://finalbossblues.com/timefantasy/freebies/grim-reaper-sprites/)
