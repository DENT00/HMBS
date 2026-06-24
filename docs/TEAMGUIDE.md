# 🚀 HMBS Developer Workflow & SOP

Welcome to Sprint 2! Since we are multiple developers working on the same codebase, we must follow strict rules to avoid "Merge Conflicts" (where Git deletes or corrupts our files). Read this before writing any code.

## 📌 Rule 1: Never Code on the Main Branch
The `main` branch is our production code. It must never break. When you want to build a new feature, you must create a copy (a branch) for yourself.

**How to start your work for the day:**
1. Open terminal and update your laptop: `git pull origin main`
2. Create your own branch for your specific task:
   `git checkout -b feature-donor-page` (Name it based on what you are doing)
3. Do your coding in VS Code.

## 📌 Rule 2: The "Stay in Your Lane" Policy
* **Frontend Devs:** If you are building the Donor page, ONLY edit `donors.html` and `donors.js`. Do not touch `inventory.html` if someone else is working on it. 
* **Backend Devs:** Warn the team before you change a database column name, as it will break the frontend's fetch requests.

## 📌 Rule 3: How to Save and Upload Your Work
When you finish your feature and it works locally on your laptop, upload it to GitHub using these commands:
1. `git add .`
2. `git commit -m "Created the UI for the Donor Registration page"`
3. `git push -u origin your-branch-name` (DO NOT type `origin main` here!)
4. Go to GitHub.com and click **"Compare & Pull Request"**. Marcus will review the code and merge it into the main project.

## 🛠️ Local Setup Checklist (Do this once)
1. Run `git clone [Our-GitHub-Link]`
2. Run `npm install` inside the project folder.
3. Create your own `.env` file and put your local MySQL password in it.
4. Open MySQL Workbench and run `hmbs_db.sql` to get your tables.
5. Run `node backend/server.js` to start the server.

## 🚨 Emergency Protocol
If your code breaks, your terminal turns red, or Git gives you an error you don't understand: **STOP TYPING COMMANDS.** Do not try to force it. Message the group chat immediately so we can debug it together without losing data.