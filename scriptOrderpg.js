document.addEventListener("DOMContentLoaded", function () {
    const itemCheckboxes = document.querySelectorAll(".menu-section input[type='checkbox']");
    const cartItemsElement = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");
    const placeOrderButton = document.getElementById("placeOrder");

    let totalPrice = 0;
    console.log(`Initial total price: ₹${totalPrice.toFixed(2)}`);

    const cartItems = {};

    itemCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            console.log("Checkbox change event triggered");
 
            const listItem = checkbox.closest("li");

            if (listItem) {
                console.log("Parent <li> found for checkbox");

                const itemText = listItem.textContent.trim();
                const itemName = itemText;

                const priceMatch = itemText.match(/\₹\d+\.\d{2}/);
                const itemPrice = priceMatch ? parseFloat(priceMatch[0].replace('₹', '')) : 0;

                if (checkbox.checked) {
                    console.log(`Checkbox checked for item: ${itemName}`);
                    if (!cartItems[itemName]) {
                        cartItems[itemName] = { quantity: 1, price: itemPrice };
                    } else {
                        cartItems[itemName].quantity += 1;
                    }
                    totalPrice += itemPrice;
                } else {
                    console.log(`Checkbox unchecked for item: ${itemName}`);
                    if (cartItems[itemName]) {
                        cartItems[itemName].quantity -= 1;
                        if (cartItems[itemName].quantity === 0) {
                            delete cartItems[itemName];
                        }
                        totalPrice -= itemPrice;
                    }
                }

                console.log(`Updated total price: ₹${totalPrice.toFixed(2)}`);
                updateCart();
                totalPriceElement.textContent = `Total: ₹${totalPrice.toFixed(2)}`;
            } else {
                console.error("Parent <li> not found for checkbox");
            }
        });
    });

    placeOrderButton.addEventListener("click", function () {
        const orderDetails = Object.entries(cartItems).map(([item, details]) => {
            return `${item} x${details.quantity}`;
        }).join(', ');

        alert(`Order placed successfully!\nItems: ${orderDetails}\nTotal: ₹${totalPrice.toFixed(2)}`);
        resetForm();
    });

    function updateCart() {
        cartItemsElement.innerHTML = "";
        for (const [item, details] of Object.entries(cartItems)) {
            const li = document.createElement("li");
            li.textContent = `${item} x${details.quantity} - ₹${(details.quantity * details.price).toFixed(2)}`;
            
            // Adding plus button
            const plusButton = document.createElement("button");
            plusButton.textContent = "+";
            plusButton.style.marginRight = "5px"; // Add space between plus and minus buttons
            plusButton.addEventListener("click", function () {
                handleQuantityChange(item, 1);
            });
            li.appendChild(plusButton);

            // Adding minus button
            const minusButton = document.createElement("button");
            minusButton.textContent = "-";
            minusButton.addEventListener("click", function () {
                handleQuantityChange(item, -1);
            });
            li.appendChild(minusButton);

            cartItemsElement.appendChild(li);
        }
    }

    function handleQuantityChange(item, change) {
        const details = cartItems[item];
        details.quantity += change;
        if (details.quantity === 0) {
            delete cartItems[item];
        }
        totalPrice += details.price * change;
        console.log(`Updated total price: ₹${totalPrice.toFixed(2)}`);
        updateCart();
        totalPriceElement.textContent = `Total: ₹${totalPrice.toFixed(2)}`;
    }

    function resetForm() {
        itemCheckboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
        totalPrice = 0;
        for (const item in cartItems) {
            delete cartItems[item];
        }
        updateCart();
        totalPriceElement.textContent = "Total: ₹0.00";
    }
});
