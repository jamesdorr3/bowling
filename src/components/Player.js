import React from 'react'

export default class Player extends React.Component{

  // state = {
  //   rolls: [''] // keep '' to not throw error
  // }

  // componentDidMount = () => { // adds all possible throws/rolls to the player's state
  //   const rolls = []
  //   for(let i=0;i<(10*2)+1;i++){ // 10 frames of 2 throws/rolls max, plus 2 extra at the end
  //     rolls.push('')
  //   }
  //   this.setState({rolls: rolls})
  // }

  id = (index) => `${this.props.id}-${index}`

  createFrames = () => {
    return this.props.rolls.map( (roll,i) =>{
      return <span className='roll' key={this.id(i)}>
        <input id={this.id(i)} key={this.id(i)} name='roll' type='text' value={this.props.rolls[i]} 
        onChange={this.handleUpdateRoll} onFocus={this.handleFocus} ref={input => this[`roll-${this.props.id}-${i}`] = input} 
        disabled={(this.props.rolls[i-1]==='X' && i<19) ? true : false} placeholder={this.id(i)}
        />
      </span>
    })
  }

  handleUpdateRoll = (e) => { // did this instead of keydown eventListener so it will work on android, too
    this.props.handleUpdateRoll(e)
    // this.determineNextFocus(e, e.target.value.toUpperCase())
  }

  sumFrames = (nonBonusFramesCount = 20, defaultMessage = 'Start Game') => {
    const rollsAsStrings = [...this.props.rolls]
    const rollsAsNumbers = rollsAsStrings.map((roll,i)=>{
      if(roll.match(/[0-9]/)){return parseInt(roll)}
      else if(roll==='X'){return 10}
      else if(roll==='/'){return (10 - parseInt(rollsAsStrings[i-1]))}
      else{return null}
    })
    const rollsAsNumbersWithoutNulls = rollsAsNumbers.filter(x=>!!x) // WithoutNulls versions allow easy traversal for spare and strike bonus points

    if(rollsAsNumbers.slice(0,nonBonusFramesCount).filter(x=>!!x).length > 0){ // otherwise this block throws an error

      let extraPoints = 0
      rollsAsStrings.slice(0,nonBonusFramesCount).filter(x=>!!x).forEach((char,i) => {
        if(char==='X'){
          extraPoints += ((rollsAsNumbersWithoutNulls[i+1] || 0) + (rollsAsNumbersWithoutNulls[i+2] || 0)) // trailing 0s prevent NaN return for incomplete game
        }else if(char==='/'){
          extraPoints += (rollsAsNumbersWithoutNulls[i+1] || 0) // trailing 0s prevent NaN return for incomplete game
        }
      })

      const nonBonusRolls = rollsAsNumbers.slice(0,nonBonusFramesCount) // .splice(0,18) good for strike on 18, otherwise .splice(0,20)

      return nonBonusRolls.reduce((sum, current)=>sum+current) + extraPoints

    }else{return defaultMessage}
  }

  sumAllFrames = (message = 'Start Game') => {
    const framesToCount = this.props.rolls[18]==='X' ? 19 : 20
    return this.sumFrames(framesToCount, message)
  }

  handleFocus = (e) => {
    const index = parseInt(e.target.id)
    if(index>0 && ( (this.props.rolls[index-2]!=='X' || index===20) && !this.props.rolls[index-1])){
      this[`roll-${this.props.id}-${index - 1}`].focus()
    }
  }

  directFocusToChild = (e) => {
    if(!e.target.name){
      this[`roll-${this.props.id}-20`].focus()
    }
  }

  determineNextFocus = (e, lastNumber) => {
    const rollIndex = parseInt(e.target.id)
    const playerIndex = parseInt(this.props.id)
    if(rollIndex>=18){this.determineNextFocusLastFrame(e, lastNumber)}
    else if(rollIndex%2===1 || lastNumber.toUpperCase()==='X'){
      const nextPlayer = document.querySelector(`#player-${playerIndex + 1}`)
      if(nextPlayer){nextPlayer.click()}
      else(document.querySelector("#player-0").click())
    }else{
      this[`roll-${playerIndex}-${rollIndex+1}`].focus()
    }
  }
  
  determineNextFocusLastFrame = (e, lastNumber) => {
    const rollIndex = parseInt(e.target.id)
    const playerIndex = parseInt(this.props.id)
    if( rollIndex===20 || (rollIndex===19 && lastNumber.match(/[0-9]/))){
      const nextPlayer = document.querySelector(`#player-${playerIndex + 1}`)
      if(nextPlayer){nextPlayer.click()}
      else(document.querySelector("#player-0")).click()
    }else{
      this[`roll-${playerIndex}-${rollIndex+1}`].focus()
    }
  }

  render(){
    return(
      <div className="player" onClick={this.directFocusToChild} id={`player-${this.props.id}`}>
        <input value={this.props.playerName} name='nameInput' id={this.props.id} onChange={this.props.handleNameChange} placeholder='Player Name' />
        <button onClick={() => this.props.handleDeletePlayer(this.props.id)}>Delete {this.props.playerName}</button>
        <div className='playerGame'>
          {this.createFrames()}
          <p className='sum'>
            {this.sumAllFrames()}
          </p>
          {this.props.rolls.slice((this.props.rolls.length + 1) / 2).map((unused, i)=>{
            const sumFramesFunction = (i === 9) ? this.sumAllFrames('_') : this.sumFrames(i*2+2, '_')
            return <div key={i} id={i}>{!!this.props.rolls[i*2] ? sumFramesFunction : '_'}</div>
          })}
        </div>
      </div>
    )
  }
}