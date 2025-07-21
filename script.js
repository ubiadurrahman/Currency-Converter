
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdown with currency codes
for (let select of dropdown) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "PKR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = 1;
  }

  // Dynamically use the selected "from" currency
  const BASE_URL = `https://v6.exchangerate-api.com/v6/7f8d1490ff5a18c0f2f8f59e/latest/${fromCurr.value}`;

  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    if (data && data.conversion_rates) {
      let rate = data.conversion_rates[toCurr.value];
      let finalAmount = amtVal * rate;

      // Show 4 decimal places for small values
      let displayAmount = finalAmount < 1 ? finalAmount.toFixed(4) : finalAmount.toFixed(2);

      msg.innerText = `${amtVal} ${fromCurr.value} = ${displayAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Error fetching exchange rates. Please try again.";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rates. Check your internet connection.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
