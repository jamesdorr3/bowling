import React from 'react'
import Player from './Player'

export default class Game extends React.Component{

  state = {
    playerNames: ['']
  }

  handleClick = () => {
    const playerNamesCopy = [...this.state.playerNames]
    playerNamesCopy.push('')
    this.setState({playerNames: playerNamesCopy})
  }

  handleNameChange = (e) => {
    const playerNamesCopy = [...this.state.playerNames]
    const index = parseInt(e.target.id)
    playerNamesCopy[index] = e.target.value.toUpperCase()
    this.setState({playerNames: playerNamesCopy})
    // document.querySelector(`#player-${index+1}`).click() // I didn't want to use it here, just wanted to test if it works
  }

  handleDeletePlayer = (index) => {
    const playerNamesCopy = [...this.state.playerNames]
    playerNamesCopy.splice(index, 1)
    this.setState({playerNames: playerNamesCopy})
  }

  render(){
    return(
      <div className='game'>
        <button onClick={this.handleClick}>Add Player</button>
        {/* <div></div> */}
        {/* <input name='name' placeholder='Player Name' type='text' /> */}
        {this.state.playerNames.map((name, i)=>< Player playerName={name} key={i} id={i} handleNameChange={this.handleNameChange} 
          handleDeletePlayer={this.handleDeletePlayer}
          />)}
      </div>
    )
  }

}