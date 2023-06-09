console.log("js working");
const productDetTbl = document.getElementById("productDet");
const headers = {
  productId: "ID",
  productName: "Name:",
  unitPrice: "Price",
  unitsInStock: "Units in Stock",
  supplier: "Supplier",
  discontinued: "Discontinued?",
};
onload = async () => {
  const urlParams = new URLSearchParams(location.search);
  let id = -1;
  if (urlParams.has("productId") === true) {
    const tableBodyEl = productDetTbl.createTBody();
    id = urlParams.get("productId");
    console.log("id", id);
    const response = await fetch(`http://localhost:8081/api/products/${id}`);
    const product = await response.json();
    for (let prop in headers) {
      const row = tableBodyEl.insertRow();
      const headerCell = row.insertCell();
      const dataCell = row.insertCell();
      headerCell.outerHTML = `<th>${headers[prop]}:</th>`;
      if (prop === "unitPrice") dataCell.textContent = `$${+product[prop]}`;
      else dataCell.textContent = product[prop];
    }
  }
};
