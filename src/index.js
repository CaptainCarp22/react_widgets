import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import xImg from './x_icon.png'
import oImg from './o_icon.png'
import './index.css';

function Text(props) {
  return <div style={{color:props.txtColor}}>
    <h1>Color-Changing Background</h1>
    <p><b>Change the number values below to change the color of the background
          and this text (which will be the inverse of the background).</b></p>
  </div>
}

function Color(props) {
  return <form>
    <label style={{display:'inline-block', width:'250px', marginBottom:'10px', 
                   backgroundColor:'white', color:props.colorName}}>
      <b>{props.colorName+": "}</b>
      <span style={{float: 'right'}}>
        <input type="range"
          min="0" max="255"
          value = {props.col}
          onChange={(e) => props.setCol(Number(e.target.value))}/>
        <input type="number"
          min="0" max="255"
          value = {props.col}
          onChange={(e) => props.setCol(Number(e.target.value))}
          style={{width:'50px', color:props.colorName, border:'none', backgroundColor:'rgb(0,0,0,0)'}}/>
        <input type="submit" style={{visibility: 'hidden', width:'0px', height:'0px'}} disabled />
      </span>
    </label>
  </form>
}

function to2DigitHex(num) {
  if(num<0) return "00";
  else if(num>255) return "ff"
  else {
    let ret = "";
    if(num<16) ret+="0";
    return ret+num.toString(16);
} }

function Input(props) {
  let inputStyle = {width: '250px', margin:'4px 0'};
  if(props.enabled) {
    return <div><input type="text" value={props.val} style={inputStyle}
      onChange={(e) => props.changeList(props.list.map((v, i) => {
        if(i === props.k) {return e.target.value;} 
        else {return v;}
      }))} placeholder='Enter something'/>
      <input type="button" value="X" style={{marginLeft:'4px', color:'red'}} onClick={
        () => props.changeList(props.list.filter((v,i) => i !== props.k))}/></div>
  } else {
    return <p style={inputStyle}><b>{"- "+props.val}</b></p>
  }
}

function GameSquare(props) {
  if(props.val===0) {return <button class="square" 
    onClick={() => props.takeTurn(props.row, props.col)} disabled={props.done}/>
  } else {
    let imgSrc = props.val===1 ? xImg : oImg;
    let altTxt = props.val===1 ? "X Square" : "O Square"
    return <div class="square"><img src={imgSrc} style={{width:'90%'}} alt={altTxt}/></div>
} }

function ToRender() {
  const [redVal, setRed] = useState(200);
  const [greVal, setGre] = useState(200);
  const [bluVal, setBlu] = useState(200);
  const [itemList, setList] = useState([]);
  const [listEditable, setEditable] = useState(false);
  const [currTurn, setTurn] = useState(1);
  const [numTurns, setNumTurns] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameGrid, setGameGrid] = useState([[0,0,0],[0,0,0],[0,0,0]])

  function takeTurn(r, c) {
    setGameGrid(gameGrid.map((arr,i) => arr.map((v,j) => {
      if(i===r && j===c) return currTurn; else return v;})));
    setTurn(currTurn===1 ? 2 : 1); setNumTurns(numTurns+1);
  }

  //Check if Tic-Tac-Toe game has been won after move has been made
  useEffect(() => {
    if(numTurns===9) setGameOver(true);
    let topLeft=gameGrid[0][0],topMid=gameGrid[0][1],topRight=gameGrid[0][2];
    let midLeft=gameGrid[1][0],midMid=gameGrid[1][1],midRight=gameGrid[1][2];
    let botLeft=gameGrid[2][0],botMid=gameGrid[2][1],botRight=gameGrid[2][2];
    if(topLeft===topMid && topMid===topRight && topMid!==0) setGameOver(true);
    else if(midLeft===midMid && midMid===midRight && midMid!==0) setGameOver(true);
    else if(botLeft===botMid && botMid===botRight && botMid!==0) setGameOver(true);
    else if(topLeft===midLeft && midLeft===botLeft && midLeft!==0) setGameOver(true);
    else if(topMid===midMid && midMid===botMid && midMid!==0) setGameOver(true);
    else if(topRight===midRight && midRight===botRight && midRight!==0) setGameOver(true);
    else if(topLeft===midMid && midMid===botRight && midMid!==0) setGameOver(true);
    else if(topRight===midMid && midMid===botLeft && midMid!==0) setGameOver(true);
  }, [gameGrid, numTurns])

  return <>
    <div class="column" style={{
      backgroundColor: "rgb("+redVal+","+greVal+","+bluVal+")"}}>
      <Text txtColor={"rgb("+(255-redVal)+","+(255-greVal)+","+(255-bluVal)+")"}/>
      <Color colorName="Red" col={redVal} setCol={setRed}/>
      <Color colorName="Green" col={greVal} setCol={setGre}/>
      <Color colorName="Blue" col={bluVal} setCol={setBlu}/>
      <div style={{color:"rgb("+(255-redVal)+","+(255-greVal)+","+(255-bluVal)+")"}}>
        <code class="large">Background Hex: #{to2DigitHex(redVal)+to2DigitHex(greVal)+to2DigitHex(bluVal)}</code>
        <code class="large" style={{margin:0}}>
          Text Hex Value: #{to2DigitHex(255-redVal)+to2DigitHex(255-greVal)+to2DigitHex(255-bluVal)}</code>
      </div>
    </div>

    <div class="column" style={{backgroundColor:"lightblue"}}>
      <h1>Editable List of Things</h1>
      <button onClick={() => setList([...itemList, ""])} disabled={!listEditable} 
        style={{width:'100px', marginLeft:'8px'}}>Add Item</button>
      <form id="itemList" style={{margin:'8px'}}>
        {itemList.map((item, i) => <Input key={i} k={i} val={item} list={itemList} 
          changeList={setList} enabled={listEditable}/>)}
        <input type='button' value='Edit List' onClick={() => setEditable(true)} 
          disabled={listEditable} style={{margin:'8px 8px 0 0'}}/>
        <input type='submit' value='Submit Changes' onClick={() => setEditable(false)} disabled={!listEditable} />
      </form>
    </div>
    
    <div class="column" style={{backgroundColor:"lightgreen"}}>
      <h1>Play a Game of Tic-Tac-Toe!</h1>
      <div style={{width: '90%', margin: 'auto'}}>
        <p style={{fontSize:'28px', margin:'4px 0', textAlign:'center', fontFamily:'cursive'}}>
          <b>{gameOver ? "Game Over!" : (currTurn===1 ? "X's turn!" : "O's turn!")}</b></p>
        {gameGrid.map((arr, i) => arr.map((v, j) => 
          <GameSquare val={v} row={i} col={j} takeTurn={takeTurn} done={gameOver}/>))}
        <button style={{marginTop:'10px', fontSize:'24px'}} 
          onClick={() => {setTurn(1); setNumTurns(0); setGameOver(false);
          setGameGrid([[0,0,0],[0,0,0],[0,0,0]]);}}>Reset Game</button>
      </div>
    </div>
  </>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ToRender />);