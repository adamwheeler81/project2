module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define("Article", {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        url: DataTypes.STRING,
        urlToImage: DataTypes.STRING
    });

    return Article;
};
