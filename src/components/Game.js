import React from 'react'
import Player from './Player'

var _ = require('lodash');

export default class Game extends React.Component{

  makeAllRolls = () => {
    const rolls = []
    for(let i=0;i<(10*2)+1;i++){ rolls.push('') } // 10 frames of 2 throws/rolls max, plus 2 extra at the end
    return [...rolls]
  }

  newPlayer = {name:'',rolls:this.makeAllRolls()}

  state = {
    players: [
      _.cloneDeep(this.newPlayer)
    ],
    autoAdvance: true
  }

  handleAddPlayer = () => {
    const playersCopy = [...this.state.players] // only shallow copy needed
    playersCopy.push(_.cloneDeep(this.newPlayer))
    this.setState({players: playersCopy})
  }

  handleNameChange = (e) => {
    const index = parseInt(e.target.id.split('-')[1])
    const playersCopy = _.cloneDeep(this.state.players) // deep copy needed
    playersCopy[index].name = e.target.value.toUpperCase()
    this.setState({players: playersCopy})
  }

  handleDeletePlayer = (index) => {
    const playersCopy = [...this.state.players]
    playersCopy.splice(index, 1)
    this.setState({players: playersCopy})
  }

  handleUpdateRoll = (e) => { // keyDown eventListeners don't work on Android
    const lastNumber = e.target.value[e.target.value.length -1] || '' // the '' is for delete button
    const id = e.target.id.split('-')
    const playerIndex = parseInt(id[1])
    const rollIndex = parseInt(id[2])
    if( ((rollIndex%2===0 || rollIndex===19) && lastNumber.match(/[0-9x]/i) ) || // only the first throw/roll of each frame can have a strike X except the last frame
      ( (rollIndex%2===1) && lastNumber.match(/[0-9/]/) ) || // 2nd throws/rolls of each frames can have spares / but not strikes X
      lastNumber === ''
    ) {
      const playersCopy = _.cloneDeep(this.state.players)
      playersCopy[playerIndex].rolls[rollIndex] = lastNumber.toUpperCase()
      this.setState({players: playersCopy})
    }
  }

  addPlayerButton = <button onClick={this.handleAddPlayer} className='addPlayerButton'>Add Player</button>

  toggleAutoAdvance = () => this.setState({autoAdvance: !this.state.autoAdvance})

  render(){
    return(
      <div className='game'>
        {this.addPlayerButton}
        <span className='autoAdvanceContainer'>
          <p>Auto-Advance</p>
          <input type='checkbox' checked={this.state.autoAdvance} onClick={this.toggleAutoAdvance} />
          <span/><span/>
        </span>
        {this.state.players.map((player, i)=>< Player playerName={player.name} rolls={player.rolls} key={i} id={i} 
          handleNameChange={this.handleNameChange} handleDeletePlayer={this.handleDeletePlayer}
          handleUpdateRoll={this.handleUpdateRoll} autoAdvance={this.state.autoAdvance}
          />)}
        {this.state.players.length > 3 ? this.addPlayerButton : null}
      </div>
    )
  }

}