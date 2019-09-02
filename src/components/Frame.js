import React from 'react'

export default class Frame extends React.Component{

  state = {
    throw1:null,
    throw2:null
  }

  handleChange = (e) => {
    const lastNumber = e.target.value[e.target.value.length -1] || ''
    if(lastNumber.match(/[0-9x/]/i)){
      this.setState({[e.target.name]: lastNumber})
    }else if(lastNumber===''){
      this.setState({[e.target.name]: ''})
    }
  }

  render(){
    return(
      <form className='frame'>
        <input onChange={this.handleChange} type='text' name='throw1' value={this.state.throw1} maxLength='1' />
        <input onChange={this.handleChange} type='text' name='throw2' value={this.state.throw2} maxLength='1' />
        <p>{(parseInt(this.state.throw1) + parseInt(this.state.throw2))}</p>
      </form>
    )
  }
}