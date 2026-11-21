const form = document.querySelector("#registration-form");
const dateInput = form.querySelector('input[name="date"]');
const dialog = document.querySelector("#summary-dialog");
const summaryList = document.querySelector("#summary-list");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");
const formMessage = document.querySelector("#form-message");
const routeMapFrame = document.querySelector("#route-map-frame");
const routeMapTitle = document.querySelector("#route-map-title");
const routeMapDescription = document.querySelector("#route-map-description");
const routeMapLink = document.querySelector("#route-map-link");
const routeMap = document.querySelector("#peta");

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

dateInput.min = localDateValue(new Date());

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Buka menu" : "Tutup menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
  }
});

document.querySelectorAll(".route-card .route-arrow").forEach((link) => {
  link.addEventListener("click", () => {
    const routeName = link.closest(".route-card").querySelector("h3").textContent.trim();
    form.elements.route.value = routeName;
  });
});

document.querySelectorAll(".route-map-button").forEach((button) => {
  button.addEventListener("click", () => {
    const routeName = button.dataset.route;
    const query = button.dataset.mapQuery;
    const encodedQuery = encodeURIComponent(query);
    routeMapFrame.src = `https://maps.google.com/maps?q=${encodedQuery}&z=12&output=embed`;
    routeMapFrame.title = `Peta akses Basecamp ${routeName}, Gunung Merbabu`;
    const routeEmphasis = document.createElement("em");
    routeEmphasis.textContent = routeName;
    routeMapTitle.replaceChildren(document.createTextNode("Basecamp "), routeEmphasis);
    routeMapDescription.textContent = `Peta akses menuju Basecamp ${routeName}. Pilih jalur lain di atas untuk melihat lokasi basecamp-nya.`;
    routeMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    document.querySelectorAll(".route-map-button").forEach((routeButton) => {
      routeButton.setAttribute("aria-pressed", String(routeButton === button));
    });

    routeMap.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

function closeDialog() {
  dialog.close();
}

dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
dialog.querySelector(".dialog-done").addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("is-visible");

  const formData = new FormData(form);
  const selectedDate = new Date(`${formData.get("date")}T00:00:00`);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(selectedDate);
  const rows = [
    ["Jalur pendakian", formData.get("route")],
    ["Tanggal mulai", formattedDate],
    ["Jumlah pendaki", `${formData.get("hikers")} orang`],
    ["Ketua rombongan", formData.get("leader").trim()],
    ["Email", formData.get("email").trim()],
    ["Nomor WhatsApp", formData.get("phone").trim()]
  ];

  summaryList.replaceChildren(...rows.map(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    return row;
  }));
  dialog.showModal();
});