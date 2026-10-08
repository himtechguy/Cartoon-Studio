let data = JSON.parse(
  localStorage.getItem("cartoonStudio")
) || {
  characters: [],
  scenes: [],
  episodes: []
};


const $ = selector =>
  document.querySelector(selector);


const $$ = selector =>
  document.querySelectorAll(selector);


function save() {
  localStorage.setItem(
    "cartoonStudio",
    JSON.stringify(data)
  );
}


function makeId() {
  return Date.now().toString(36) +
    Math.random().toString(36).substring(2);
}


function escapeHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================
   RENDER
========================= */

function render() {

  renderCharacters();

  renderScenes();

  renderEpisodes();
}


/* =========================
   CHARACTERS
========================= */

function renderCharacters() {

  const grid = $("#characterGrid");

  if (!data.characters.length) {

    grid.innerHTML = `
      <div class="card">
        <h3>No characters yet</h3>
        <p class="small">
          Add your first cartoon character.
        </p>
      </div>
    `;

    return;
  }


  grid.innerHTML = data.characters.map(character => {

    return `
      <article class="card">

        <div class="avatar">

          ${
            character.image
              ? `<img src="${character.image}">`
              : "🧑"
          }

        </div>

        <h3>
          ${escapeHTML(character.name)}
        </h3>

        <div class="small">
          ${escapeHTML(character.role)}
        </div>

        <div class="actions">

          <button
            class="secondary"
            onclick="editCharacter('${character.id}')">
            Edit
          </button>

          <button
            class="danger"
            onclick="deleteItem('characters','${character.id}')">
            Delete
          </button>

        </div>

      </article>
    `;

  }).join("");
}


/* =========================
   ADD CHARACTER
========================= */

$("#addCharacter").onclick = () => {

  openModal(
    "Add Character",

    `
      <label>Name</label>

      <input
        name="name"
        required
        placeholder="Example: Tino"
      >

      <label>Role</label>

      <input
        name="role"
        placeholder="Main character"
      >

      <label>Character Image</label>

      <input
        name="image"
        type="file"
        accept="image/*"
      >
    `,

    async form => {

      const file =
        form.get("image");

      let image = "";

      if (file && file.size) {

        image =
          await readFile(file);
      }

      data.characters.push({

        id: makeId(),

        name: form.get("name"),

        role: form.get("role"),

        image: image

      });

      save();

      render();
    }
  );
};


/* =========================
   EDIT CHARACTER
========================= */

function editCharacter(characterId) {

  const character =
    data.characters.find(
      x => x.id === characterId
    );


  openModal(

    "Edit Character",

    `
      <label>Name</label>

      <input
        name="name"
        value="${escapeHTML(character.name)}"
        required
      >

      <label>Role</label>

      <input
        name="role"
        value="${escapeHTML(character.role)}"
      >
    `,

    form => {

      character.name =
        form.get("name");

      character.role =
        form.get("role");

      save();

      render();
    }
  );
}


/* =========================
   SCENES
========================= */

function renderScenes() {

  const list =
    $("#sceneList");


  if (!data.scenes.length) {

    list.innerHTML = `
      <div class="scene">

        <h3>No scenes yet</h3>

        <p>
          Create your first cartoon scene.
        </p>

      </div>
    `;

    return;
  }


  list.innerHTML =
    data.scenes.map(scene => {

      return `
        <article class="scene">

          <h3>
            🎬 ${escapeHTML(scene.name)}
          </h3>

          <div class="small">

            📍 ${escapeHTML(scene.location)}

          </div>

          <p>

            ${escapeHTML(scene.dialogue)}

          </p>

          <div class="actions">

            <button
              class="secondary"
              onclick="editScene('${scene.id}')">

              Edit

            </button>

            <button
              class="danger"
              onclick="deleteItem('scenes','${scene.id}')">

              Delete

            </button>

          </div>

        </article>
      `;

    }).join("");
}


/* =========================
   ADD SCENE
========================= */

$("#addScene").onclick = () => {

  openModal(

    "Add Scene",

    `
      <label>Scene Name</label>

      <input
        name="name"
        required
        placeholder="At the shop"
      >

      <label>Location</label>

      <input
        name="location"
        placeholder="Street / house / school"
      >

      <label>Dialogue / Action</label>

      <textarea
        name="dialogue"
        placeholder="Tino: Where are you going?"
      ></textarea>
    `,

    form => {

      data.scenes.push({

        id: makeId(),

        name:
          form.get("name"),

        location:
          form.get("location"),

        dialogue:
          form.get("dialogue")

      });

      save();

      render();
    }
  );
};


/* =========================
   EDIT SCENE
========================= */

function editScene(sceneId) {

  const scene =
    data.scenes.find(
      x => x.id === sceneId
    );


  openModal(

    "Edit Scene",

    `
      <label>Scene Name</label>

      <input
        name="name"
        value="${escapeHTML(scene.name)}"
        required
      >

      <label>Location</label>

      <input
        name="location"
        value="${escapeHTML(scene.location)}"
      >

      <label>Dialogue / Action</label>

      <textarea
        name="dialogue"
      >${escapeHTML(scene.dialogue)}</textarea>
    `,

    form => {

      scene.name =
        form.get("name");

      scene.location =
        form.get("location");

      scene.dialogue =
        form.get("dialogue");

      save();

      render();
    }
  );
}


