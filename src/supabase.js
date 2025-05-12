import "./modal.js";
// Use ES module import syntax for config.js
import config from "./config.js";
const { SUPABASE_URL, SUPABASE_API_KEY } = config;

// Select container
const items = document.querySelector(".items");

// When DOM is loaded fetch the facts
window.onload = () => {
  loadFacts();
};

// Fetching Facts
async function loadFacts() {
  try {
    const res = await fetch(SUPABASE_URL, {
      headers: {
        apikey: SUPABASE_API_KEY,
      },
    });
    const data = await res.json();
    createFactList(data);
  } catch (error) {
    console.error(`Error fetching facts: ${error}`);
  }
}

// CREATE FACT ITEMS
function createFactList(dataArray) {
  // Remove previous facts
  while (items.firstChild) {
    items.firstChild.remove();
  }

  dataArray.forEach((fact) => {
    const child = `  
    <div class="facts-item" data-id="${fact.id}">
        <div class="fact-item-bar">
          <div class="facts-item-bar-category ${fact.category}">
            ${fact.category.charAt(0).toUpperCase() + fact.category.slice(1)}
          </div>
            <div class="facts-item-bar-source">
              <a class="source" href="${fact.source}">Source</a>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link source-icon">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14 21 3"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
            </div>
        </div>
          <p class="facts-item-paragraph">${fact.text}</p>
            <div class="facts-item-reactions">
              <div class="facts-item-reactions-votes positive">
                <button class="facts-item-reactions-positive">👍</button>
                ${fact.votes_positive}
              </div>
              <div class="facts-item-reactions-votes negative">
                <button class="facts-item-negative">👎</button>
                ${fact.votes_negative}
              </div>
            </div>
    </div>
  `;
  items.insertAdjacentHTML("afterbegin", child);

    const positiveBtn = document.querySelector(
      ".facts-item-reactions-positive"
    );

    const negativeBtn = document.querySelector(".facts-item-negative");
    const factId = fact.id;
    
    positiveBtn.onclick = () => {
      const hasVotedPositive = localStorage.getItem(`voted_positive_${factId}`)
      
      if( hasVotedPositive) {
        alert('You have already voted positively on this fact')
        return;
      }
      
      reactionFn(
        fact.id,
        "positive",
        fact.votes_positive,
      );
      localStorage.setItem(`voted_positive_${factId}`, 'true');
    };

    negativeBtn.onclick = () => {
      const hasVotedNegative = localStorage.getItem(`voted_negative_${factId}`)
      
      if( hasVotedNegative) {
        alert('You have already voted negatively on this fact')
        return;
      }

      reactionFn(
        fact.id,
        "negative",
        fact.votes_negative,
      );

      localStorage.setItem(`voted_negative_${factId}`, 'true');

    };
  });
}

//HERE WE USE POST TO INSERT DATA IN THE DATABSE
async function createFact(factData) {
  const res = await fetch(SUPABASE_URL, {
    method: "POST",
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation", // <- To get the inserted data back
    },
    body: JSON.stringify(factData),
  });

  const data = await res.json();
  console.log("Inserted:", data);
}

//USE THE CREATEFACT WHEN USER INPUTS DATA
document
  .getElementById("factForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const fact = formData.get("fact");
    const source = formData.get("source");
    const category = formData.get("category");

    const newFact = {
      text: fact,
      source: source,
      category: category.toLowerCase(),
    };

    await createFact(newFact);

    document.getElementById("modal").close();
    this.reset();
    loadFacts();
  });

//FILTERING BY CATEGORIES
//1. Loop through the elements
//2. If element matches the category then its displayed,
// if not the display property is set to none.

// Select all category buttons
const categoryButtons = document.querySelectorAll(".categories-button");

// Add event listener to each button
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get the category from the button's class or text content
    const selectedCategory = button.classList[1]; // This gets "technology", "science", etc.

    // Get all fact items
    const factItems = document.querySelectorAll(".facts-item");

    // Handle the "All" category differently
    if (selectedCategory === "all") {
      // Show all facts
      factItems.forEach((item) => {
        item.style.display = "block";
      });
      return;
    }

    // Filter facts by category
    factItems.forEach((factItem) => {
      const categoryDiv = factItem.querySelector(".facts-item-bar-category");
      const categoryText = categoryDiv.textContent.trim().toLowerCase();

      if (categoryText === selectedCategory) {
        factItem.style.display = "block";
      } else {
        factItem.style.display = "none";
      }
    });
  });
});

//NEWEST & POPULAR FILTERING FEATURE:
// Select the "Newest" and "Popular" buttons
const newestButton = document.querySelectorAll(".button-facts-button")[0];
const popularButton = document.querySelectorAll(".button-facts-button")[1];

newestButton.addEventListener("click", () => {
  sortFacts("newest");
});

popularButton.addEventListener("click", () => {
  sortFacts("popular");
});

// Function to sort facts
async function sortFacts(type) {
  let queryUrl = SUPABASE_URL;

  if (type === "newest") {
    queryUrl += "?order=created_at.desc";
  } else if (type === "popular") {
    queryUrl += "?order=votes_positive.desc";
  }

  const res = await fetch(queryUrl, {
    headers: {
      apikey: SUPABASE_API_KEY,
      authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
  });

  const data = await res.json();
  console.log("Sorted:", data);

  items.innerHTML = ""; // Clear current facts
  createFactList(data);
  addVoteEventListeners();
}

//VOTING FEATURE

async function reactionFn(id, type, currentVotes) {
  switch (type) {
    case "positive":
      await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ votes_positive: currentVotes + 1 }),
      });
      break;
      case "negative":
      await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ votes_negative: currentVotes + 1 }),
      });
      break;
    default:
      break;
  }
  // Update HTML
  loadFacts();
}
