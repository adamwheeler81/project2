TICKR

As a consumer, I want access to various news outlets. I want the freedom to search specific topics and have a multitude of results to choose from.
The user will be prompted with a web authentication and will be able to save articles
to their accounts.
Separate API keys are used to grab articles from varying sources such as author, topic, news outlet, etc.

Requirements/node dependencies:
User will need to run 'npm install' to install required dependencies to include:
"express": "^4.16.3",
"express-handlebars": "^3.1.0",
"mysql2": "^1.6.4",
"newsapi": "^2.4.0",
"nodemon": "^2.0.2",
"sequelize": "^5.21.4"

Running the app:
App can be utlized by running "node server.js".
A MYSQL database called 'Tickr" needs to be created along with a config.json containing the user's database info.

CSS used:
Materialize CSS

Ideas for future development:
