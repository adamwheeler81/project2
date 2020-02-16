module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define("Article", {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        source: DataTypes.STRING,
        description: DataTypes.TEXT,
        url: DataTypes.TEXT,
        urlToImage: DataTypes.TEXT,
        publishedAt: DataTypes.DATE,
        articleId: DataTypes.TEXT
    });

    return Article;
};

