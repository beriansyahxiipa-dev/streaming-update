/*
  EDIT FILE INI untuk mengganti data.
  Spotify: angka total stream di bawah adalah data yang kamu masukkan sendiri
  karena Spotify Web API publik tidak menyediakan total stream lagu secara langsung.
  YouTube: masukkan videoId dan API key jika ingin mengaktifkan pengambilan view otomatis.
*/

const CONFIG = {
  siteName: "STREAMING UPDATE",
  target: 100000000,

  // Isi API key YouTube hanya jika kamu mengaktifkan mode API.
  youtubeApiKey: "",

  releases: [
    {
      id: "gbgb",
      title: "GOOD BOY GONE BAD",
      artist: "TOMORROW X TOGETHER",
      cover: "",
      spotify: { total: 100245832, daily: 125432 },
      youtube: { total: 100875421, daily: 321540, videoId: "" }
    },
    {
      id: "love-language",
      title: "Love Language",
      artist: "TOMORROW X TOGETHER",
      cover: "",
      spotify: { total: 84796053, daily: 101377 },
      youtube: { total: 0, daily: 0, videoId: "" }
    },
    {
      id: "see-you",
      title: "I'll See You There Tomorrow",
      artist: "TOMORROW X TOGETHER",
      cover: "",
      spotify: { total: 82861474, daily: 140523 },
      youtube: { total: 0, daily: 0, videoId: "" }
    }
  ],

  history: {
    labels: ["24 Aug","25 Aug","26 Aug","27 Aug","28 Aug","29 Aug","30 Aug"],
    spotify: [790000, 825000, 910000, 870000, 940000, 980000, 1020000],
    youtube: [2100000, 2400000, 2250000, 2700000, 2900000, 3100000, 3400000]
  }
};
