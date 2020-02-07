module.exports = function (sequelize, DataTypes) {
    var Article = sequelize.define("Article", {
        title: DataTypes.STRING

    });

    return Article;
};
