document.addEventListener("DOMContentLoaded", function () {
   const cardContainer = document.getElementById("card-container");
   const searchInput = document.getElementById("search-input");
   const filterContainer = document.getElementById("filter-container");
   let digimonsList = [];
   let currentLevelFilter = "All";

   function createCard(digimon) {
      const card = document.createElement("div");
      card.className = "col-md-2 mb-2";

      card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${digimon.name}</h5>
                    <img src="${digimon.img}" class="card-img-top" alt="Imagem de ${digimon.name}">
                    <div class = "digimon-details">
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalDigimon" data-digimon-name="${digimon.name}" data-digimon-level="${digimon.level}" data-digimon-img="${digimon.img}" >Ver detalhes</button>
                    </div>
                </div>
            </div>
        `;

      return card;
   }

   function populateCards(digimons) {
      cardContainer.innerHTML = "";

      digimons.forEach((digimon) => {
         const card = createCard(digimon);
         cardContainer.appendChild(card);
      });
   }

   function createLevelButtons(levels) {
      const botaoTodos = document.createElement("button");
      botaoTodos.className =
         "btn btn-outline-primary btn-filter mr-2 mb-2 active";
      botaoTodos.textContent = "Todos";
      botaoTodos.setAttribute("data-level", "All");
      botaoTodos.addEventListener("click", function () {
         currentLevelFilter = this.getAttribute("data-level");
         highlightActiveButton(this);
         filterCards();
      });
      filterContainer.appendChild(botaoTodos);

      levels.forEach((level) => {
         const button = document.createElement("button");
         button.className = "btn btn-outline-primary btn-filter mr-2 mb-2";
         button.textContent = level;
         button.setAttribute("data-level", level);
         button.addEventListener("click", function () {
            currentLevelFilter = this.getAttribute("data-level");
            highlightActiveButton(this);
            filterCards();
         });
         filterContainer.appendChild(button);
      });
   }

   function highlightActiveButton(activeButton) {
      const buttons = document.querySelectorAll(".btn-filter");
      buttons.forEach((button) => {
         button.classList.remove("active");
      });
      activeButton.classList.add("active");
   }

   fetch("https://digimon-api.vercel.app/api/digimon")
      .then((response) => response.json())
      .then((data) => {
         digimonsList = data;
         const digimonLevels = new Set(data.map((digimon) => digimon.level));
         createLevelButtons(Array.from(digimonLevels));
         populateCards(digimonsList);
      })
      .catch((error) => {
         console.error("Erro ao buscar dados dos Digimons:", error);
      });

   function filterCards() {
      const searchText = searchInput.value.toLowerCase();
      const filteredDigimons = digimonsList.filter((digimon) => {
         const matchesName = digimon.name.toLowerCase().includes(searchText);
         const matchesLevel =
            currentLevelFilter === "All" ||
            digimon.level === currentLevelFilter;
         return matchesName && matchesLevel;
      });
      populateCards(filteredDigimons);
   }

   searchInput.addEventListener("input", filterCards);

   $("#modalDigimon").on("show.bs.modal", function (event) {
      var digimonName = $(event.relatedTarget).data("digimon-name");
      $(this).find(".modal-title").text(digimonName);

      var digimonImg = $(event.relatedTarget).data("digimon-img");
      $(this).find(".modal-img img").attr("src", digimonImg);

      var digimonLevel = $(event.relatedTarget).data("digimon-level");
      $(this).find(".modal-level").text(digimonLevel);
   });
});
