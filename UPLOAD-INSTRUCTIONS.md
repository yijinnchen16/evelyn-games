# Multi-game GitHub Pages update

This package adds:

- A new game-selection page at the repository root
- Jonah and Noel's Asteroid Assault under `games/asteroid-assault/`
- A destination folder for Evelyn's existing game under `games/feed-the-snake/`

## Important: preserve Evelyn's current game first

Your current root contains Evelyn's game:

```text
index.html
game.js
style.css
assets/
```

Before uploading this package, copy those existing files into:

```text
games/feed-the-snake/
├── index.html
├── game.js
├── style.css
└── assets/
```

Do not delete the originals until the copied game works at:

```text
https://yijinnchen16.github.io/evelyn-games/games/feed-the-snake/
```

## Then upload this package

Upload/merge these package files into the repository root:

```text
index.html
games/
  asteroid-assault/
    index.html
    assets/
  feed-the-snake/
```

When GitHub asks about duplicate files, replace only the root `index.html`.
Do not overwrite Evelyn's copied files inside `games/feed-the-snake/`.

## Final URLs

Game menu:

```text
https://yijinnchen16.github.io/evelyn-games/
```

Evelyn's Feed the Snake:

```text
https://yijinnchen16.github.io/evelyn-games/games/feed-the-snake/
```

Jonah and Noel's Asteroid Assault:

```text
https://yijinnchen16.github.io/evelyn-games/games/asteroid-assault/
```