/* =========================
   EPISODES
========================= */

function renderEpisodes() {

  const list =
    $("#episodeList");


  if (!data.episodes.length) {

    list.innerHTML = `
      <div class="episode">

        <h3>No episodes yet</h3>

        <p>
          Create an episode from your scenes.
        </p>

      </div>
    `;

    return;
  }


  list.innerHTML =
    data.episodes.map(episode => {

      return `
        <article class="episode">

          <h3>
            📺 ${escapeHTML(episode.name)}
          </h3>

          <p>
            ${escapeHTML(episode.description)}
          </p>

          <div class="small">

            ${episode.scenes.length}
            scene(s)

          </div>

          <div class="actions">

            <button
              class="secondary"
              onclick="editEpisode('${episode.id}')">

              Edit

            </button>

            <button
              class="danger"
              onclick="deleteItem('episodes','${episode.id}')">

              Delete

            </button>

          </div>

        </article>
      `;

    }).join("");
}


/* =========================
   ADD EPISODE
========================= */

$("#addEpisode").onclick = () => {

  const sceneOptions =
    data.scenes.map(scene => {

      return `
        <option value="${scene.id}">
          ${escapeHTML(scene.name)}
        </option>
      `;

    }).join("");


  openModal(

    "Add Episode",

    `
      <label>Episode Title</label>

      <input
        name="name"
        required
        placeholder="Episode 1: The Trouble"
      >

      <label>Description</label>

      <textarea
        name="description"
      ></textarea>

      <label>Scenes</label>

      <select
        name="scenes"
        multiple
      >

        ${sceneOptions}

      </select>

      <div class="small">

        Select the scenes for this episode.

      </div>
    `,

    form => {

      data.episodes.push({

        id: makeId(),

        name:
          form.get("name"),

        description:
          form.get("description"),

        scenes:
          form.getAll("scenes")

      });

      save();

      render();
    }
  );
};


/* =========================
   EDIT EPISODE
========================= */

function editEpisode(episodeId) {

  const episode =
    data.episodes.find(
      x => x.id === episodeId
    );


  const sceneOptions =
    data.scenes.map(scene => {

      const selected =
        episode.scenes.includes(scene.id)
          ? "selected"
          : "";


      return `
        <option
          value="${scene.id}"
          ${selected}
        >
          ${escapeHTML(scene.name)}
        </option>
      `;

    }).join("");


  openModal(

    "Edit Episode",

    `
      <label>Episode Title</label>

      <input
        name="name"
        value="${escapeHTML(episode.name)}"
        required
      >

      <label>Description</label>

      <textarea
        name="description"
      >${escapeHTML(episode.description)}</textarea>

      <label>Scenes</label>

      <select
        name="scenes"
        multiple
      >

        ${sceneOptions}

      </select>
    `,

    form => {

      episode.name =
        form.get("name");

      episode.description =
        form.get("description");

      episode.scenes =
        form.getAll("scenes");

      save();

      render();
    }
  );
}


/* =========================
   DELETE
========================= */

function deleteItem(type, itemId) {

  if (!confirm("Delete this item?")) {
    return;
  }


  data[type] =
    data[type].filter(
      item => item.id !== itemId
    );


  save();

  render();
}


/* =========================
   MODAL
========================= */

function openModal(
  title,
  fields,
  submitFunction
) {

  $("#modalTitle").textContent =
    title;


  $("#form").innerHTML = `

    ${fields}

    <div class="formButtons">

      <button
        type="button"
        class="secondary"
        id="cancel">

        Cancel

      </button>

      <button type="submit">

        Save

      </button>

    </div>

  `;


  $("#modal")
    .classList
    .remove("hidden");


  $("#cancel").onclick =
    closeModal;


  $("#form").onsubmit =
    async event => {

      event.preventDefault();

      const form =
        new FormData(event.target);

      await submitFunction(form);

      closeModal();

    };
}


function closeModal() {

  $("#modal")
    .classList
    .add("hidden");
}


$("#closeModal").onclick =
  closeModal;


/* =========================
   FILE READER
========================= */

function readFile(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () => resolve(reader.result);

      reader.onerror =
        reject;

      reader.readAsDataURL(file);

    }
  );
}


/* =========================
   NAVIGATION
========================= */

$$(".nav").forEach(button => {

  button.onclick = () => {

    $$(".nav")
      .forEach(
        b => b.classList.remove("active")
      );


    $$(".page")
      .forEach(
        p => p.classList.remove("active")
      );


    button.classList.add("active");


    $("#" + button.dataset.page)
      .classList.add("active");

  };

});


/* =========================
   NEW PROJECT
========================= */

$("#newProject").onclick = () => {

  if (
    confirm(
      "Start a new project? Your current project will be cleared."
    )
  ) {

    data = {

      characters: [],

      scenes: [],

      episodes: []

    };


    save();

    render();

  }

};


/* START */

render();
