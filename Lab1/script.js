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
    return []; // Return an empty array if required columns are missing
  }

  // Skapa JSON-objekt från CSV-data
  const houses = rows.map((row) => {
    const price = row[priceIndex]
      ? parseInt(row[priceIndex]).toLocaleString()
      : "N/A"; // Formatera priset
    const image = row[imageIndex] || "defaultImage.jpg"; // Standardbild om ingen bild finns
    const date = row[dateIndex] || "No date found"; // Standarddatum om inget datum finns
    return { price, image, date };
  });

  return houses; // Return the houses array
}

function renderHouses(houses) {
  const container = document.querySelector(".houseContainer"); // Använd befintlig container
  container.innerHTML = ""; // Clear the container before rendering
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

function sortHouses() {
  const button = document.getElementById("High");
  const button3 = document.getElementById("Recent");
  const button2 = document.getElementById("Low");

  button.addEventListener("click", async function () {
    button.className = "btn active";
    button2.className = "btn";
    button3.className = "btn";
    const houses = await fetchCSV(); // Fetch the houses array
    houses.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/,/g, "")) || 0;
      const priceB = parseInt(b.price.replace(/,/g, "")) || 0;
      return priceB - priceA; // Sortera i fallande ordning
    });
    renderHouses(houses); // Render the sorted houses
  });

  button2.addEventListener("click", async function () {
    button2.className = "btn active";
    button.className = "btn";
    button3.className = "btn";
    const houses = await fetchCSV(); // Fetch the houses array
    houses.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/,/g, "")) || 0;
      const priceB = parseInt(b.price.replace(/,/g, "")) || 0;
      return priceA - priceB; // Sortera i stigande ordning
    });
    renderHouses(houses); // Render the sorted houses
  });

  button3.addEventListener("click", async function () {
    button3.className = "btn active";
    button.className = "btn";
    button2.className = "btn";
    const houses = await fetchCSV(); // Fetch the houses array
    houses.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sortera efter datum
    renderHouses(houses); // Render the sorted houses
  });

}

// Kör funktionerna när sidan laddas
fetchCSV().then(renderHouses); // Fetch and render houses on page load
sortHouses(); // Attach sorting functionality to buttons