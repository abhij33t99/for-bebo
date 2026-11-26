// ✏️  This is the only file you need to edit.
window.CONFIG = {
  // Free key from https://web3forms.com (it gets emailed to you). Paste it between the quotes.
  web3formsKey: "130a0c4f-ca57-4ca0-9974-f455accbe494",

  // Your own Stitch GIFs/PNGs, e.g. "assets/stitch/sad.gif". Leave "" to use the drawn placeholder.
  stitch: {
    peek: "assets/stitch/peek.jpg",   // welcome screen
    sad: "assets/stitch/sad.jpg",    // sorry screen
    plead: "assets/stitch/plead.jpg",  // "maaf kar diya?" screen
    happy: "assets/stitch/happy.jpg"   // after she says yes
  },

  // Song file. The music button stays hidden if this file doesn't exist.
  music: "assets/music/song.mp3",

  welcome: {
    title: "Bebo, ek cheez hai tumhare liye 💙",
    subtitle: "Sound on kar lo, cutie 🎧",
    button: "Kholo 🎁"
  },

  sorry: {
    title: "I'm really sorry, Bebo 🥺",
    text: "Aaj maine kuch aisa bola jo mujhe bilkul nahi bolna chahiye tha. Tumhe hurt kiya, aur is baat ka mujhe bahut afsos hai."
  },

  // Your letter. A blank line starts a new block.
  // **bold**, *italic*, and lines starting with ">" become shayari cards.
  letterTitle: "Mere Bebo ke liye 💌",
  letter: `Meri pyaari Bebo,

I'm **sorry**, babu. 🥺 Main kabhi kabhi insecure ho jata hoon, aur us chakkar mein tumhe hurt kar deta hoon. Tumhari koi galti nahi hai. Woh mere andar ka darr hai, aur usse sambhalna meri zimmedari hai.

Sach bolun toh tum meri life ki sabse khoobsurat cheez ho, aur tumhe khone ka khayal hi mujhe dara deta hai. Par pyaar mein darr se zyada **bharosa** hona chahiye. Meri insecurity ki wajah se tumhe kabhi laga ho ki main tum par trust nahi karta, ya tumhe baar baar safai deni padi ho, toh uske liye dil se sorry. 💔

Main promise karta hoon ki main khud par kaam karunga. Jab bhi kuch feel hoga, toh shak ya gusse ke bajaye pyaar se baat karunga, aur tumhari baat dhyaan se sununga. ❤️

**Aur ab thodi si shayari, meri khoobsurat Bebo ke liye ✨**

> *Teri aankhon mein jo dekha, toh khud ko bhool gaya,*
> *Lafz dhoondhta raha, par har lafz fizool gaya.* 👀

> *Chaand ko bhi aaj kal thoda gurur kam hai,*
> *Usse pata hai meri Bebo ke aage uska noor kam hai.* 🌙

> *Teri ek muskaan pe mera din ban jaata hai,*
> *Tu hans de toh har gham kahin chhup jaata hai.* 😊

> *Na kisi pari se kam, na kisi khwaab se,*
> *Tu zyada haseen hai har khilte gulaab se.* 🌹

Tum sirf chehre se nahi, dil se bhi utni hi beautiful ho. Thank you meri life mein aane ke liye.

**I love youuuu soooo muchhhhhh babu!!! 😘❤️🥰**
Maaf kar do na apne is paagal ko? 🥺👉👈

Sirf tumhara,
**Sonu** 💕`,

  // Drafts: replace these with your real reasons. The more specific, the better.
  reasons: [
    "Tumhari smile, jo mera poora din bana deti hai 😊",
    "Tumhari awaaz sunke saari tension gayab ho jaati hai 🎧",
    "Distance ke bawajood tum paas feel hoti ho 🌍",
    "Tumhari cute si naakhre wali baatein 😋",
    "Tum meri choti choti baatein bhi yaad rakhti ho 🧠",
    "Tumhara care karne ka tareeka 🤗",
    "Tumhare saath main jaisa hoon, waisa reh sakta hoon 🫶",
    "Kyunki tum, tum ho. Meri Bebo 💙"
  ],

  // Put photos in assets/photos/ and list them here.
  // If none of these files exist, the memories page is skipped on the live site.
  photos: [
    { src: "assets/photos/1.jpg", caption: "Us ✨💙" },
    { src: "assets/photos/2.jpg", caption: "Meri favourite smile 🥹" },
    { src: "assets/photos/3.jpg", caption: "Pretty in pink 🌸" },
    { src: "assets/photos/4.jpg", caption: "Uff, yeh saree 💚" },
    { src: "assets/photos/5.jpg", caption: "Meri heroine 😎" },
    { src: "assets/photos/6.jpg", caption: "Cutie with specs 🤓" },
    { src: "assets/photos/7.jpg", caption: "Tum aur main 🫶" },
    { src: "assets/photos/8.jpg", caption: "Hamesha saath, bas aise hi 🎆" }
  ],

  // Only keep promises you will really follow.
  promises: [
    "Gusse ya insecurity mein hurt karne wali baat nahi bolunga.",
    "Insecure feel hua toh ilzaam nahi, seedha aur pyaar se bataunga.",
    "Zyada gussa aaya toh pehle thoda ruk ke, phir baat.",
    "Tumhari baat poori sununga, beech mein toke bina.",
    "Tumhari feelings ko kabhi chhota nahi samjhunga."
  ],

  ask: {
    title: "Maaf kar diya?? 🥺",
    subtitle: "Maaf kar do na apne is paagal ko? 👉👈",
    // Shown one by one each time the No button runs away.
    teasers: [
      "Arre nahi! 🙈",
      "Pakad ke dikhao 😜",
      "Yeh button thoda shy hai 🫣",
      "Haan wala dekho na, kitna cute hai 👉👈",
      "Stitch ne No button chura liya 👾",
      "Itni mehnat? Bas Yes daba do 🥹"
    ]
  },

  celebrate: {
    title: "Yayyy!! 🥳💙",
    text: "Thank you, cutie. Meri koshish rahegi ki tumhari yeh smile kabhi na jaaye. Love you, Bebo 🫶",
    shareMessage: "Maine tumhe maaf kar diya Sonu 💙 - Bebo"
  }
};
