import './App.css';

function App() {
  return (
    <div className="App">
    <nav>
      <ul menu className="Menu">
        <li className="item button"><a href="Logowanie">Logowanie</a></li>
        <li className="item button secondary"><a href="Zarejestruj Się">Zarejestruj Się</a></li>
      </ul>
    </nav>
      <form className="form" method="post" action="http://localhost:5000/action/add">
        <input type="text" value={"Jakub"} name="name"/>
        <input type="text" value={"Hello"} name="message"/>
        <button>Wyślij</button>
      </form>
    </div>
  );
}

export default App;
