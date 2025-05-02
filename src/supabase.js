// Selecting DOM elements
const postBtn = document.querySelector(".post-btn");
const items = document.querySelector(".items");
const factForm = document.getElementById("factForm");

// Use ES module import syntax for config.js
import { SUPABASE_URL, SUPABASE_API_KEY } from "./config.js";

// LOAD DATA FROM SUPABASE
items.innerHTML = "";
loadFacts();

async function loadFacts() { 
  const res = await fetch(
    SUPABASE_URL,
    {
      headers: {
        apikey: SUPABASE_API_KEY,
        authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
    }
  );
  const data = await res.json();
  console.log(data);
  createFactList(data);
}

// CREATE FACT ITEMS
function createFactList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) =>
      `  
      <div class="facts-item" data-id="${fact.id}">
                    <div class="fact-item-bar">
                        <div class="facts-item-bar-category ${fact.category}">${
        fact.category.charAt(0).toUpperCase() + fact.category.slice(1)
      }</div>
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
                    <p class="facts-item-paragraph">
                      ${fact.text}
                    </p>
                    <div class="facts-item-reactions">
                        <button class="facts-item-reactions-positive">👍</button>
                        <div class="facts-item-reactions-votes positive">
                            ${fact.votes_positive}
                        </div>
                        <button class="facts-item-negative">👎</button>
                        <div class="facts-item-reactions-votes negative">
                            ${fact.votes_negative}
                        </div>
                    </div>
                </div>
      
    `
  );
  const html = htmlArr.join("");
  items.insertAdjacentHTML("afterbegin", html);

  // Add voting event listeners after rendering
  addVoteEventListeners();
}

//HERE WE USE POST TO INSERT DATA IN THE DATABSE
async function createFact(factData) {
  const res = await fetch(
    SUPABASE_URL,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation", // <- To get the inserted data back
      },
      body: JSON.stringify(factData),
    }
  );

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
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Get the category from the button's class or text content
    const selectedCategory = button.classList[1]; // This gets "technology", "science", etc.
    
    // Get all fact items
    const factItems = document.querySelectorAll(".facts-item");
    
    // Handle the "All" category differently
    if (selectedCategory === "all") {
      // Show all facts
      factItems.forEach(item => {
        item.style.display = "block";
      });
      return;
    }
    
    // Filter facts by category
    factItems.forEach(factItem => {
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

// Function to add event listeners to all vote buttons
function addVoteEventListeners() {
  // Helper to get/set voted facts from localStorage
  function getVotedFacts() {
    return JSON.parse(localStorage.getItem("votedFacts") || "[]");
  }
  function setVotedFacts(arr) {
    localStorage.setItem("votedFacts", JSON.stringify(arr));
  }

  // Positive votes
  document.querySelectorAll(".facts-item-reactions-positive").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const factDiv = btn.closest(".facts-item");
      const factId = factDiv.dataset.id;
      const voteDiv = factDiv.querySelector(
        ".facts-item-reactions-votes.positive"
      );
      let currentVotes = parseInt(voteDiv.textContent, 10);

      let votedFacts = getVotedFacts();
      if (votedFacts.includes(factId)) {
        alert("You have already voted on this fact.");
        return;
      }

      // Update in Supabase
      await fetch(
        `${SUPABASE_URL}?id=eq.${factId}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ votes_positive: currentVotes + 1 }),
        }
      );
      // Update UI
      voteDiv.textContent = currentVotes + 1;
      votedFacts.push(factId);
      setVotedFacts(votedFacts);
    });
  });

  // Negative votes
  document.querySelectorAll(".facts-item-negative").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const factDiv = btn.closest(".facts-item");
      const factId = factDiv.dataset.id;
      const voteDiv = factDiv.querySelector(
        ".facts-item-reactions-votes.negative"
      );
      let currentVotes = parseInt(voteDiv.textContent, 10);

      let votedFacts = getVotedFacts();
      if (votedFacts.includes(factId)) {
        alert("You have already voted on this fact.");
        return;
      }

      // Update in Supabase
      await fetch(
        `${SUPABASE_URL}?id=eq.${factId}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ votes_negative: currentVotes + 1 }),
        }
      );
      // Update UI
      voteDiv.textContent = currentVotes + 1;
      votedFacts.push(factId);
      setVotedFacts(votedFacts);
    });
  });
}