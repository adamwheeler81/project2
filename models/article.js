module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define("Article", {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        source: DataTypes.STRING,
        description: DataTypes.STRING,
        url: DataTypes.STRING,
        urlToImage: DataTypes.STRING,
        publishedAt: DataTypes.DATE,
        articleId: DataTypes.STRING
    });

    return Article;
};

