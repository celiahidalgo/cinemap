function queryData(e) {
    e.preventDefault();
  
    const searchTerm = document.querySelector("#search").value;
    fetch(
      `http://localhost:3000/main?search=${searchTerm}&isajax=true`
    )
    
      .then(resp => resp.json())
      .then(data => switchDataOnScreen(data))
      .catch(err => console.log(err));
  }

  function switchDataOnScreen(data) {
    console.log(data);
  
    document.querySelector("main .columns").innerHTML =
      "Ahora deberías pintar los datos que recibes en el JSON. (Mira la consola JS y su log)";
  }