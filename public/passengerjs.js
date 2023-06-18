function makeCards() {
  var x = document.getElementById("nooftick").value;
  var y = document.getElementById("passengerdiv");
  console.log("hlo" + x);
  y.innerHTML = "";
  for (let i = 0; i < x; i++) {
    var div = document.createElement("div");
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");
    div.className = "cardpass";
    div1.className = "div1pass";
    div2.className = "div2pass";
    var lab1 = document.createElement("label");
    var lab2 = document.createElement("label");
    lab1.innerHTML = "Passenger Name:";
    lab2.innerHTML = "Passenger Age:";
    var inp1 = document.createElement("input");
    inp1.name = "inp1" + i;
    inp1.required = true;
    var inp2 = document.createElement("input");
    inp2.name = "inp2" + i;
    inp2.required = true;
    div1.appendChild(lab1);
    div1.appendChild(inp1);
    div2.appendChild(lab2);
    div2.appendChild(inp2);
    div.appendChild(div1);
    div.appendChild(div2);
    y.appendChild(div);
  }
}

var otherButton = document.getElementById("otherButton");
var submitButton = document.getElementById("submitButton");

otherButton.addEventListener("click", function () {
  submitButton.removeAttribute("disabled");
});
