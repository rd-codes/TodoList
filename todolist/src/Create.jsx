import React from 'react'
import axios from 'axios'

function Create() {
  const [task,setTask] = useState()
  const handleAdd = () => {
    axios.post('http://lovslhody:5173/add', {task: task})
    .then(result => console.log(result))
    .catch(err => console.log(err))

  }
  return (
    <div className='create_form'>
        <input type="text" placeholder='Enter task' onChange={() => setTask(e.target.value)}/>
        <button type="button"> onClick={handleAdd} Add</button>
    </div>
  )
}

export default Create
