function Game(rows, cols, blockSize, frame, ctx) {
    this._blockSize = blockSize;
    this._frame = frame;
    this._rows = rows;
    this._cols = cols;
    this._ctx = ctx;
    this._grid;
    this._player;
    this._monsters = [];
    this._balls = [];
    this._intervalId;

    this.init();
}

Game.NUM_OF_LIVES = 10;
Game.CONQUERED_PERCENT_MINIMUM_LIMIT = 75;
Game.NUM_OF_MONSTERS = 1;
Game.NUM_OF_BALLS = 1;
Game.CONQUERED_CELL_COLOR = '#00A8A8';
Game.FREE_CELL_COLOR = '#000000';
Game.BALL_BORDER_COLOR = '#ffffff';
Game.BALL_FILL_COLOR = '#00A8A8';
Game.MONSTER_BORDER_COLOR = '#000000';
Game.MONSTER_FILL_COLOR = '#00A8A8';
Game.PLAYER_BORDER_COLOR = '#901290';
Game.PLAYER_FILL_COLOR = '#FFFFFF';

Game.prototype = {

    init:function () {
        this._grid = new Grid(this._rows, this._cols, 0);

        this._balls = [];
        this._monsters = [];

        for (var i = 0, j = this._cols - 1, k = this._rows - 1; i < this._frame; i++, j--, k--) {
            this._grid.set_row(i, 1);
            this._grid.set_row(k, 1);
            this._grid.set_col(i, 1);
            this._grid.set_col(j, 1);
        }

        //create player
        this._player = new Player(0, this._cols / 2, new Vector(0, 0), this._grid);
        //this._player.addEventListener('conquer', this.onConquer, this);
        //this._player.addEventListener('fail', this.onFail, this);

        //create balls
        for (var i = 0; i < Game.NUM_OF_BALLS; i++) {
            var col = this._random(this._frame, this._cols - this._frame);
            var row = this._random(this._frame, this._rows - this._frame);
            var velocityX = (this._random(0, 1) == 0 ? -1 : 1);
            var velocityY = (this._random(0, 1) == 0 ? -1 : 1);

            var ball = new Ball(row, col, new Vector(velocityX, velocityY), this._grid, 1);

            this._balls.push(ball);
        }

        //create monsters
        for (var i = 0; i < Game.NUM_OF_MONSTERS; i++) {

            var cols_1 = this._random(0, this._frame - 1);
            var cols_2 = this._random(this._cols - this._frame, this._cols - 1);
            var col = this._random(0, 1) == 0 ? cols_1 : cols_2;

            var rows_1 = this._random(0, this._frame - 1);
            var rows_2 = this._random(this._rows - this._frame, this._rows - 1);
            var row = this._random(0, 1) == 0 ? rows_1 : rows_2;

            var velocityX = this._random(0, 1) == 0 ? -1 : 1;
            var velocityY = this._random(0, 1) == 0 ? -1 : 1;

            var monster = new Monster(row, col, new Vector(velocityX, velocityY), this._grid, 0);
            this._monsters.push(monster);
        }

        //TODO: create player

        //this._player.addEventListener('conquer', this._onConquer, this);
        //this._player.addEventListener('fail', this._onFail, this);

        var self = this;

        $(document).keydown(function (event) {
            switch (event.keyCode) {
                case KEY_CODES.LEFT:
                    self._player.moveLeft();
                    break;
                case KEY_CODES.UP:
                    self._player.moveUp();
                    break;
                case KEY_CODES.RIGHT:
                    self._player.moveRight();
                    break;
                case KEY_CODES.DOWN:
                    self._player.moveDown();
                    break;
            }
        });
    },

    start:function () {
        var self = this;

        this._intervalId = setInterval(function () {
            self._ctx.clearRect(0, 0, self._cols * self._blockSize, self._rows * self._blockSize);
            self.step();
            self.draw();
        }, 1000 / 30);

    },

    stop: function () {
        clearInterval(this._intervalId);
    },

    step:function () {
        for (var i = 0; i < this._monsters.length; i++) {
            this._monsters[i].step();
        }

        for (var i = 0; i < this._balls.length; i++) {
            this._balls[i].step();
        }
    },

    end: function () {
        this.stop();
    },

    draw:function () {

        this._grid.draw(this._ctx, this._blockSize, Game.FREE_CELL_COLOR, Game.CONQUERED_CELL_COLOR);

        for (var i = 0; i < this._monsters.length; i++) {
            this._monsters[i].draw(this._ctx, this._blockSize, Game.MONSTER_FILL_COLOR, Game.MONSTER_BORDER_COLOR);
        }

        for (var i = 0; i < this._balls.length; i++) {
            this._balls[i].draw(this._ctx, this._blockSize, Game.BALL_FILL_COLOR, Game.BALL_BORDER_COLOR);
        }
        
        this._player.draw(this._ctx, this._blockSize, Game.PLAYER_FILL_COLOR, Game.PLAYER_BORDER_COLOR);
    },

    addEventListener: function() {

    },

    _random:function (min, max) {
        var val = min + Math.random() * (max - min);
        return Math.round(val);
    },

    _onFail: function(args) {
        this._raiseEvent('fail', args);
    },

    _onConquer: function(args) {
        this._raiseEvent('conquer', args);
    }
};

Game.prototype = $.extend(
    {},
    EventHandler.prototype,
    Game.prototype
);
