# ALServerWebApp

brew install node npm
git clone <lerepo> 
cd <repo> 
npm install 
npm start


To publish web app : 
Stop any running npm server if you have one running
At the project root, run the following commands:

npm run dist
npm run deploy
The first one compiles the production files into dist/ directory
The second one pushes dist to gezeppelin bucket using aws s3 sync
