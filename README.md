# Phaser 3 RPG Game ⚔️

This is a simple RPG game built mostly from scratch using `Phaser 3`. Not sure what it's going to be like yet, but I'm sure it will be fun!

## The Todo 📋

- In-game cutscenes
- How to manage game animation creation and management
- Dialogue storage location
- ⬇️ Animated tiles

### Known Issues 🐞

- Movement controls go 💥 if you pause the game (and prob is you unfocus browser)
- NPCs with movementCommands won't
  - play interact animations
  - change their movement commands
- Dialogue stopping movement breaks on scene tranisition

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
- Dialogue system
  - get something working
  - make box spawn at the right position even when you have moved away
    - layer multiple scenes: TOOK ME FOREVER... didn't know how default draw order was determined. didn't know it was even a thing
  - dialogue spawning interaction 
  - many dialogue boxes can be spawned at once !?!?!?!? 🤯🤯🤯
- Should all this logic be in the TestScene?
  - after creating the TestScene, it is clear that it should not be. Refactor time!
    - Many refactors to be made 😰
- Did some TODOs
- Interactables still hardcoded in ObjectManager
- NPCs
  - generated by code
  - walk around randomly
    - w collisions
    - w animations
  - talk to them
  - make NPCs not all the same
- Many things to consider.
  - lots of TODOs
  - reconsider approach to composition
    - ❌ *Couldn't get TS mixins to enforce the proper constructor for chained mixins*
  - organize an order of initialization and dependency bind timings
  - typing interactionCommands & movementCommands
- Party
  - narty members follow you
  - not collidable to you or eachother, but are to everything else
  - Party class to abstract party logic from game input manager
- Scene transitions
  - saving scene state
  - load scene diffs based on save file
- 🦗 Activating Dialogue
  - twice doesn't work
    - *space keyup wasn't registering when inputs were disabled*
  - thrice works but breaks your controls
    - *the end dialogue callback was never updated to the proper one past the first*
- Different interactions
  - enter dialogue
    - stops your movement
  - cause animation
  - transition scene
  - move self
  - trigger other objects to do something
    - e.g.
      - move the player
      - make other play animation
  - do muiltiple above actions
- Pause menu
  - inventory
- GameManager
  - ❌ *I don't remember what this was about*
- Dialogue system
  - comb over code again
  - multi-slide dialogue
  - can go through dialogue without mouse
  - can skip through dialogue
  - can respond
  - can offer different responses
- Door, Sign, Photo -> InteractableObj
- BaseObject Class
  - ❌ Try some sort of mixin strat again
    - *did a do all approach*
- ObjectManager registers objects based on non-null abilities
- Other refactors 🤭
- Depth sorting
- Easy scene creation

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
