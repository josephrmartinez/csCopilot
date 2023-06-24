import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'

// OpenAI config
const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)


function FineTunedModel() {
  const [userInput, setUserInput] = useState("")
  const [conversationArr, setConversationArr] = useState([])
  const [conversationStr, setConversationStr] = useState("")
  const [shouldFetchReply, setShouldFetchReply] = useState(false);
    const chatContainerRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false)


  function handleSubmit() {
    setConversationArr(prevConversationArr => [
      ...prevConversationArr, 
      {
        role: 'user',
        content: userInput
      }
    ])
    setConversationStr(prevConversationStr => prevConversationStr + `${userInput} \n\n###\n\n`)
    
    setShouldFetchReply(true)
  }

useEffect(() => {
    console.log(conversationArr);
    console.log(conversationStr);
  }, [conversationArr, conversationStr]);


async function fetchReply() {
      setUserInput("");
    const response = await openai.createCompletion({
        // model: "davinci:ft-personal-2023-06-23-21-59-41",
        model: "davinci:ft-personal-2023-06-23-22-53-14",
    prompt: conversationStr,
    presence_penalty: 0,
    frequency_penalty: 0.3,
    max_tokens: 100,
    temperature: 0.2,
    stop: ['\n\n###\n\n', '\n\n', '###']
    });
    console.log(response)
      setConversationArr(prevConversationArr => [
          ...prevConversationArr,
          {
              role: 'system',
              content: response.data.choices[0].text
          }
      ]);
      setConversationStr(prevConversationStr => prevConversationStr + ` ${response.data.choices[0].text} \n`)

    ;
  }
  
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

  const chat = conversationArr.map((each, index) => (
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
  
  
    function startOver() {
        setIsAnimating(true);
        setTimeout(() => {
        setIsAnimating(false);
        setConversationArr([])
        }, 500);

  }

    
    function handleRedoIconClick() {
        console.log("yow!")
    }
    
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-row items-center w-96 justify-between'>
        <h1 className='text-gray-800 font-bold my-4'>Arizona Microgreens GPT</h1>
              <div onClick={startOver} className={`mr-2 cursor-pointer  ${isAnimating && 'animate-spin'}`} style={{ animationDuration: '500ms' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"></path></svg>

        </div>
      </div>
      
          
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

export default FineTunedModel
