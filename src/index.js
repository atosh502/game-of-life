import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

class Box extends React.Component{

    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
    }

    render(){
        return(
            <div 
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }
}

class Grid extends React.Component{
    render(){
        const width = this.props.cols * 14;
        var rowArray = [];

        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++){
            for (var j = 0; j < this.props.cols; j++){

                let boxID = i + "_" + j;
                // for choosing the right CSS
                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";

                rowArray.push(
                    <Box
                        row={i}
                        col={j}
                        key={boxID}
                        boxID={boxID}
                        boxClass={boxClass}
                        selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return(
            <div className="grid" style={{width: width}}>
                {rowArray}
            </div>
        );
    }
}

class Buttons extends React.Component{

    handleSelect = (evt) => {
        this.props.gridSize(evt);
    }

    render(){
        return(
            <div className="center">

                <ButtonToolbar>

                    <button className="btn btn-default" onClick={this.props.playButton}>
                    Play
                    </button>

                    <button className="btn btn-default" onClick={this.props.pauseButton}>
                    Pause
                    </button>

                    <button className="btn btn-default" onClick={this.props.clear}>
                    Clear
                    </button>

                    <button className="btn btn-default" onClick={this.props.slow}>
                    Slow
                    </button>

                    <button className="btn btn-default" onClick={this.props.fast}>
                    Fast
                    </button>

                    <button className="btn btn-default" onClick={this.props.seed}>
                    Seed
                    </button>

                    <DropdownButton
                        title="Grid Size"
                        id="size-menu"
                        onSelect={this.handleSelect}
                    >

                        <MenuItem eventKey="1">20*10</MenuItem>
                        <MenuItem eventKey="2">50*30</MenuItem>
                        <MenuItem eventKey="3">70*50</MenuItem>

                    </DropdownButton>

                </ButtonToolbar>

            </div>
        );
    }
}

class Main extends React.Component{
    constructor(){
        super();

        // create some rows and cols
        this.rows = 30;
        this.cols = 50;

        this.speed = 100;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
        }
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        
        for (let i = 0; i < this.rows; i++){
            for (let j = 0; j < this.cols; j++){
                if (Math.floor(Math.random() * 4) === 1){
                    gridCopy[i][j] = true;
                }
            }
        }

        this.setState({
            gridFull: gridCopy
        });
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        
        gridCopy[row][col] = !gridCopy[row][col];

        console.log("Cell selected");        
        this.setState({
            gridFull: gridCopy
        });
    }

    playButton = () => {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(this.play, this.speed);
    }

    pauseButton = () => {
        clearInterval(this.intervalID);
    }

    slow = () => {
        this.speed = 1000;
        this.playButton();
    }

    fast = () => {
        this.speed = 100;
        this.playButton();
    }

    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.setState({
            gridFull: grid, 
            generation: 0
        });
    }

    gridSize = (size) => {
        switch (size){
            case "1":
                this.cols = 20;
                this.rows = 10;
            break;

            case "2":
                this.cols = 50;
                this.rows = 30;
            break;

            default:
                this.cols = 70;
                this.rows = 50;
            break;
        }
    
        this.clear();
    }

    play = () => {
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              let count = 0;
              if (i > 0) if (g[i - 1][j]) count++;
              if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
              if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
              if (j < this.cols - 1) if (g[i][j + 1]) count++;
              if (j > 0) if (g[i][j - 1]) count++;
              if (i < this.rows - 1) if (g[i + 1][j]) count++;
              if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
              if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
              if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
              if (!g[i][j] && count === 3) g2[i][j] = true;
            }
        }

        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1
        });
    }

    componentDidMount(){
        this.seed();
        this.playButton();
    }

    render(){
        return(
            <div>
                <h1>The Game of Life</h1>
                <Buttons
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    seed={this.seed}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    gridSize={this.gridSize}
                />
                <Grid 
                    rows={this.rows}
                    cols={this.cols}
                    gridFull={this.state.gridFull}
                    selectBox={this.selectBox}
                />
                <h2>Generations: {this.state.generation}</h2>
            </div>
        );
    }
}

function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));
