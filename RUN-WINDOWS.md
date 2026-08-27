# Run TYPEITTESTIT on Windows

1. Extract this ZIP so `package.json` is directly inside the extracted folder.
2. Open that exact folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Confirm the terminal path is the same folder and run:
   `dir package.json`
5. Install:
   `npm install`
6. Start:
   `npm run dev`

You can also double-click `START-TYPEITTESTIT.bat`; it changes directory to its own location before running npm, which prevents accidentally running npm from another folder.

If npm reports `EPERM mkdir C:\` or `ENOENT C:\package.json`, do not use a second terminal. In VS Code run:
`npm config get prefix`
`npm config get cache`
and verify `dir package.json` from the project folder.
