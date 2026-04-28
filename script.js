// ================= NAV SEARCH =================
const searchToggle = document.getElementById("searchToggle");
const navSearchBox = document.querySelector(".nav-search");
const navSearch = document.getElementById("navSearch");

if (searchToggle) {
  searchToggle.addEventListener("click", () => {
    navSearchBox.classList.toggle("active");
    navSearch.focus();
  });
}

// ================= DATA =================
let members = JSON.parse(localStorage.getItem("members")) || [];
let editIndex = null;

// ================= ELEMENT =================
const form = document.getElementById("memberForm");
const tableBody = document.getElementById("tableBody");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

// form input
const nama = document.getElementById("nama");
const email = document.getElementById("emailmember");
const hp = document.getElementById("noHP");
const usia = document.getElementById("usiamember");
const layanan = document.getElementById("layanan");
const tanggal = document.getElementById("tanggal");
const harga = document.getElementById("harga");

// ================= AUTO HARGA =================
const hargaPaket = {
  Basic: 100000,
  Premium: 200000,
  VIP: 350000
};

const durasiSelect = document.getElementById("durasi");

layanan.addEventListener("change", updateHarga);
durasiSelect.addEventListener("change", updateHarga);

function updateHarga() {
  const paket = layanan.value;
  const durasi = durasiSelect.value;

  if (!paket || !durasi) {
    harga.value = "";
    return;
  }

  const base = hargaPaket[paket];
  harga.value = base * parseInt(durasi);
}
// ================= GENERATE KODE =================
const generateKode = () => {
  return "GF" + Math.floor(1000 + Math.random() * 9000);
};

// ================= VALIDASI =================
const validate = () => {
  if (!nama.value.trim()) return alert("Nama wajib diisi!"), false;
  if (!email.value.trim()) return alert("Email wajib diisi!"), false;
  if (!hp.value.trim()) return alert("No HP wajib diisi!"), false;
  if (!usia.value.trim()) return alert("Usia wajib diisi!"), false;
  if (!layanan.value) return alert("Pilih layanan!"), false;
  if (!tanggal.value) return alert("Tanggal wajib diisi!"), false;

  return true;
};

// ================= SAVE LOCALSTORAGE =================
const saveData = () => {
  localStorage.setItem("members", JSON.stringify(members));
};

// ================= RENDER TABLE =================
const render = () => {
  const keyword = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  tableBody.innerHTML = "";

  const filtered = members
    .map((m, i) => ({ ...m, index: i }))
    .filter(m =>
      (m.nama.toLowerCase().includes(keyword) ||
       m.kode.toLowerCase().includes(keyword)) &&
      (filter === "" || m.layanan === filter)
    );

  filtered.forEach(m => {
    tableBody.innerHTML += `
      <tr>
        <td>${m.kode}</td>
        <td>${m.nama}</td>
        <td>${m.email}</td>
        <td>${m.hp}</td>
        <td>${m.usia}</td>
        <td>${m.layanan}</td>
        <td>${m.tanggal}</td>
        <td>Rp ${Number(m.harga).toLocaleString()}</td>
        <td>${m.durasi} Bulan</td>
        <td>
          <button data-action="edit" data-index="${m.index}">Edit</button>
          <button data-action="delete" data-index="${m.index}">Hapus</button>
        </td>
      </tr>
    `;
  });

  updateStats();
};

// ================= STATISTIK =================
const updateStats = () => {
  document.getElementById("total").textContent = members.length;

  const count = members.reduce((acc, m) => {
    acc[m.layanan] = (acc[m.layanan] || 0) + 1;
    return acc;
  }, {});

  document.getElementById("stok").innerHTML =
    Object.entries(count)
      .map(([k, v]) => `${k}: ${v}`)
      .join("<br>");
};

// ================= SUBMIT (ADD + EDIT) =================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validate()) return;

  const data = {
    kode: editIndex === null ? generateKode() : members[editIndex].kode,
    nama: nama.value,
    email: email.value,
    hp: hp.value,
    usia: usia.value,
    layanan: layanan.value,
    durasi: durasiSelect.value,   // 🔥 TAMBAHAN
    tanggal: tanggal.value,
    harga: harga.value
  };

  if (editIndex !== null) {
    members[editIndex] = data;
    editIndex = null;
  } else {
    members.push(data);
  }

  saveData();
  form.reset();
  harga.value = "";

  render();
});

// ================= EDIT & DELETE =================
tableBody.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  const action = e.target.dataset.action;

  if (!action) return;

  // EDIT
  if (action === "edit") {
    const m = members[index];

    nama.value = m.nama;
    email.value = m.email;
    hp.value = m.hp;
    usia.value = m.usia;
    layanan.value = m.layanan;
    tanggal.value = m.tanggal;
    harga.value = m.harga;

    editIndex = index;
  }

  // DELETE
  if (action === "delete") {
    if (confirm("Yakin hapus data ini?")) {
      members.splice(index, 1);
      saveData();
      render();
    }
  }
});

// ================= SEARCH & FILTER =================
searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

// ================= NAV SEARCH =================
navSearch.addEventListener("input", () => {
  searchInput.value = navSearch.value;
  render();
});

// ================= INIT =================
render();