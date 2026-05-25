# Tic Tac Toe Live

A modern Tic Tac Toe game with share-link multiplayer. One player creates a room, copies the invite link, and another player opens the same link to join the match.

## Run locally

```sh
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Play with a friend

1. Open the app.
2. Enter your name.
3. Click **Create room**.
4. Copy the invite link and send it to your friend.
5. Your friend opens the link, enters their name, and clicks **Join room**.

The app uses browser peer-to-peer data connections for live moves, so both players should keep the game tab open while playing.

## Tech stack

- Vite
- React
- Tailwind CSS
- shadcn-ui
- PeerJS browser signaling

## Deploy

This is still a normal Vite app, so it can be published with Lovable or any static hosting provider. After deployment, share the deployed app link, create a room there, and send that invite link to the second player.
