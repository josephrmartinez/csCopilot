import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import { initializeApp } from "firebase/app";
import {getDatabase, ref, push, get, set } from 'firebase/database'

// OpenAI config
const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIflx1MdGmOKfHia4AXZ_5d2csD_qrswU",
  authDomain: "chatapp-84249.firebaseapp.com",
  databaseURL: "https://chatapp-84249-default-rtdb.firebaseio.com",
  projectId: "chatapp-84249",
  storageBucket: "chatapp-84249.appspot.com",
  messagingSenderId: "53562700844",
  appId: "1:53562700844:web:d751144b99ed9f8d0ccd89"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const conversationInDb = ref(database)

// https://chatapp-84249-default-rtdb.firebaseio.com/

function App() {
  const [userInput, setUserInput] = useState("")
  const [conversationArr, setConversationArr] = useState([])
  const [shouldFetchReply, setShouldFetchReply] = useState(false);
  const chatContainerRef = useRef(null);


  useEffect(() => {
    fetchConversation()
  }, []);

  function fetchConversation() {
    console.log('fetching')
    get(conversationInDb).then(async (snapshot) => {
      if (snapshot.exists()) {
        console.log('exists')
        setConversationArr(Object.values(snapshot.val()))
      } else {
        console.log('empty')
        setConversationArr([{
          role: 'system',
          content: 'You are a highly knowledgeable assistant that communicates in the style of Charles Bukowski. Provide short responses of no more than three sentences to any question I ask.'
        }])

      }
    })
  }

  useEffect(() => {
  if (conversationArr.length > 0) {
    set(conversationInDb, conversationArr)
      .then(() => {
        console.log('Object updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating object:', error);
      });
  }
}, [conversationArr]);
  

  
  function handleSubmit() {
    setConversationArr(prevConversationArr => [
      ...prevConversationArr, 
      {
        role: 'user',
        content: userInput
      }
    ])
    setUserInput("");
    setShouldFetchReply(true)
  }

  async function fetchReply() {
    setUserInput("")
    const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
      messages: conversationArr,
    temperature: 1
    });
    console.log(response)
    setConversationArr(prevConversationArr => [
      ...prevConversationArr,
      {
        role: 'system',
        content: response.data.choices[0].message.content
      }
    ])
    ;
  }
  

//   function fetchReply() {
//     get(conversationInDb).then(async (snapshot) => {
//         if (snapshot.exists()) {
//             const conversationArr = Object.values(snapshot.val())
//             conversationArr.unshift(instructionObj)
//             const response = await openai.createChatCompletion({
//                 model: 'gpt-4',
//                 messages: conversationArr,
//                 presence_penalty: 0,
//                 frequency_penalty: 0.3
//             })
// /*
// Challenge:
//     1. Add the completion to the database.
//     2. Ask the chatbot something to check it's working.
// */
//           push(conversationInDb, response.data.choices[0].message)
//             renderTypewriterText(response.data.choices[0].message.content)
//         }
//         else {
//             console.log('No data available')
//         }

//     })
// }

  

  
  
  useEffect(() => {
  if (shouldFetchReply) {
    fetchReply()
      .then(() => {
        // Code to be executed after fetchReply is complete
      })
      .catch(error => {
        // Handle any errors that occurred during fetchReply
        console.error('Error fetching reply:', error);
      });

    setShouldFetchReply(false); // Reset the flag after fetchReply is called
  }
}, [shouldFetchReply]);

  const chat = conversationArr.slice(1).map((each, index) => (
  <div
    key={index}
      className={`font-semibold text-gray-600 my-2 p-2 border rounded-b-2xl w-11/12 
     ${each.role === 'system' ? 'text-left rounded-tr-2xl border-green-800' : 'self-end text-right rounded-tl-2xl border-blue-800'
    }`}
  >
    {each.content}
  </div>
));
  
  
  useEffect(() => {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [chat]);
  
  
  

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-gray-800 font-bold my-4'>BukowskiGPT</h1>
      <div className='w-96 h-96 overflow-y-scroll scroll-smooth   border rounded-md px-1 flex flex-col' ref={chatContainerRef}>
        
        {chat}
        
      </div>
      <div className='w-96 h-20 border rounded-md flex flex-col justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <textarea style={{
            resize: 'none', height: '78px', paddingLeft: '6px'}}
            className='w-72'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                handleSubmit();
              }
            }}>
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
