import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Message } from './Message'
import config from './config.json'

function App() {
  let CDN_URL = config.LOCAL_URI
  if (config.PRODUCTION) {
    CDN_URL = config.PRODUCTION_URI
  }
  console.log("💨")

  const i18n = {
    'PL': {
      'your-name': 'Jak masz na imię?',
      'name-too-short': 'Imię jest zbyt krótkie',
      'login': 'Logowanie',
      'text': 'Wiadomość...',
      'send': 'Wyślij'
    }
  }
    const lang = i18n['PL']

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  
  
  function setNewName() {
    askForName()
  }
  
  const askForName = useCallback(function() {
    let sign = window.prompt(lang['your-name'])
    if (!sign) {
      return
    }
    if (sign?.length > 4) {
      localStorage.name = sign
      setName(sign)
    }
    else {
      alert(lang['name-too-short'])
    }
  }, [lang])
  
  const getName = useCallback(function() {
    if (!localStorage.name) {
      askForName()
    }
    else {
      setName(localStorage.name)
    }
  }, [askForName])
  
  function handleMessageChange(e) {
    setMessage(e.target.value)
  }
  
  const getMessages = useCallback(async function() {
    const response = await fetch(`${CDN_URL}/messages`)
    
    if (!response.ok) {
      const message = `An error occurred ${response.statusText}`
      window.alert(message)
      return
    }
    
    const messages = await response.json()
    setMessages(messages)
  }, [CDN_URL])
  
  useEffect(() => {
    getName()
    getMessages()
    messagesEndRef.current.scrollIntoView()
  }, [messages.length])
  
  
  async function sendMessage(event) {
    event.preventDefault()
    event.target.checkValidity()
    const newMessage = {name, message, date: new Date().toJSON()}
    
    await fetch(`${CDN_URL}/action/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
    .catch(error => {
      return window.alert(error)
    })
    
    setMessage("")
    getMessages()
  }

  return (
    <div className="App">
      <nav>
        <ul className="Menu">
          <li className="item button"><button onClick={setNewName}>{lang['login']}</button></li>
        </ul>
      </nav>
      <div className="MessageBox">
        {messages.map(({_id, name, message, date}) => (
         <Message key={_id} name={name} message={message} date={date}/>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={sendMessage} className="form" method="post">
        <input onChange={handleMessageChange} placeholder={lang['text']} type="text" value={message} name="message" required/>
        <button>{lang['send']}</button>
      </form>
    </div>
  )
}

export default App