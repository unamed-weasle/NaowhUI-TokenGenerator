# NaowhUI-TokenGenerator
https://unamed-weasle.github.io/NaowhUI-TokenGenerator/

A GitHub Pages compatible token generator based on this WoW addon flow:

1. `str1 = random digits repeated to (len(serverTime)+1)`
2. `str2 = serverTime - 100`
3. `rawToken = str1 .. "-" .. str2`
4. `compressedToken = CompressString(rawToken)`
5. `encodedToken = Base64(compressedToken)`
6. `token = "!NUI!" .. encodedToken`

## Input behavior

- The default UI asks only for **Epoch Timestamp**.
- **Server Time** is optional and is available in the **Debug values** section.
- If server time is empty, the app infers server time from epoch (`serverTime = epochTimestamp`).
- Use **Update Time** to set epoch timestamp to current Unix time and immediately generate a token.
- You can run `/run local x=GetServerTime() print(x)` in game to capture server time directly.

## Run locally

This is a static site, so you can open `index.html` directly or run a static server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Build and deployment** source to **Deploy from a branch**.
3. Select your branch (`main` or whichever you use) and folder `/ (root)`.
4. Save. GitHub will publish the website URL.

## Notes

- Compression is done in-browser with `pako.deflateRaw`.
- This project is Vibe coded. So if you hate AI, you will have to decide if you hate it more than Add-On paywalls ;)
- Add-On policy reference: <https://us.forums.blizzard.com/en/wow/t/ui-add-on-development-policy/24534>.
