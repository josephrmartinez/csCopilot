import { useState, useEffect } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)



function App() {
  const [userInput, setUserInput] = useState("")
  const [conversationArr, setConversationArr] = useState([{
        role: 'system',
        content: 'You are a highly knowledgeable assistant that is always happy to help.'
    }])


  

  
  function handleSubmit() {
    setConversationArr(prevConversationArr => [
      ...prevConversationArr, 
      {
        role: 'user',
        content: userInput
      }
    ])
    setUserInput("")
  }

  useEffect(() => {
  console.log(conversationArr);
}, [conversationArr]);



  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-red-800'>chatbot</h1>
      <div className='w-96 h-96 border rounded-md'>


        
      </div>
      <div className='w-96 h-20 border rounded-md flex flex-col justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <textarea style={{
            resize: 'none', height: '78px', paddingLeft: '6px'
          }}
            className='w-72'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}>
            
          </textarea>
          <button
            className='w-12 h-12 ml-4 rounded-full active:bg-blue-300 flex flex-col items-center justify-center'
            onClick={handleSubmit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M223.87,114l-168-95.89A16,16,0,0,0,32.93,37.32l31,90.47a.42.42,0,0,0,0,.1.3.3,0,0,0,0,.1l-31,90.67A16,16,0,0,0,48,240a16.14,16.14,0,0,0,7.92-2.1l167.91-96.05a16,16,0,0,0,.05-27.89ZM48,224l0-.09L78.14,136H136a8,8,0,0,0,0-16H78.22L48.06,32.12,48,32l168,95.83Z"></path></svg>   </button> </div>
        </div>
      
    </div>
      
      
  )
}

export default App
