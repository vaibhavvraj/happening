/* ==========================================================================
   data.js
   Static data: categories, cities and sample events.
   Sample events are dated relative to today so the site always looks current.
   ========================================================================== */

(function (H) {
  "use strict";

  var DAY = 24 * 60 * 60 * 1000;

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  /** Timestamp for a time a few days from today. */
  function at(daysFromToday, hour, minute) {
    return today.getTime() + daysFromToday * DAY + hour * 3600000 + (minute || 0) * 60000;
  }

  H.DAY = DAY;
  H.TODAY = today.getTime();

  /* Categories ----------------------------------------------------------- */

  H.CATEGORIES = {
    "Hackathon": {
      blurb: "Build something with people who become teammates.",
      gradient: "linear-gradient(135deg, #0c3b3f, #1f7a6f 60%, #7fd6a8)"
    },
    "Cultural": {
      blurb: "Music, poetry, dance and evenings worth dressing up for.",
      gradient: "linear-gradient(135deg, #7a1f3d, #d6462f 60%, #f5a94a)"
    },
    "Social meetup": {
      blurb: "Board games, food walks and chai with new faces.",
      gradient: "linear-gradient(135deg, #1c2b6b, #3b6fd6 60%, #8fc3ff)"
    },
    "Welfare": {
      blurb: "Clean-ups, donation camps and drives that help your area.",
      gradient: "linear-gradient(135deg, #2d5a1b, #6aa338 60%, #d3e68a)"
    },
    "Workshop": {
      blurb: "Learn a craft or a skill in a few hours, hands on.",
      gradient: "linear-gradient(135deg, #4a2a6b, #9a55c9 60%, #e0b3f0)"
    },
    "Sports & fitness": {
      blurb: "Morning runs, beginner nets and friendly matches.",
      gradient: "linear-gradient(135deg, #8a2b00, #e8650f 60%, #ffd08a)"
    }
  };

  H.CITIES = ["Bengaluru", "Delhi", "Kolkata", "Mumbai", "Patna", "Pune"];

  /* Sample events -------------------------------------------------------- */

  H.SEED_EVENTS = [
    {
      id: "s1",
      title: "Build for Bharat 24-hour Hackathon",
      category: "Hackathon",
      city: "Bengaluru",
      area: "Indiranagar",
      venue: "The Hive Coworking, 100 Feet Road",
      start: at(5, 9),
      fee: 0,
      interested: 212,
      vibes: 96,
      organiser: { name: "BangaloreDevs", phone: "+91 80000 11122", email: "hello@bangaloredevs.example" },
      description:
        "Teams of up to four build something useful for a real local problem in 24 hours.\n" +
        "Mentors from product companies, free meals and a demo round at the end.\n" +
        "Solo participants get matched into teams at the start, so you can come alone."
    },
    {
      id: "s2",
      title: "Sunday Board Games & Chai",
      category: "Social meetup",
      city: "Bengaluru",
      area: "Koramangala",
      venue: "Third Wave Cafe, 5th Block",
      start: at(0, 19, 30),
      fee: 150,
      interested: 48,
      vibes: 30,
      organiser: { name: "Newcomers Club", phone: "+91 80000 33344", email: "play@newcomers.example" },
      description:
        "New in town? Come play Catan, Uno and Codenames with friendly strangers.\n" +
        "The fee covers one chai and a snack. Games are provided."
    },
    {
      id: "s3",
      title: "Lakeside Cleanup Drive",
      category: "Welfare",
      city: "Bengaluru",
      area: "Bellandur",
      venue: "Bellandur Lake, Gate 2",
      start: at(6, 7, 30),
      fee: 0,
      interested: 134,
      vibes: 88,
      organiser: { name: "Green Hands", phone: "+91 80000 55566", email: "join@greenhands.example" },
      description:
        "Two hours of collecting waste along the lake edge. Gloves, bags and breakfast are provided.\n" +
        "Wear closed shoes and bring a water bottle."
    },
    {
      id: "s4",
      title: "Classical Sitar Evening",
      category: "Cultural",
      city: "Delhi",
      area: "Lodhi Road",
      venue: "India Habitat Centre, Amphitheatre",
      start: at(2, 18, 45),
      fee: 300,
      interested: 76,
      vibes: 61,
      organiser: { name: "Raag Collective", phone: "+91 11000 77788", email: "tickets@raag.example" },
      description:
        "An unplugged evening of sitar and tabla with two emerging artists.\n" +
        "Seating is open. Tickets are sold at the venue gate."
    },
    {
      id: "s5",
      title: "Dilli Street Food Walk",
      category: "Social meetup",
      city: "Delhi",
      area: "Old Delhi",
      venue: "Meet at Jama Masjid Gate 1",
      start: at(6, 16),
      fee: 499,
      interested: 91,
      vibes: 70,
      organiser: { name: "Walk Dilli", phone: "+91 11000 99900", email: "walks@walkdilli.example" },
      description:
        "A three-hour guided walk through the lanes, with seven tasting stops and a local storyteller.\n" +
        "Groups are capped at 12, which makes it easy to meet people."
    },
    {
      id: "s6",
      title: "Open Mic: Poetry in Hindi & English",
      category: "Cultural",
      city: "Patna",
      area: "Boring Road",
      venue: "Cafe Pind Balluchi Terrace",
      start: at(3, 18),
      fee: 0,
      interested: 64,
      vibes: 52,
      organiser: { name: "Patna Pen Club", phone: "+91 61200 12121", email: "pen@patnapen.example" },
      description:
        "Read your own work or just listen. Five minutes per poet, sign-up at the door.\n" +
        "All languages welcome."
    },
    {
      id: "s7",
      title: "Weekend Cricket Nets for Beginners",
      category: "Sports & fitness",
      city: "Patna",
      area: "Kankarbagh",
      venue: "Patna Sports Ground",
      start: at(6, 6, 30),
      fee: 100,
      interested: 39,
      vibes: 22,
      organiser: { name: "Sunday XI", phone: "+91 61200 34343", email: "nets@sundayxi.example" },
      description:
        "A friendly nets session with a coach. Bats, balls and pads are available.\n" +
        "No experience needed."
    },
    {
      id: "s8",
      title: "Blood Donation Camp",
      category: "Welfare",
      city: "Patna",
      area: "Gandhi Maidan",
      venue: "Red Cross Bhawan",
      start: at(1, 10),
      fee: 0,
      interested: 57,
      vibes: 41,
      organiser: { name: "Red Cross Patna", phone: "+91 61200 56565", email: "camp@redcross-patna.example" },
      description:
        "Open to healthy adults aged 18 to 65. Carry a photo ID.\n" +
        "Juice and a snack are served after donating."
    },
    {
      id: "s9",
      title: "Rabindra Sangeet Sandhya",
      category: "Cultural",
      city: "Kolkata",
      area: "Gariahat",
      venue: "Rabindra Sadan Lawn",
      start: at(4, 17, 30),
      fee: 0,
      interested: 120,
      vibes: 104,
      organiser: { name: "Sur Sangam", phone: "+91 33000 21212", email: "hello@sursangam.example" },
      description:
        "A community evening of Tagore songs, open to everyone.\n" +
        "Bring a mat if you prefer to sit on the lawn."
    },
    {
      id: "s10",
      title: "Startup Founders Chai Circle",
      category: "Social meetup",
      city: "Pune",
      area: "Baner",
      venue: "Cafe Durga, Baner Road",
      start: at(2, 8, 30),
      fee: 0,
      interested: 52,
      vibes: 33,
      organiser: { name: "Pune Founders", phone: "+91 20000 43434", email: "circle@punefounders.example" },
      description:
        "An informal breakfast for people building things.\n" +
        "No pitches, just conversations and introductions."
    },
    {
      id: "s11",
      title: "Intro to Pottery Workshop",
      category: "Workshop",
      city: "Pune",
      area: "Koregaon Park",
      venue: "Clay Studio, Lane 6",
      start: at(7, 11),
      fee: 900,
      interested: 44,
      vibes: 36,
      organiser: { name: "Clay Studio", phone: "+91 20000 65656", email: "book@claystudio.example" },
      description:
        "Learn wheel basics and take home your own bowl after firing.\n" +
        "All materials are included. Limited to 10 seats."
    },
    {
      id: "s12",
      title: "Mumbai Sunrise Run, 5K",
      category: "Sports & fitness",
      city: "Mumbai",
      area: "Marine Drive",
      venue: "Start at the Air India Building",
      start: at(6, 5, 45),
      fee: 0,
      interested: 188,
      vibes: 140,
      organiser: { name: "Mumbai Runners", phone: "+91 22000 87878", email: "run@mumbairunners.example" },
      description:
        "An easy-pace 5K along the promenade. Pacers for every speed, and coffee at the finish."
    },
    {
      id: "s13",
      title: "Women in Tech Mixer",
      category: "Workshop",
      city: "Mumbai",
      area: "Bandra",
      venue: "The Hub, Linking Road",
      start: at(9, 18, 30),
      fee: 250,
      interested: 73,
      vibes: 58,
      organiser: { name: "WTM Mumbai", phone: "+91 22000 99011", email: "mixer@wtm.example" },
      description:
        "Short talks followed by open networking.\n" +
        "Students and career changers are very welcome."
    },
    {
      id: "s14",
      title: "Smart India Prep Hackathon",
      category: "Hackathon",
      city: "Delhi",
      area: "Hauz Khas",
      venue: "IIT Delhi, Seminar Hall",
      start: at(12, 9),
      fee: 0,
      interested: 301,
      vibes: 150,
      organiser: { name: "CodeSprint Delhi", phone: "+91 11000 22233", email: "team@codesprint.example" },
      description:
        "A 12-hour sprint for students and early-career developers.\n" +
        "Problem statements are shared on the day."
    }
  ];
})((window.Happening = window.Happening || {}));
