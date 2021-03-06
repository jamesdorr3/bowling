import React from 'react'
// import {URL, HEADERS} from '../constants'

export default class Player extends React.Component{

  state = {
    className:'player off'
  }

  componentDidMount = () => { // takes user through all nameInputs and then to the game
    setTimeout(()=>this.setState({className: 'player'}), 1)
    this[`name-${this.props.id}`].addEventListener('keydown',e =>{
      if(e.key==="Tab" || e.key==="Enter"){
        e.preventDefault()
        const index = parseInt(this.props.id)
        const nextPlayer = document.querySelector(`#name-${index + 1}`)
        if(nextPlayer){nextPlayer.focus()}
        else{
          const firstRoll = document.querySelector("#roll-0-0")
          if(firstRoll){firstRoll.focus()}
        }
      }
    })
  }

  id = (index) => `${this.props.id}-${index}` // important for good .focus()

  createFrames = () => { // makes input (wrapped in span) for each throw/roll
    return this.props.rolls.map( (roll,i) =>{
      return <span className='roll' key={this.id(i)}>
        <input id={`roll-${this.id(i)}`} key={this.id(i)} name='roll' type='text' value={this.props.rolls[i]} 
        onChange={this.handleUpdateRoll} ref={input => this[`roll-${this.id(i)}`] = input} 
        // disabled={( (this.props.rolls[i-1]==='X' && i<19)) ? true : false} 
        // placeholder={this.id(i)}
        />
      </span>
    })
  }

  handleUpdateRoll = (e) => { // yesssss! Only changes focus if input is accepted && autoAdvance is on
    if(this.props.handleUpdateRoll(e) && this.props.autoAdvance){
      this.determineNextFocus(e, e.target.value.toUpperCase())
    }
  }

  sumFrames = (nonBonusFramesCount = 20, message = 'Start Game') => {
    const rollsAsStrings = [...this.props.rolls]
    const rollsAsNumbers = rollsAsStrings.map((roll,i)=>{
      if(roll.match(/[0-9]/)){return parseInt(roll)}
      else if(roll==='X'){return 10}
      else if(roll==='/'){return (10 - parseInt(rollsAsStrings[i-1]))}
      else{return null} // removes other characters
    })
    const rollsAsNumbersWithoutNulls = rollsAsNumbers.filter(filterOutNulls) // WithoutNulls versions allow easy traversal for spare and strike bonus points

    if(rollsAsNumbers.slice(0,nonBonusFramesCount).filter(filterOutNulls).length > 0){ 

      let extraPoints = 0 
      rollsAsStrings.slice(0,nonBonusFramesCount).filter(filterOutNulls).forEach((char,i) => {
        if(char==='X'){
          extraPoints += ((rollsAsNumbersWithoutNulls[i+1] || 0) + (rollsAsNumbersWithoutNulls[i+2] || 0)) // trailing 0s prevent NaN return for incomplete game
        }else if(char==='/'){
          extraPoints += (rollsAsNumbersWithoutNulls[i+1] || 0) // trailing 0s prevent NaN return for incomplete game
        }
      })

      const nonBonusRolls = rollsAsNumbers.slice(0,nonBonusFramesCount) // .splice(0,18) good for strike on 18, otherwise .splice(0,20)
      return nonBonusRolls.reduce((sum, current)=>sum+current) + extraPoints

    }else{return message}

    function filterOutNulls(char){
      return !!char || char===0
    }
  }

  sumAllFrames = (message = 'Start Game') => {
    const framesToCount = this.props.rolls[18]==='X' ? 19 : 20
    return this.sumFrames(framesToCount, message)
  }

  directFocusToChild = (e) => {
    let rolls = []
    e.target.querySelectorAll('.roll input').forEach(input=>rolls.push(input.value))
    if(rolls.length===21){
      rolls = rolls.map((roll,i)=>{
        if( ((i%2===0 || i===19) && roll.match(/[0-9x]/i) ) || // only the first throw/roll of each frame can have a strike X except the last frame
        ((i%2===1) && roll.match(/[0-9/]/)) // 2nd throws/rolls of each frames can have spares / but not strikes X
      ){return roll}
      else{return ''}
      })
      rolls = rolls.filter((roll, i) => roll || rolls[i+1])
      const lastNumber = rolls[rolls.length-1]
      let nextRollIndex;
      if(rolls.length >= 20){ nextRollIndex = 20 }
      else if(lastNumber && lastNumber.match(/X/i)){ nextRollIndex = rolls.length + 1 }
      else{ nextRollIndex = rolls.length}
      // // let nextRollIndex = (lastNumber && lastNumber.match(/X/i)) ? rolls.length + 1 : rolls.length
      // if(nextRollIndex>20){nextRollIndex=20}

      this[`roll-${this.props.id}-${nextRollIndex}`].focus()
    }
  }

  determineNextFocus = (e, lastNumber) => {
    if(!lastNumber.match(/[0-9x/]/i)){return}
    const ids = e.target.id.split('-')
    const rollIndex = parseInt(ids[2])
    const playerIndex = parseInt(ids[1])
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
    const ids = e.target.id.split('-')
    const rollIndex = parseInt(ids[2])
    const playerIndex = parseInt(ids[1])

    if( rollIndex === 18 || (rollIndex===19 && (lastNumber.match(/\//) || this.props.rolls[18].match(/X/i)))){
      this[`roll-${playerIndex}-${rollIndex + 1}`].focus()
    }else{
      const nextPlayer = document.querySelector(`#player-${playerIndex + 1}`)
      if(nextPlayer){nextPlayer.click()}
      else(document.querySelector("#player-0")).click()   
    }
  }

  // isGameFinished = () => {
  //   const rolls = this.props.rolls
  //   return (
  //     rolls[20] || (rolls[19] && rolls[19]!=='/' &&
  //     rolls[18] && rolls[18]!=='X')
  //   )
  // }

  // saveGame = () => {
  //   fetch(`${URL}/bowling`,{
  //     method: 'POST',
  //     headers: HEADERS,
  //     body: JSON.stringify({
  //       name: 'James',
  //       total: '100'
  //     })
  //   })
  //   .then(r => r.json())
  //   .then(r => console.log(r))
  // }

  handleDeletePlayer = () => {
    this.setState({className:'player off'})
    setTimeout(()=>this.props.handleDeletePlayer(this.props.id), 1000)
  }

  render(){
    return(
      <div className={this.state.className} onClick={this.directFocusToChild} id={`player-${this.props.id}`}>
        <input value={this.props.playerName} name='nameInput' id={`name-${this.props.id}`} className='nameInput'
        onChange={this.props.handleNameChange} placeholder={`Player ${this.props.id+1}`} ref={input => this[`name-${this.props.id}`] = input} 
        autoFocus
        />
        <button onClick={this.handleDeletePlayer}>Delete {this.props.playerName}</button>
        <button className='clearScoreButton' onClick={() => this.props.clearScore(this.props.id)}>Clear Score</button>
        <div className='playerGame'>
          {this.createFrames()}
          <span className='sum'>
            <p>{this.sumAllFrames()}</p>
            {/* {this.isGameFinished() ? <button onClick={this.saveGame}>Save Game</button> : null } */}
          </span>
          {this.props.rolls.slice((this.props.rolls.length + 1) / 2).map((unused, i)=>{
            const sumFramesFunction = (i === 9) ? this.sumAllFrames('-') : this.sumFrames(i*2+2, '-')
            return <div key={i} id={i}>{!!this.props.rolls[i*2] ? sumFramesFunction : '-'}</div>
          })}
        </div>
      </div>
    )
  }
}