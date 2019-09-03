import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {

  return (
    <div className="App">
      <h1>Bowling Score</h1>
      <div className='instructions'>
        <h2>Scoring Rules</h2>
        <p>Each "frame" is two attempts ("throws") to knock down the 10 pins. A game has 10 frames.</p>
        <table>
          <tr>
            <th>Name</th><th>Symbol</th><th>Meaning</th><th>Scoring</th>
          </tr>
          <tr>
            <td>Strike</td><td>X</td><td>You knocked down all 10 pins on the first throw of a frame.</td><td>10 + the number of pins knocked down on your next 2 throws</td>
          </tr>
          <tr>
            <td>Spare</td><td>/</td><td>You knocked down all 10 pins on the second throw.</td><td>10 for the frame + the number of pins knocked down on your next throw</td>
          </tr>
          <tr>
            <td></td><td>0-9</td><td>You knocked down this many pins, <b>not</b> all the pins</td><td>The number of pins you knocked down</td>
          </tr>
        </table>
      </div>
      <Game />
    </div>
  );
}

export default App;
