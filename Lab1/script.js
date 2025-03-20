async function fetchCSV() {
  const response = await fetch("HouseSalesSeattle.csv"); // Ladda CSV-filen
  const data = await response.text(); // Läs in som text
  const rows = data
    .split("\n")
    .filter((row) => row.trim() !== "")
    .map((row) => row.split(",")); // Dela upp i rader och kolumner, ta bort tomma rader

  // Ta bort BOM om den finns och hämta rubrikraden
  const headers = rows
    .shift()
    .map((header) => header.replace(/\ufeff/g, "").trim()); // Använd trim för att ta bort extra tecken

  console.log(headers); // Visa rubrikraden i konsolen för felsökning

  // Index för relevanta kolumner
  const priceIndex = headers.indexOf("SalePrice");
  const imageIndex = headers.indexOf("Image");
  const dateIndex = headers.indexOf("DocumentDate");

  if (priceIndex === -1 || imageIndex === -1) {
    console.error("Nödvändiga kolumner saknas i CSV-filen.");
    return;
  }

  // Skapa JSON-objekt från CSV-data
  const houses = rows.map((row) => {
    const price = row[priceIndex]
      ? parseInt(row[priceIndex]).toLocaleString()
      : "N/A"; // Formatera priset
    const image = row[imageIndex] || "defaultImage.jpg"; // Standardbild om ingen bild finns
    const date = row[dateIndex] || "No date found"; // Standardbild om ingen bild finns
    return { price, image, date };
  });

  renderHouses(houses);
}
function renderHouses(houses) {
  const container = document.querySelector(".houseContainer"); // Använd befintlig container
  houses.forEach((house) => {
    const houseDiv = document.createElement("div");
    houseDiv.classList.add("house");

    const img = document.createElement("img");
    img.src = `houseImages/256x256/${house.image}.jpg`;
    img.alt = "Husbild";

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("houseInfo");

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("housePrice");
    priceDiv.textContent = `$${house.price}`;

    const date = document.createElement("div");
    date.classList.add("houseDate");
    date.textContent = `${house.date}`;

    infoDiv.appendChild(priceDiv);
    infoDiv.appendChild(date);
    houseDiv.appendChild(img);
    houseDiv.appendChild(infoDiv);
    container.appendChild(houseDiv);
  });
}

filterSelection("all");
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// Kör funktionen när sidan laddas
fetchCSV();
