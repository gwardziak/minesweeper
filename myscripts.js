$(function () {
    var gameBoardWidth = getGameBoardWidth();
    var gameBoardHeight = getGameBoardHeight();
    var gameBoard = fillTwoDimensionalArray(0);
    var visualArray = fillTwoDimensionalArray('_images/field.png');
    var isFieldAlreadyClicked = fillTwoDimensionalArray(false);

    runGame();

    function runGame(){
        addBombsToGameArray();
        setNumberOfBombsAdjacentToField();
        appendElements();
    }

    function getGameBoardWidth() {
        return 8;
    }

    function getGameBoardHeight() {
        return 8;
    }

    function gameGameBoardSize() {
        return gameBoardWidth * gameBoardHeight;
    }

    function setAmountOfBombs() {
        return gameBoardWidth + gameBoardHeight;
    }

    function fillTwoDimensionalArray(value) {
        var array = [];
        for (var i = 0; i < gameBoardHeight; i++) {
            array[i] = [];
            for (var j = 0; j < gameBoardWidth; j++) {
                array[i][j] = value;
            }
        }
        return array;
    }

    function getBombsIndex() {
        var bombsIndex = [];
        var bombs = setAmountOfBombs();
        var gameFields = gameGameBoardSize();
        for (var i = 0; i < bombs; i++) {
            bombsIndex[i] = parseInt(Math.floor(Math.random() * gameFields));
        }
        bombsIndex.sort(function (a, b) {
            return a - b
        });
        checkDifferentBombsIndex(bombsIndex);
        for (i = 0; i < bombs; i++)
            bombsIndex[i] = setIndexOfElement(bombsIndex[i]);
        return bombsIndex;
    }

    function checkDifferentBombsIndex(array) {
        var gameFields = gameGameBoardSize();
        for (var i = 0; i < array.length; i++) {
            if (array[i] == array[i + 1]) {
                array[i + 1] = Math.floor(Math.random() * gameFields);
                array.sort(function (a, b) {
                    return a - b
                });
                i = -1;
            }
        }
    }

    function addBombsToGameArray() {
        var bombs = getBombsIndex();
        for (var i = 0; i < bombs.length; i++) {
            gameBoard[bombs[i][0]][bombs[i][1]] = "bomb";
        }
    }

    function checkTopGameEdge(height) {
        return height - 1 >= 0;
    }

    function checkLeftGameEdge(width) {
        return width - 1 >= 0;
    }

    function checkRightGameEdge(width) {
        return width + 1 < gameBoardWidth;
    }

    function checkBottomGameEdge(height) {
        return height + 1 < gameBoardHeight;
    }

    function setNumberOfBombsAdjacentToField() {
        for (var i = 0; i < gameBoardHeight; i++) {
            for (var j = 0; j < gameBoardWidth; j++) {//TODO to strasznie slabo dziala, jest ogromnie nieczytelnie, do zmiany
                if (gameBoard[i][j] == "bomb") {
                    if (checkTopGameEdge(i) && gameBoard[i - 1][j] != "bomb")
                        gameBoard[i - 1][j] = gameBoard[i - 1][j] + 1;
                    if (checkLeftGameEdge(j) && gameBoard[i][j - 1] != "bomb")
                        gameBoard[i][j - 1] = gameBoard[i][j - 1] + 1;
                    if (checkRightGameEdge(j) && gameBoard[i][j + 1] != "bomb")
                        gameBoard[i][j + 1] = gameBoard[i][j + 1] + 1;
                    if (checkBottomGameEdge(i) && gameBoard[i + 1][j] != "bomb")
                        gameBoard[i + 1][j] = gameBoard[i + 1][j] + 1;
                    if (checkLeftGameEdge(j) && checkTopGameEdge(i) && gameBoard[i - 1][j - 1] != "bomb")
                        gameBoard[i - 1][j - 1] = gameBoard[i - 1][j - 1] + 1;
                    if (checkLeftGameEdge(j) && checkBottomGameEdge(i) && gameBoard[i + 1][j - 1] != "bomb")
                        gameBoard[i + 1][j - 1] = gameBoard[i + 1][j - 1] + 1;
                    if (checkTopGameEdge(i) && checkRightGameEdge(j) && gameBoard[i - 1][j + 1] != "bomb")
                        gameBoard[i - 1][j + 1] = gameBoard[i - 1][j + 1] + 1;
                    if (checkRightGameEdge(j) && checkBottomGameEdge(i) && gameBoard[i + 1][j + 1] != "bomb")
                        gameBoard[i + 1][j + 1] = gameBoard[i + 1][j + 1] + 1;
                }
            }
        }
    }

    function imagesArray() {
        return ['_images/field.png', '_images/flagged.png', '_images/unknown.png'];
    }

    function createGameTable() {
        var id = 0;
        var gameTable = ("<table>");
        for (var i = 0; i < gameBoardHeight; i++) {
            gameTable += ("<tr>");
            for (var j = 0; j < gameBoardWidth; j++) {
                gameTable += ("<td id='" + id + "'><img src='" + visualArray[i][j] + "'/></td>");
                id++;
            }
            gameTable += ("</tr>");
        }
        gameTable += ("</table>");
        return gameTable;
    }

    function appendElements() {
        $("body").append(createGameTable());
        $('span').append("bombs left " + setAmountOfBombs());
    }

    $('td').mousedown(function (event) {
        if (event.which == 3) {
            changeImage(this);
            $(document).on("contextmenu", "td", function (event) {
                event.preventDefault();
                return false;
            });
        }
        else
            discoverField(this);
    });

    function changeImage(element) {
        var images = imagesArray();
        var index = setIndexOfElement(element.id);
        var image = visualArray[index[0]][index[1]];
        if (image == images[0]) {//TODO te ify sa podobne bardzo do siebie, mozna je np do petli wsadzic lub do funkcji
            $(element).find('img').attr('src', images[1]);
            visualArray[index[0]][index[1]] = images[1];
        }
        if (image == images[1]) {
            $(element).find('img').attr('src', images[2]);
            visualArray[index[0]][index[1]] = images[2];
        }
        if (image == images[2]) {
            $(element).find('img').attr('src', images[0]);
            visualArray[index[0]][index[1]] = images[0];
        }
        bombsCounter(visualArray);
    }

    function bombsCounter(array) {
        var bombs = setAmountOfBombs();
        for (var i = 0; i < gameBoardHeight; i++) {
            for (var j = 0; j < gameBoardWidth; j++) {
                if (array[i][j] == '_images/flagged.png')
                    bombs--;
            }
        }
        var span = $('span');
        span.empty();
        span.append("bombs left "+bombs);
    }

//TIME FOR LAWINA HERE

    function discoverField(element) {
        var index = setIndexOfElement(element.id);
        if (!isFieldClicked(index[0], index[1])) {
            if (isBomb(element, index)) {
                console.log("GAME OVER");
            }
            else {
                isFieldEmpty(index, element.id);
            }
        }
    }

    function setIndexOfElement(id) {
        var width = parseInt(gameBoardWidth);
        var height = parseInt(gameBoardHeight);
        if (id >= width) {
            height = Math.floor(id / width);
            width = id % width;
        }
        else {
            width = id;
            height = 0;
        }
        return [parseInt(height), parseInt(width)];
    }

    function isFieldClicked(y, x) {
        return visualArray[y][x] != '_images/field.png';
    }

    function isBomb(element, index) {
        if (gameBoard[index[0]][index[1]] == 'bomb') {
            for (var i = 0; i < gameBoardHeight; i++) {
                for (var j = 0; j < gameBoardWidth; j++) {
                    if (gameBoard[i][j] == "bomb") {
                        var id = i * gameBoardWidth + j;
                        $('#' + id).find('img').attr('src', '_images/showBomb.png');
                    }
                }
            }
            $(element).find('img').attr('src', '_images/clickedBomb.png');
            return true;
        }
        else
            return false;
    }

    function isFieldEmpty(index, id) {
        if (gameBoard[index[0]][index[1]] != 0) {
            var id = $('#' + id);
            id.find('img').remove();
            id.text(gameBoard[index[0]][index[1]]);
            isFieldAlreadyClicked[index[0]][index[1]] = true;
        }
        else {
            floodFill(index[0], index[1]);

        }
    }

    function floodFill(y, x) {
        if ((0 > x || x > gameBoardWidth-1) || (0 > y || y > gameBoardHeight-1)) { //wyjebalem chujowy kod isOutOfArray() i dalem na ten co robliismy po pojanemu na sprawdzanie czy nie wychodzi z planszy

            return;
        }
        if (isFieldClicked(y, x)) {

            return;
        }
        if(isFieldAlreadyClicked[y][x]) {

            return;
        }
        var id = parseInt((y * gameBoardWidth) + x);
        var idJQuery = "#" + id.toString();

        var removeImg = $(idJQuery).find('img').remove()
        if (gameBoard[y][x] > 0) {
            removeImg;
            $(idJQuery).text(gameBoard[y][x]);
            isFieldAlreadyClicked[y][x] = true;

        }
        else {
            removeImg;
            $(idJQuery).text(gameBoard[y][x]);
            isFieldAlreadyClicked[y][x] = true;

            floodFill(y - 1, x - 1);
            floodFill(y - 1, x);
            floodFill(y - 1, x + 1);
            floodFill(y, x - 1);
            floodFill(y, x + 1);
            floodFill(y + 1, x - 1);
            floodFill(y + 1, x);
            floodFill(y + 1, x + 1);

        }
    }

});