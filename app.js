/* ============================================================
   BSAN Deli Serdang — Helper bersama (jangan diubah)
   Komunikasi frontend (GitHub Pages) ↔ backend (Apps Script)
   ============================================================ */

// Apakah API sudah dikonfigurasi?
function apiSiap() {
  return (
    window.BSAN_CONFIG &&
    window.BSAN_CONFIG.API_URL &&
    window.BSAN_CONFIG.API_URL.indexOf("https://script.google.com") === 0
  );
}

// GET → Apps Script doGet. params = objek {action:..., ...}
async function apiGet(params) {
  if (!apiSiap()) throw new Error("API_BELUM_DIKONFIGURASI");
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(window.BSAN_CONFIG.API_URL + "?" + qs, {
    method: "GET",
    redirect: "follow",
  });
  const data = await res.json();
  if (data && data.ok === false) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

// POST → Apps Script doPost. body JSON dikirim sebagai text/plain
// (pola standar Apps Script agar tidak terkena preflight CORS).
async function apiPost(payload) {
  if (!apiSiap()) throw new Error("API_BELUM_DIKONFIGURASI");
  const res = await fetch(window.BSAN_CONFIG.API_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data && data.ok === false) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

// ---------- Util tampilan ----------
function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const NAMA_BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function fmtTanggal(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) return escapeHtml(v);
  return d.getDate() + " " + NAMA_BULAN[d.getMonth()] + " " + d.getFullYear();
}

function badgeStatus(st) {
  const s = String(st || "").toLowerCase().replace(/[^a-z]/g, "");
  const kelas = ["diterima","diverifikasi","ditindaklanjuti","dirujuk","selesai","spam","draft","tayang"].includes(s) ? s : "diterima";
  return '<span class="badge ' + kelas + '">' + escapeHtml(st || "Diterima") + "</span>";
}

function paramUrl(nama) {
  return new URLSearchParams(location.search).get(nama);
}

// Pesan bila API belum dikonfigurasi (mode draft)
function pesanApiBelumSiap(elemen, konteks) {
  elemen.innerHTML =
    '<div class="info-kotak kuning" style="margin:0">⚠️ <b>Mode draft:</b> backend belum terhubung. ' +
    "Setelah Apps Script di-deploy dan URL-nya diisi ke <code>config.js</code>, " +
    (konteks || "data") + " akan tampil otomatis di sini.</div>";
}

// Toggle menu HP
function toggleMenu() {
  document.getElementById("menu").classList.toggle("buka");
}
