app.controller('mainCtrl', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval) {

    var images = imagesArray;
    var randomizedImagesArray;
    var numberOfClicks = 0;
    var firstCellClicked;
    var cellCounter;
    var resete = false;
    var deadLine = 2;
    $scope.boardClass;
    $scope.cells = [];
    $scope.result = null;
    $scope.introModalShown = true;
    $scope.modalShown = false;
    $scope.stopTime = false;
    $scope.pad = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
    //Check which deadline to apply according to the board's size
    function checkDeadLine() {
        if ($scope.boardClass === "small") {
            deadLine = 2;

        } else {
            deadLine = 3;
        }
    }
    //Creates a timer based on two variables -  $scope.minutes & $scope.seconds
    function increaseTime() {
        if ($scope.minutes < deadLine && resete) {
            $scope.seconds++
                if ($scope.seconds % 60 === 0) {
                    $scope.minutes++
                        $scope.seconds = 0;
                }
        }
    }
    //Create a promise which activates the timer
    var promise;

    function activateTimePromis() {
        cancleTimePromis();
        promise = $interval(increaseTime, 1000);
    }

    function cancleTimePromis() {
        $interval.cancel(promise);
    }
    //In case time passes its deadline, inform the user he has lost the game
    $scope.timeWatcher = function() {
        resete = true;
        $scope.$watch("minutes", function(newValue, oldValue, scope) {
            if (newValue === deadLine) {
                cancleTimePromis();
                $scope.minutes = 0;
                $scope.seconds = 0;
                $scope.result = "Lost!";
                $scope.modalShown = true;
            }
        });
    }
    //Get an array and shuffle its contents
    function arrayShuffle(array) {
        var tempArray = array;
        var arrayToReturn = [];
        var randomNumber = Math.floor((Math.random() * tempArray.length));
        while (tempArray.length > 0) {
            randomNumber = Math.floor((Math.random() * tempArray.length));
            arrayToReturn.push(tempArray[randomNumber]);
            tempArray.splice(randomNumber, 1);
        }
        return arrayToReturn;
    }
    //Get an array, shuffle and double its content
    function returnShuffledArray(array) {
        var finaleImagesArray = [];
        var tempImagesArray = angular.copy(array);
        var secondTempImagesArray = angular.copy(array);
        var arrayOne = arrayShuffle(tempImagesArray);
        var arrayTwo = arrayShuffle(secondTempImagesArray);
        finaleImagesArray = arrayOne.concat(arrayTwo);
        return finaleImagesArray;
    }
    //Use arrayShuffle(array) to shuffle the images array whenever a new game starts, according to the board's size
    function setImagesLocationOnBoard(cols, rows) {
        var finaleImagesArray = [];
        var shuffledArray = [];
        shuffledArray = returnShuffledArray(images);
        if (cols === 6 && rows === 6) {
            $scope.boardClass = "big";
            checkDeadLine();
            finaleImagesArray = shuffledArray;
            cellCounter = finaleImagesArray.length / 2;
            return finaleImagesArray;
        } else {
            $scope.boardClass = "small";
            checkDeadLine();
            var smallShuffledArray = [];
            for (var i = 0; i < 8; i++) {
                smallShuffledArray.push(shuffledArray[i]);
            }
            finaleImagesArray = returnShuffledArray(smallShuffledArray);
            cellCounter = finaleImagesArray.length / 2;
            return finaleImagesArray;
        }
    }
    //Create the actual table with cells(using the createCell(imageIndex) function) according to the columns and rows number
    function createBoard(cols, rows) {
        randomizedImagesArray = setImagesLocationOnBoard(cols, rows);
        for (var i = 0; i < randomizedImagesArray.length; i++) {
            var cellObj = createCell(i);
            $scope.cells.push(cellObj);
        }
        $scope.timeWatcher();
    }
    //Create a single cell object
    function createCell(imgIndex) {
        var cellObj = new SingleCell(randomizedImagesArray[imgIndex], false, true);
        return cellObj;
    }
    //Check if all the cells has been clicked
    function isFinished() {
        if (cellCounter > 0) {
            return false;
        } else {
            return true;
        }
    }
    //Cover any situation whenever a cell has been clicked
    $scope.discoverImage = function(cell, cellIndex) {
        if ($scope.modalShown) {
            return;
        } else {
            if (cell.clickable) {
                numberOfClicks++
                cell.discovered = true;
                cell.clickable = false;
                //whenever a second cell has been clicked
                if (numberOfClicks === 2) {
                    //check if the first discovered image equals the second, if so, turn the cell's background to black
                    if (firstCellClicked.img === cell.img) {
                        $timeout(function() {
                            cell.img = blackBackground;
                            $scope.cells[firstCellClicked.index].img = blackBackground;
                            cellCounter--
                            if (isFinished()) {
                                $scope.result = "Won!";
                                $scope.toggleModal();
                            }
                        }, 1000);
                    } else {
                        $timeout(function() {
                            cell.discovered = false;
                            cell.clickable = true;
                            $scope.cells[firstCellClicked.index].discovered = false;
                            $scope.cells[firstCellClicked.index].clickable = true;
                        }, 1000);
                    }
                    numberOfClicks = 0;
                } else {
                    firstCellClicked = cell;
                    firstCellClicked.index = cellIndex;
                }
            }
        }
    }
    //Resete the game and create a new board using the createBoard(cols,rows) function
    $scope.reseteBoard = function() {
        $scope.introModalShown = true;
        cancleTimePromis();
        if ($scope.modalShown) {
            return;
        }
    }
    //Tuggle the result modal in case of winning/loosing
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
        resete = !resete;
    };

    $scope.chooseBoardSize = function(col, rows) {
        $scope.introModalShown = !$scope.introModalShown;
        resete = !resete;
        cancleTimePromis();
        $scope.minutes = 0;
        $scope.seconds = 0;

        $scope.cells = [];
        createBoard(col, rows);
        activateTimePromis();
    };

    $scope.reseteBoard();
    //Start a new game whenever the modal tuggles off
    $scope.$watch("modalShown", function(newValue, oldValue, scope) {
        if (oldValue === true && newValue === false) {
            $scope.introModalShown = true;
        }
    });

}]);
