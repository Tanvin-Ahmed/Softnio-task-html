let cartData = [];
const cartItem = {
  count: 1,
};

// dataset
const data = {
  id: 1,
  title: "Classy Modern Smart watch",
  sizes: ["s", "m", "l", "xl"],
  prices: [
    { actualPrice: 99, offerPrice: 69 },
    { actualPrice: 109, offerPrice: 79 },
    { actualPrice: 119, offerPrice: 89 },
    { actualPrice: 129, offerPrice: 99 },
  ],
  colors: [
    { purple: "#816BFF" },
    { cyan: "#1FCEC9" },
    { blue: "#4B97D3" },
    { black: "#3B4747" },
  ],
};

const actualPriceText = document.getElementById("price");
const offerPriceText = document.getElementById("offer-price");

// ******** color choose option buttons ****************

const colorButtons = document.querySelectorAll(".color-buttons input");
const thumbnail = document.getElementById("thumbnail");

// Add event listeners to all color inputs
colorButtons.forEach((button) => {
  button.addEventListener("change", () => {
    // Remove active styles and inner circles from all buttons
    colorButtons.forEach((b) => {
      const span = b.nextElementSibling;
      const color = b.value;

      // Reset the span styles
      span.className = `w-4 h-4 rounded-full bg-[${color}] cursor-pointer flex justify-center items-center`;

      // Remove any inner circle if it exists
      const innerDiv = span.querySelector("div");
      if (innerDiv) innerDiv.remove();
    });

    // Apply active style to the selected button
    const selectedSpan = button.nextElementSibling;
    const color = button.value;

    // Add active border style
    selectedSpan.className = `w-6 h-6 rounded-full border-2 border-[${color}] flex justify-center items-center`;

    // Add inner circle
    const innerDiv = document.createElement("div");
    innerDiv.className = `w-4 h-4 rounded-full bg-[${color}]`;
    selectedSpan.appendChild(innerDiv);

    // Update the thumbnail image
    const imagePath = `./assets/${color.replace("#", "").toLowerCase()}.png`;
    thumbnail.src = imagePath;

    // Update the cartItem object
    const colorKey = Object.keys(
      data.colors.find((colorObj) => Object.values(colorObj)[0] === color)
    )[0];
    cartItem["color"] = colorKey;
    cartItem["image"] = imagePath;
  });
});

// Automatically select the first color on page load
document.addEventListener("DOMContentLoaded", () => {
  if (colorButtons.length > 0) {
    colorButtons[0].checked = true;
    colorButtons[0].dispatchEvent(new Event("change"));
  }
});

// ******** work with size buttons ********
const sizeButtonsContainer = document.querySelector(".size-buttons");

let activeSizeButton = null;

// Function to reset button style
function resetSizeButtonStyle(button) {
  button.className = `rounded outline-none uppercase flex justify-center items-center gap-2 border border-[#8091A7] py-1 px-3`;
  button.querySelector("span").className = "text-[#3B4747] text-lg font-bold";
  button.querySelectorAll("span")[1].className = "text-[#8091A7] text-[13px]";
}

// Function to handle size button click
function handleSizeButtonClick(button, sizeIndex) {
  if (activeSizeButton) {
    resetSizeButtonStyle(activeSizeButton); // Reset the previously active button
  }

  // Apply the active style
  button.className = `rounded outline-none uppercase flex justify-center items-center gap-2 border border-[#6576FF] py-1 px-3`;
  button.querySelector("span").className = "text-[#6576FF] text-lg font-bold";
  button.querySelectorAll("span")[1].className = "text-[#8091A7] text-[13px]";

  // Add item to the cart (you can expand this logic based on your cart implementation)
  cartItem["size"] = data.sizes[sizeIndex];
  cartItem["price"] = data.prices[sizeIndex].offerPrice;

  // change price text
  actualPriceText.innerText = `$${data.prices[sizeIndex].actualPrice}.00`;
  offerPriceText.innerText = `$${data.prices[sizeIndex].offerPrice}.00`;

  activeSizeButton = button;
}

