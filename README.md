# Sorry Cutie 💙

## Before sending it to her
1. **Email key:** go to https://web3forms.com, enter your email, and paste the key you receive into `web3formsKey` in `config.js`. Until you do, you will **not** be notified.
2. **Text:** check the reasons, promises and captions in `config.js`. The sorry screen says "Aaj" (today), so change it if you send this later.
3. **Photos:** already added. To change them, add `assets/photos/1.jpg`, `2.jpg` and so on, matching the list in `config.js`. Remove location (GPS) data **before committing them**. Without any photos, the memories page is skipped on the live site.
4. **Stitch art:** already added. To change it, add images to `assets/stitch/` and set their paths under `stitch` in `config.js`.
5. **Music:** already added at `assets/music/song.mp3` (trimmed to start at 0:25 of the original).

## Preview
    python3 -m http.server 8000
Then open http://localhost:8000

## Testing the email
Click through and press Yes, then check your inbox and spam folder.
The email is sent only once per browser. Add `?reset` to the address to test again.

## Good to know
- A free GitHub Pages site and its repo are public, including your letter, photos and song.
- Anyone who reads the code can see the Web3Forms key and send you a message with it.
- Public copyrighted art or music can lead to a takedown.
