import React from 'react'
// import Frame from './Frame';

export default class Player extends React.Component{

  state = {
    rolls: [''] // keep '' to not throw error
  }

  componentDidMount = () => { // adds all possible throws/rolls to the player's state
    const rolls = []
    for(let i=0;i<(10*2)+1;i++){ // 10 frames of 2 throws/rolls max, plus 2 extra at the end
      rolls.push('')
    }
    this.setState({rolls: rolls})
  }

  createFrames = () => {
    return this.state.rolls.map( (roll,i) =>{
      return <input id={i} key={i} name='roll' type='text' value={this.state.rolls[i]} onChange={this.handleChange} />
    })
  }

  handleChange = (e) => { // did this instead of keydown eventListener so it will work on android, too
    const lastNumber = e.target.value[e.target.value.length -1] || '' // the '' is for delete button
    const id = parseInt(e.target.id)
    if( ((id%2===0 || id===19) && lastNumber.match(/[0-9x]/i) ) || // only the first throw/roll of each frame can have a strike X except the last frame
      ( id%2===1 && lastNumber.match(/[0-9/]/) ) || // 2nd throws/rolls of each frames can have spares / but not strikes X
      lastNumber === ''
    ) {
        const rollsCopy = [...this.state.rolls]
        rollsCopy[e.target.id] = lastNumber.toUpperCase()
        this.setState({rolls: rollsCopy})
    }
  }

  sumAllFrames = () => {
    const rollsAsStrings = [...this.state.rolls]
    const rollsAsStringsWithoutNulls = rollsAsStrings.filter(x=>!!x) // WithoutNulls versions allow easy traversal for spare and strike bonus points
    const rollsAsNumbers = rollsAsStrings.map((roll,i)=>{
      if(roll.match(/[0-9]/)){return parseInt(roll)}
      else if(roll==='X'){return 10}
      else if(roll==='/'){return (10 - parseInt(rollsAsStrings[i-1]))}
      else{return null}
    })
    const rollsAsNumbersWithoutNulls = rollsAsNumbers.filter(x=>!!x) // WithoutNulls versions allow easy traversal for spare and strike bonus points

    if(rollsAsNumbersWithoutNulls.length > 0){ // otherwise this block throws an error

      let extraPoints = 0
      rollsAsStringsWithoutNulls.forEach((char,i) => {
        if(char==='X'){
          extraPoints += ((rollsAsNumbersWithoutNulls[i+1] || 0) + (rollsAsNumbersWithoutNulls[i+2] || 0)) // trailing 0s prevent NaN return for incomplete game
        }else if(char==='/'){
          extraPoints += (rollsAsNumbersWithoutNulls[i+1] || 0) // trailing 0s prevent NaN return for incomplete game
        }
      })

      let nonBonusRolls = rollsAsNumbers.slice(0,20)
      if(rollsAsStrings[18]==='X'){nonBonusRolls = rollsAsNumbers.slice(0,18)}

      return nonBonusRolls.reduce((sum, current)=>sum+current) + extraPoints // .splice(0,18) good for strike on 18, otherwise .splice(0,19) ?

    }else{return 'Start bowling!'}
  }

  render(){
    return(
      <div className='player'>
        {/* <Frame /> */}
        {this.createFrames()}
        <div className='sum'>
          {this.sumAllFrames()}
        </div>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
        <p>20</p>
      </div>
    )
  }
}