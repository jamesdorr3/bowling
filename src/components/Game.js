import React from 'react'
import Player from './Player'
// import {URL} from '../constants'

var _ = require('lodash');

export default class Game extends React.Component{

  makeAllRolls = () => { // makes all possible throws,all are ''
    const rolls = []
    for(let i=0;i<(10*2)+1;i++){ rolls.push('') } // 10 frames of 2 throws/rolls max, plus 2 extra at the end
    return [...rolls]
  }

  newPlayer = (name = '') => ({name:name,rolls:this.makeAllRolls()})

  state = {
    players: [
      _.cloneDeep(this.newPlayer('Tejal')),
      _.cloneDeep(this.newPlayer('Nick'))
    ],
    autoAdvance: true,
    // leaderBoard: []
  }

  // componentDidMount = () => {
  //   fetch(`${URL}/bowling`)
  //   .then(r=>r.json())
  //   .then(r => {
  //     if(r.length > 0 && r[0].name){
  //       this.setState({leaderBoard: r})
  //     }
  //   })
  // }

  handleAddPlayer = () => {
    const playersCopy = [...this.state.players] // only shallow copy needed
    playersCopy.push(_.cloneDeep(this.newPlayer()))
    this.setState({players: playersCopy})
  }

  handleNameChange = (e) => {
    const index = parseInt(e.target.id.split('-')[1])
    const playersCopy = _.cloneDeep(this.state.players) // deep copy needed
    playersCopy[index].name = e.target.value
    this.setState({players: playersCopy})
  }

  handleDeletePlayer = (index) => {
    const playersCopy = [...this.state.players]
    playersCopy.splice(index, 1)
    this.setState({players: playersCopy})
  }

  // updates a throw by number to the number of pins knocked down, or x or /
  handleUpdateRoll = (e) => { // keyDown eventListeners don't work on Android
    const lastNumber = e.target.value[e.target.value.length -1] || '' // the '' is for delete button
    const id = e.target.id.split('-')
    const playerIndex = parseInt(id[1])
    const rollIndex = parseInt(id[2])
    const isAcceptableRollInput = this.isAcceptableRollInput(playerIndex, rollIndex, lastNumber)
    if(isAcceptableRollInput) {
      const playersCopy = _.cloneDeep(this.state.players)
      playersCopy[playerIndex].rolls[rollIndex] = lastNumber.toUpperCase()
      this.setState({players: playersCopy})
    }
    return(isAcceptableRollInput)
  }

  isAcceptableRollInput = (playerIndex, rollIndex, lastNumber) => { // considering putting each of these in their own functions, as well, for clarity
    const rolls = this.state.players[playerIndex].rolls

    // DELETE
    if(lastNumber===''){return true}

    // FIRST 9 FRAMES, FIRST THROW OF 10th FRAME
    if(rollIndex<19){
      if(rollIndex%2===1 && rolls[rollIndex-1]!=='X'){ // 2nd roll in frame, cannot exist if first roll is strike
        if(!!parseInt(lastNumber) || lastNumber==='0'){ // if lastNumber is a digit
          return ( (parseInt(lastNumber) + parseInt(rolls[rollIndex-1]) < 10) ) // two digits <= 9, otherwise it must be spare. Automatically rejects any digits after X because X + digit is NaN
        }else{ return lastNumber==='/' } // 2nd roll can only be a spare or a digit (above)
      }else if(rollIndex%2===0){ return lastNumber.match(/[0-9x]/i)} // first roll in frame

    // 10th FRAME, 2nd THROW
    }else if(rollIndex===19){
      if(rolls[18]==='X'){return lastNumber.match(/[0-9x]/i)} // if 10th frame 1st roll is strike, 2nd roll must be digit or strike
      else{ // if 10th frame 1st roll is NOT strike
        if(lastNumber==='/'){return true} // can be a spare
        else{ // is digit and not more than 9
          return lastNumber.match(/[0-9]/) && (parseInt(lastNumber) + parseInt(rolls[rollIndex-1]) < 10)
        }
      } 
    // 10th FRAME, 3rd THROW
    }else if(rollIndex===20){ // 10th frame, 3rd throw
      if(rolls[19]==='/'){ // if 10th frame, 2nd throw is a spare
        return lastNumber.match(/[0-9x]/i) // can only be a digit or strike
      }else if (rolls[18]==='X'){ // if 10th frame, 1st throw is a strike, you get a 3rd throw
        if(rolls[19]==='X'){ // if 10th frame, 2nd throw is a strike
          return lastNumber.match(/[0-9x]/i) // it can be a digit or a spare
        }else{ // 10th frame, 2nd throw is not a strike nor a spare (above)
          return (parseInt(lastNumber) + parseInt(rolls[rollIndex-1]) < 10)
        }
      }
    }

    // ALL ELSE
    return false
  }

  addPlayerButton = <button onClick={this.handleAddPlayer} className='addPlayerButton'>Add Player</button>

  toggleAutoAdvance = () => this.setState({autoAdvance: !this.state.autoAdvance})

  clearScore = (playerIndex) => {
    const playersCopy = _.cloneDeep(this.state.players)
    playersCopy[playerIndex].rolls = this.makeAllRolls()
    this.setState({players: playersCopy})
  }

  render(){
    return(
      <div className='game'>
        {this.addPlayerButton}
        <span className='autoAdvanceContainer' onClick={this.toggleAutoAdvance}>
          <p>Auto-Advance</p>
          <input type='checkbox' checked={this.state.autoAdvance} onChange={this.toggleAutoAdvance} />
          <span><span/></span>
        </span>
        {this.state.players.map((player, i)=>< Player playerName={player.name} rolls={player.rolls} key={i} id={i} 
          handleNameChange={this.handleNameChange} handleDeletePlayer={this.handleDeletePlayer}
          handleUpdateRoll={this.handleUpdateRoll} autoAdvance={this.state.autoAdvance}
          clearScore={this.clearScore}
          />)}
        {this.state.players.length > 3 ? this.addPlayerButton : null}
        {/* {this.state.leaderBoard[0] ? this.state.leaderBoard.map(game=>{
          return <p>{`${game.name} - ${game.total}`}</p>
        }) : null} */}
      </div>
    )
  }

}