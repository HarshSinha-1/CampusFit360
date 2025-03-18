// Sample food data
const foodData = [
  {
    id: 1,
    name: "Grilled Chicken Breast",
    calories: 165,
    image: "/api/placeholder/60/60",
  },
  {
    id: 2,
    name: "Salmon Fillet",
    calories: 208,
    image: "\Food_Images\Grilled-Chicken-Breast.jpg",
  },
  {
    id: 3,
    name: "Quinoa Bowl",
    calories: 222,
    image: "/api/placeholder/60/60",
  },
  {
    id: 4,
    name: "Greek Yogurt",
    calories: 100,
    image: "/api/placeholder/60/60",
  },
  {
    id: 5,
    name: "Avocado Toast",
    calories: 190,
    image: "/api/placeholder/60/60",
  },
];

// DOM elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const foodList = document.getElementById("food-list");
const selectedFoodList = document.getElementById("selected-food-list");
const totalCaloriesElement = document.getElementById("total-calories");
const saveBtn = document.getElementById("save-btn");
const clearBtn = document.getElementById("clear-btn");
const caloriesConsumedElement = document.getElementById("calories-consumed");
const caloriesProgressElement = document.getElementById("calories-progress");

// Daily calorie goal
const calorieGoal = 2000;

// Selected foods
let selectedFoods = [];

// Initialize app
function init() {
  displayFoodList(foodData);
  updateCalorieDisplay();

  // Event listeners
  searchBtn.addEventListener("click", searchFood);
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchFood();
    }
  });

  clearBtn.addEventListener("click", clearSelectedFoods);
  saveBtn.addEventListener("click", saveDailyIntake);
}

// Display food list
function displayFoodList(foods) {
  foodList.innerHTML = "";

  if (foods.length === 0) {
    foodList.innerHTML =
      '<p style="padding: 1rem; text-align: center;">No foods found</p>';
    return;
  }

  foods.forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.className = "food-item";
    foodItem.innerHTML = `
                    <img src="${food.image}" alt="${food.name}" class="food-image">
                    <div class="food-info">
                        <div class="food-name">${food.name}</div>
                        <div class="food-calories">${food.calories} calories</div>
                    </div>
                    <button class="add-btn" data-id="${food.id}">Add</button>
                `;

    foodList.appendChild(foodItem);

    // Add click event for the add button
    const addBtn = foodItem.querySelector(".add-btn");
    addBtn.addEventListener("click", () => addFood(food));
  });
}

// Search food
function searchFood() {
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm.trim() === "") {
    displayFoodList(foodData);
    return;
  }

  const filteredFoods = foodData.filter((food) =>
    food.name.toLowerCase().includes(searchTerm)
  );

  displayFoodList(filteredFoods);
}

// Add food to selected list
function addFood(food) {
  // Check if food is already in the list
  const existingFood = selectedFoods.find((item) => item.id === food.id);

  if (existingFood) {
    existingFood.quantity += 1;
    updateSelectedFoodsList();
  } else {
    const newFood = { ...food, quantity: 1 };
    selectedFoods.push(newFood);
    updateSelectedFoodsList();
  }

  updateCalorieDisplay();
}

// Update selected foods list
function updateSelectedFoodsList() {
  selectedFoodList.innerHTML = "";

  if (selectedFoods.length === 0) {
    selectedFoodList.innerHTML =
      '<p style="padding: 1rem; text-align: center;">No foods selected</p>';
    return;
  }

  selectedFoods.forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.className = "selected-food-item";
    foodItem.innerHTML = `
                    <div class="food-info">
                        <div class="food-name">${food.name}</div>
                        <div class="food-calories">${
                          food.calories * food.quantity
                        } calories</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-id="${
                          food.id
                        }">-</button>
                        <span class="quantity">${food.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${
                          food.id
                        }">+</button>
                        <button class="remove-btn" data-id="${
                          food.id
                        }">Remove</button>
                    </div>
                `;

    selectedFoodList.appendChild(foodItem);

    // Add event listeners for quantity buttons
    const decreaseBtn = foodItem.querySelector(".decrease-btn");
    const increaseBtn = foodItem.querySelector(".increase-btn");
    const removeBtn = foodItem.querySelector(".remove-btn");

    decreaseBtn.addEventListener("click", () => decreaseQuantity(food.id));
    increaseBtn.addEventListener("click", () => increaseQuantity(food.id));
    removeBtn.addEventListener("click", () => removeFood(food.id));
  });
}

// Decrease food quantity
function decreaseQuantity(foodId) {
  const food = selectedFoods.find((item) => item.id === foodId);

  if (food.quantity > 1) {
    food.quantity -= 1;
    updateSelectedFoodsList();
    updateCalorieDisplay();
  }
}

// Increase food quantity
function increaseQuantity(foodId) {
  const food = selectedFoods.find((item) => item.id === foodId);
  food.quantity += 1;
  updateSelectedFoodsList();
  updateCalorieDisplay();
}

// Remove food from selected list
function removeFood(foodId) {
  selectedFoods = selectedFoods.filter((item) => item.id !== foodId);
  updateSelectedFoodsList();
  updateCalorieDisplay();
}

// Update calorie display
function updateCalorieDisplay() {
  const totalCalories = selectedFoods.reduce((total, food) => {
    return total + food.calories * food.quantity;
  }, 0);

  totalCaloriesElement.textContent = totalCalories;

  // Update progress
  caloriesConsumedElement.textContent = `${totalCalories} / ${calorieGoal}`;
  const percentage = Math.min((totalCalories / calorieGoal) * 100, 100);
  caloriesProgressElement.style.width = `${percentage}%`;
}

// Clear selected foods
function clearSelectedFoods() {
  selectedFoods = [];
  updateSelectedFoodsList();
  updateCalorieDisplay();
}

// Save daily intake
function saveDailyIntake() {
  if (selectedFoods.length === 0) {
    alert("No foods selected to save");
    return;
  }

  // In a real application, this would save to a database
  // For this demo, we'll just show a confirmation
  const totalCalories = selectedFoods.reduce((total, food) => {
    return total + food.calories * food.quantity;
  }, 0);

  alert(`Saved ${totalCalories} calories to today's intake`);

  // Update meal categories for demonstration
  document.getElementById("breakfast-calories").textContent = `${Math.round(
    totalCalories * 0.3
  )} cal`;
  document.getElementById("breakfast-items").textContent = selectedFoods
    .map((food) => food.name)
    .join(", ");

  document.getElementById("lunch-calories").textContent = `${Math.round(
    totalCalories * 0.4
  )} cal`;
  document.getElementById("lunch-items").textContent = selectedFoods
    .map((food) => food.name)
    .join(", ");

  document.getElementById("dinner-calories").textContent = `${Math.round(
    totalCalories * 0.3
  )} cal`;
  document.getElementById("dinner-items").textContent = selectedFoods
    .map((food) => food.name)
    .join(", ");

  // Clear selected foods
  clearSelectedFoods();
}

// Initialize the app
init();
