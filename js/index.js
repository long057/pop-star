
var squareWidth = 50; // 星星宽高
var boardWidth = 10;  // 星星的行列
var squareSet = [];   //星星的集合 二维数组
var table = document.getElementById('pop_star');
var choose = []; // 选中的星星的数组
var timer = null;
var baseScore = 5;
var stepScore = 10;
var totalScore = 0;
var targetScore = 2000;
var flag = true;
var tempSquare = null;


function init() {
    // 初始化星星面板
    for(var i = 0; i < boardWidth; i ++) {
        squareSet[i] = new Array();
        for(var j = 0; j < boardWidth; j ++) {
            var temp = createSquare(Math.floor(Math.random() * 5), i, j);
            temp.addEventListener('mouseover', function () {
                mouseOver(this);
            }, false);
            temp.addEventListener('click', function () {
                if(!flag || choose.length == 0) {
                    return;
                }
                flag = false;
                tempSquare = null;
                // 分数增加
                var score = 0;
                for(var i = 0; i < choose.length; i ++) {
                    score += baseScore + stepScore * i;
                }
                totalScore += score;
                document.getElementById('now_score').innerHTML = '当前分数：' + totalScore;
                // 消失
                for(var i = 0; i < choose.length; i ++) {
                    (function (i)  {
                        setTimeout(function (){
                            squareSet[choose[i].row][choose[i].col] = null;
                            table.removeChild(choose[i]);
                        }, i * 100)
                    })(i)
                }
                // 移动
                setTimeout(function () {
                    move();
                    setTimeout(function () {
                        var is = isFinish();
                        if(is) {
                            if(totalScore >= targetScore) {
                                alert('恭喜过关');
                            } else {
                                alert('游戏失败');
                            }
                            window.location.reload();
                        } else {
                            if(totalScore > targetScore) {
                                alert('恭喜过关');
                                window.location.reload();
                            }
                            choose = [];
                            flag = true;
                            // console.log(tempSquare);
                            mouseOver(tempSquare);
                        }
                    }, 300 + choose.length * 100)
                }, choose.length * 100)
            }, false)
            squareSet[i][j] = temp;
            table.appendChild(temp);
        }
    }
    refresh();

}

// 创建每一个小星星
function createSquare (num, row, col) {
    var temp = document.createElement('div');
    temp.style.width = squareWidth + 'px';
    temp.style.height = squareWidth + 'px';
    temp.style.display = 'inline-block';
    temp.style.position = 'absolute';
    temp.style.boxSizing = 'border-box';
    temp.style.borderRadius = '10px';
    temp.style.cursor = 'pointer';
    temp.num = num;
    temp.row = row;
    temp.col = col;
    return temp;
}

// 将星星渲染到页面
function refresh () {
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].row = i;
            squareSet[i][j].col = j;
            squareSet[i][j].style.transition = 'left  .3s, bottom .3s';
            squareSet[i][j].style.left = j * squareWidth + 'px';
            squareSet[i][j].style.bottom = i * squareWidth + 'px';
            squareSet[i][j].style.background = 'url("./img/' + squareSet[i][j].num + '.png")';
            squareSet[i][j].style.backgroundSize = 'cover';
            squareSet[i][j].style.transform = 'scale(0.95)';
        }
    }
}

// 鼠标进入星星
function mouseOver (obj) {
    if(!flag) {
        tempSquare = obj;
        return;
    }
    goBack(); // 还原
    choose = [];
    checkLinked(obj, choose);
    if(choose.length <= 1) {
        choose = [];
        return;
    }
    flicker(choose);
    selectedScore(choose);
}

// 递归将相同颜色的星星放入数组中。
function checkLinked (square, arr) {
    if(square == null) {
        return;
    }
    arr.push(square);
    // 判断左边的星星
    if(square.col != 0 && squareSet[square.row][square.col - 1] && arr.indexOf(squareSet[square.row][square.col - 1]) == -1 && square.num == squareSet[square.row][square.col - 1].num) {
        checkLinked(squareSet[square.row][square.col - 1], arr);
    }
    // 判断右边的星星
    if(square.col != boardWidth - 1 && squareSet[square.row][square.col + 1] && arr.indexOf(squareSet[square.row][square.col + 1]) == -1 && square.num == squareSet[square.row][square.col + 1].num) {
        checkLinked(squareSet[square.row][square.col + 1], arr);
    }
    // 判断上边的星星
    if(square.row != 0 && squareSet[square.row - 1][square.col] && arr.indexOf(squareSet[square.row - 1][square.col]) == -1 && square.num == squareSet[square.row -1][square.col].num) {
        checkLinked(squareSet[square.row - 1][square.col], arr);
    }
    // 判断下边的星星
    if(square.row != boardWidth - 1 && squareSet[square.row + 1][square.col] && arr.indexOf(squareSet[square.row + 1][square.col]) == -1 && square.num == squareSet[square.row + 1][square.col].num) {
        checkLinked(squareSet[square.row + 1][square.col], arr);
    }
}

// 相连的星星闪烁
function flicker (arr) {
    var num = 0;
    timer = setInterval(function () {
        for(var i = 0; i < arr.length; i ++) {
            
            arr[i].style.border = '3px solid #BFEFFF';
            arr[i].style.transform = 'scale(' + (0.9 + 0.05 * Math.pow(-1, num)) + ')';
        }
        num ++;
    }, 300)
    
}

// 当前鼠标位置的闪烁，其他的不闪烁
function goBack () {
    if(timer !== null) {
        clearInterval(timer);
    }
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].style.border = '0px';
            squareSet[i][j].style.transform = 'scale(0.95)';
        }
    }
}

// 计算选中的星星的分数
function selectedScore (arr) {
    var score = 0;
    var selectedScoreNode = document.getElementById('selected_score');
    for(var i = 0; i < arr.length; i ++) {
        score += baseScore + i * stepScore;
    }
    selectedScoreNode.innerHTML = arr.length + '块 ' + score + '分';
    selectedScoreNode.style.transition = null;
    selectedScoreNode.style.opacity = 1;
    setTimeout(function () {
        selectedScoreNode.style.transition = 'opacity 1s';
        selectedScoreNode.style.opacity = 0;
    }, 1000)
    
}

function move() {
    // 向下移动
    for(var i = 0; i < boardWidth; i ++) { // 列
        var pointer = 0;
        for(var j = 0; j < boardWidth; j ++) {
            if(squareSet[j][i] != null) {
                if(j !== pointer) {
                    squareSet[pointer][i] = squareSet[j][i];
                    squareSet[j][i].row = pointer;
                    squareSet[j][i] = null;
                }
                pointer ++;
            }

        }
    }
    // 横向运动
    for(var i = 0; i < squareSet[0].length; ) {
        if(squareSet[0][i] == null) {
            for(var j = 0; j < boardWidth; j ++) {
                squareSet[j].splice(i, 1);
            }
            continue;
        }
        
        i ++;
    }
    refresh();
}

function isFinish () {
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] == null) {
                continue;
            }
            var temp = [];
            checkLinked(squareSet[i][j], temp);
            if(temp.length > 1) {
                return false;
            }
        }
    }
    return true;
}



window.onload = function () {
    init();
}