console.log("JS working");

const searchDropdown = document.getElementById("search");
const catSearchDiv = document.getElementById("categorySearch");
const productsTbl = document.getElementById("products");
const catDropdown = document.getElementById("categories");
catSearchDiv.style.display = "none";

// code from https://miikavonbell.com/posts/catch-link-clicks-with-javascript/
productsTbl.addEventListener(`click`, (e) => {
  const origin = e.target.closest(`a`);

  if (origin) {
    searchDropdown.selectedIndex = 0;
    catDropdown.selectedIndex = 0;
  }
});
const headers = {
  productId: "Product ID",
  productName: "Product Name",
  unitPrice: "Unit Price",
  details: `See Details`,
};
generateCategory(
  "http://localhost:8081/api/categories",
  catDropdown,
  catSearchDiv
);

searchDropdown.addEventListener("change", detResults);
catDropdown.addEventListener("change", detResults);
function detResults() {
  const selectedOption = searchDropdown.value;
  const selectedCat = catDropdown.value;
  productsTbl.innerHTML = null;
  if (selectedOption === "select") {
    catSearchDiv.style.display = "none";
    catDropdown.selectedIndex = 0;
    return;
  } else if (selectedOption === "all") {
    catSearchDiv.style.display = "none";
    catDropdown.selectedIndex = 0;
    generateTable("http://localhost:8081/api/products", productsTbl, headers);
    return;
  } else {
    catSearchDiv.style.display = "inherit";
    if (selectedCat !== "select")
      generateTable(
        `http://localhost:8081/api/categories/${selectedCat}`,
        productsTbl,
        headers
      );
  }
}

async function generateTable(url, table, headers) {
  generateHeaders(table, headers);
  const promise = await fetch(url);
  const objs = await promise.json();
  const tableBodyEl = table.createTBody();
  objs.forEach((obj, i) => {
    const row = tableBodyEl.insertRow();
    for (let prop in headers) {
      const tableCell = row.insertCell();
      if (prop === "unitPrice") {
        tableCell.textContent = `$${+obj[prop]}`;
      } else if (prop === "details")
        tableCell.outerHTML = `<td><a href='./details.html?productId=${obj.productId}'>Details</a></td>`;
      else tableCell.textContent = obj[prop];
    }
  });
}
function generateHeaders(table, headers) {
  const tableHead = table.createTHead();
  const row = tableHead.insertRow();
  for (let prop in headers) {
    const headerCell = row.insertCell();
    headerCell.outerHTML = `<th>${headers[prop]}:</th>`;
  }
}
async function generateCategory(url, dropdown) {
  const promise = await fetch(url);
  const categories = await promise.json();
  categories.forEach((category) => {
    const option = new Option(category.name, category.categoryId);
    dropdown.appendChild(option);
  });
}