// Dynamically create size buttons based on the dataset
function createSizeButtons() {
  data.sizes.forEach((size, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `rounded outline-none uppercase flex justify-center items-center gap-2 border border-[#8091A7] py-1 px-3`;

    const sizeText = document.createElement("span");
    sizeText.className = "text-[#3B4747] text-lg font-bold";
    sizeText.textContent = size;

    const priceText = document.createElement("span");
    priceText.className = "text-[#8091A7] text-[13px]";
    priceText.textContent = `$${data.prices[index].offerPrice}`;

    button.appendChild(sizeText);
    button.appendChild(priceText);

    // Attach click event listener
    button.addEventListener("click", () =>
      handleSizeButtonClick(button, index)
    );

    // Append button to the container
    sizeButtonsContainer.appendChild(button);
  });
}

// Initialize size buttons dynamically
createSizeButtons();

// Make the first size button active by default
document.addEventListener("DOMContentLoaded", () => {
  const firstButton = sizeButtonsContainer.querySelector("button");
  if (firstButton) {
    handleSizeButtonClick(firstButton, 0);
  }
});

// ********* implement increase and decrease buttons functions ********
const decrementBtn = document.getElementById("decrement");
const incrementBtn = document.getElementById("increment");
const countDisplay = document.getElementById("count");

// Update the count display
function updateCount() {
  countDisplay.value = cartItem.count;
}

function handleProductCount() {
  const count = parseInt(countDisplay.value, 10);
  if (count > 0) {
    cartItem.count = count;
    cartItem["price"] = cartItem["price"] * count;
  } else {
    console.log("Cannot decrement count below 1");
  }
}

// Handle decrement button click
decrementBtn.addEventListener("click", () => {
  if (cartItem.count > 1) {
    cartItem.count--;
    cartItem["price"] = cartItem["price"] * cartItem.count;
    updateCount();
  } else {
    // Optionally disable the button when count is 1
    decrementBtn.disabled = true;
    decrementBtn.classList.add("opacity-50", "cursor-not-allowed");
  }
});

