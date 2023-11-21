# CSCE310

Main branch protected!
* use the development branch to implement and test changes
* PR to merge dev into main when necessary
* PR's require 1 other member approval before pushing

## NodeJS Set-up
This project is using NodeJS v16.14.x, so you need to download this version specifically. If you are on mac, this is fairly simple using Homebrew. If you are on Windows you will need to download directly from the NodeJS website
* If you already have NodeJS installed (or if you want to check if you do), open a terminal and run `node -v`
* If the version is 16.14.x then you can skip to environment set-up
* If you already have NodeJS and it is not version 16.14.x, then you need to uninstall it first

### NodeJS Mac Set-up
1. Make sure you have Homebrew installed (https://brew.sh/)
2. Once brew is installed, open a terminal and run `brew install node@16.14`
3. Check to make sure node is installed at the right version (`node -v`)

### NodeJS Windows Set-up
1. Download NodeJS 16.14.0 from the NodeJS website (I think this is the link for it... https://nodejs.org/en/blog/release/v16.14.0)
2. Open an integrated terminal in VSCode and check Node is installed at the right version (`node -v`)
3. If you get an error saying node cannot be found or the version is incorrect, restart your computer and then check again

## Environment Set-up
**IMPORTANT: Make sure you checkout the development branch from the github. There should never be a direct push to the main branch!**
1. Clone the repo to your computer
2. Open VSCode and checkout the development branch
3. Open the integrated terminal in VSCode, and make sure you are cd'd to the base of the repo (~/CSCE310)
4. Run the following commands (Steps 5 - 10) in order:
5. `npm i`
6. `cd client`
7. `npm i`
8. `npm build`
9. `cd ../`
10. `npm build`
* **IMPORTANT: If you see "High Vulnerability" errors or something similar during the running of the above commands, do not worry! Those are only there because we are using an older version of React (one that is compatible with NodeJS v16.14.x)**

## Environment Set-up
The server requires environment variables to run, which is a secret file that cannot be pushed to Github and has information required to connect to our database. In order to be able to access any data, you need to follow the following steps:
1. At the base of the project (~/CSCE310), create a new file called `.env`
2. Inside the file, copy exactly the information I sent to our groupchat, so it looks like the photo

## Checking to make sure it all works
Ok, hopefully everything works now, so we need to test and see if you can successfully host the website from your local machine. You should still be in the development branch on the GitHub!
1. Make sure you are at the root of the project (~/CSCE310)
2. In the integrated terminal in VSCode, run the following command:
* For Mac:
`npm run dev`
* For Windows:
`npm run dev-windows`
3. This command should launch your default browser and open up the website at localhost:3000
4. You may see an `Error: listen EADDRINUSE: address already in use :::5000` error after running the launch command, you can ignore that for now as long as the server launches and your browser opens with the website
4. Once on the website, you should see a login and register page
5. Register an account for yourself and then try to log in
6. If you successfully get to the logged in screen that greets you, then everything works :D 
7. To kill the server, go back to the integrated terminal in VSCode and Ctrl+C

## If you run into any errors, please text the group chat and I can help solve anything you run into :D