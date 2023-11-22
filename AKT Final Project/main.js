
async function loadPets() {
    try {
        const petPromise = await fetch("pets.json");
        const pets = await petPromise.json();

        const template = document.querySelector("#animal-card");
        const animalsContainer = document.querySelector(".animals");

        pets.forEach(pet => {
            const clone = template.content.cloneNode(true);
            clone.querySelector("h3").textContent = pet.name;
            const img = clone.querySelector("img");
            img.src = pet.photo;
            img.alt = `A ${pet.species} named ${pet.name}`;

            const age = new Date().getFullYear() - pet.birthYear;
            const ageText = decideAgeText(age);
            clone.querySelector(".age").textContent = ageText;
            clone.querySelector(".species").textContent = pet.species;
            clone.querySelector(".description").textContent = pet.description;
            clone.querySelector(".name").textContent = pet.name;
            clone.querySelector(".primary-btn").href = `pets/${pet.id}/index.html`;
            animalsContainer.appendChild(clone);
        });
    } catch (error) {
        console.error('Could not load pets:', error);
    }
}

function decideAgeText(age) {
    if (!age) {
        return "Less than a year old";
    }
    return age > 1 ? `${age} years old` : "1 year old";
}

loadPets(); // Call the new async function

const filterButtons = document.querySelectorAll(".filter-nav a");
filterButtons.forEach(el => {
    el.addEventListener("click", e => handleFilterClick(e));
});

function handleFilterClick(e) {
    e.preventDefault();
    let target = e.target;
    filterButtons.forEach(el => el.classList.remove("active"));
    target.classList.add("active");
    filterPets(target.dataset.filter);
}

function filterPets(species) {
    const allPets = document.querySelectorAll(".animal-card");
    allPets.forEach(el => {
        el.style.display = el.querySelector(".species").textContent === species || species === "all" ? "" : "none";
    });
}

document.getElementById('show-add-pet-form').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('add-pet-form-container').style.display = 'block';
});

document.getElementById('add-pet-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('pet-id').value;
    const name = document.getElementById('pet-name').value;
    const photoFile = document.getElementById('pet-photo').files[0];
    const species = document.getElementById('pet-species').value;
    const birthYear = document.getElementById('pet-birthYear').value;
    const description = document.getElementById('pet-description').value;

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoUrl = e.target.result;
            createPetCard({ id, name, photo: photoUrl, species, birthYear, description });
        };
        reader.readAsDataURL(photoFile);
    } else {
        // If no photo was selected, use a placeholder
        createPetCard({ id, name, photo: 'path/to/default-photo.jpg', species, birthYear, description });
    }

    document.getElementById('add-pet-form').reset();
    document.getElementById('add-pet-form-container').style.display = 'none';
});

function createPetCard(pet) {
    const template = document.querySelector("#animal-card");
    const animalsContainer = document.querySelector(".animals");
    const clone = template.content.cloneNode(true);

    clone.querySelector("h3").textContent = pet.name;
    clone.querySelector(".age").textContent = decideAgeText(new Date().getFullYear() - pet.birthYear);
    clone.querySelector(".species").textContent = pet.species;
    clone.querySelector(".description").textContent = pet.description;
    clone.querySelector(".primary-btn span.name").textContent = pet.name;
    clone.querySelector(".primary-btn").href = `#adopt-${pet.id}`;

    // Assign the image URL to the src attribute of the img element
    clone.querySelector(".animal-card-photo img").src = pet.photo;
    clone.querySelector(".animal-card-photo img").alt = `A ${pet.species} named ${pet.name}`;

    animalsContainer.appendChild(clone);
}