// Handle increment button click
incrementBtn.addEventListener("click", () => {
  if (decrementBtn.disabled) {
    decrementBtn.disabled = false; // Re-enable decrement button if previously disabled
    decrementBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
  cartItem.count++;
  cartItem["price"] = cartItem["price"] * cartItem.count;
  updateCount();
});

// ********** Add to cart button ********
const addToCartBtn = document.getElementById("add-to-cart-btn");
const checkoutBtnContainer = document.getElementById("checkout-btn-container");

addToCartBtn.addEventListener("click", () => {
  const existingItemIndex = cartData.findIndex(
    (item) => item.color === cartItem.color && item.size === cartItem.size
  );

  if (existingItemIndex !== -1) {
    // Item already exists in cart, update the count and price
    const existingItem = cartData[existingItemIndex];
    existingItem.count += cartItem.count; // Increase the count
    existingItem.price = existingItem.price + cartItem.price; // Update the price
  } else {
    // Item doesn't exist in cart, push a new item
    cartData.push({ ...cartItem, title: data.title });
  }

  const totalItemsInCart = cartData.reduce(
    (prev, curr) => prev + curr.count,
    0
  );

  let checkoutBtn;
  // Check if the checkout button already exists
  checkoutBtn = document.getElementById("checkout-btn");
  if (!checkoutBtn) {
    // Create the checkout button dynamically
    checkoutBtn = document.createElement("button");
    checkoutBtn.id = "checkout-btn";
    checkoutBtn.type = "button";
    checkoutBtn.className =
      "fixed bottom-[-50px] left-1/2 transform -translate-x-1/2 outline-none flex justify-center items-center gap-2 rounded-3xl bg-[#FFBB5A] text-[#364A63] py-2 px-4 text-sm shadow-lg font-semibold transition-all duration-300 ease-in-out";

    // Add text content and count with span
    checkoutBtn.innerHTML = `Checkout <span class="bg-white text-[#364A63] px-1.5 py-0.5 rounded-md">${totalItemsInCart}</span>`;
    checkoutBtnContainer.appendChild(checkoutBtn);

    // Trigger animation to slide up
    setTimeout(() => {
      checkoutBtn.style.bottom = "16px";
    }, 10);

    // Add the event listener when the button is created
    checkoutBtn.addEventListener("click", () => {
      openCartModal();
    });
  } else {
    const span = checkoutBtn.querySelector("span");
    span.textContent = totalItemsInCart;
  }
});

// Function to create and open the cart modal
function openCartModal() {
  // Hide the checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.style.display = "none";

  // Check if the modal already exists
  let modal = document.getElementById("cart-modal");
  if (!modal) {
    // Create the modal dynamically
    modal = document.createElement("div");
    modal.id = "cart-modal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

    // Modal content
    modal.innerHTML = `
      <div class="bg-white text-[#364A63] w-4/5 max-w-2xl rounded-lg p-6 relative transform transition-transform duration-300 max-h-[80vh] overflow-y-auto">
        <!-- Modal Title -->
        <h2 class="text-xl font-semibold mb-4">Your Cart</h2>
        
        <!-- Cart Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-96 overflow-auto">
            <thead>
              <tr>
                <th class="border-b border-gray-300 p-2 font-normal text-[#8091A7]">Item</th>
                <th class="border-b border-gray-300 p-2 font-normal text-[#8091A7]">Color</th>
                <th class="border-b border-gray-300 p-2 font-normal text-[#8091A7]">Size</th>
                <th class="border-b border-gray-300 p-2 font-normal text-[#8091A7]">Qnt</th>
                <th class="border-b border-gray-300 p-2 font-normal text-[#8091A7]">Price</th>
              </tr>
            </thead>
            <tbody id="cart-items">
              ${cartData
                .map(
                  (item) => `
                <tr>
                  <td class="border-b border-gray-200 p-2 flex items-center gap-2">
                    <img src="${item.image}" class="w-10 h-10 rounded" />
                    <span>${item.title}</span>
                  </td>
                  <td class="border-b border-gray-200 p-2 capitalize">${item.color}</td>
                  <td class="border-b border-gray-200 p-2 uppercase font-bold">${item.size}</td>
                  <td class="border-b border-gray-200 p-2 uppercase font-bold">${item.count}</td>
                  <td class="border-b border-gray-200 p-2 font-bold">$${item.price}.00</td>
                </tr>
              `
                )
                .join("")}
                <tr>
                  <td class="p-2 font-bold">
                    Total
                  </td>
                  <td class="p-2"></td>
                  <td class="p-2"></td>
                  <td class="p-2 font-bold">${cartData.reduce(
                    (prev, curr) => prev + curr.count,
                    0
                  )}</td>
                  <td class="border-b border-gray-200 p-2 font-bold">$${cartData.reduce(
                    (prev, curr) => prev + curr.price,
                    0
                  )}.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Modal Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            id="continue-shopping"
            class="py-1 px-2 text-[13px] sm:py-2 sm:px-4 bg-white border text-[#8091A7] rounded shadow-md hover:bg-gray-100 transition duration-300"
          >
            Continue Shopping
          </button>
          <button
            id="checkout-final"
            class="py-1 px-2 text-[13px] sm:py-2 sm:px-4 bg-[#6576FF] text-white rounded shadow-md hover:bg-[#6576FA] transition duration-300"
          >
            Checkout
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listener for dark background to close modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        if (checkoutBtn) checkoutBtn.style.display = "block";
      }
    });

    // Add event listeners for buttons
    document
      .getElementById("continue-shopping")
      .addEventListener("click", () => {
        modal.remove();
        if (checkoutBtn) checkoutBtn.style.display = "block";
      });

    document.getElementById("checkout-final").addEventListener("click", () => {
      cartData = [];
      modal.remove();
      if (checkoutBtn) checkoutBtn.remove();
    });
  }
}
