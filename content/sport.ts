/**
 * Editorial content for the Sport page.
 *
 * This is the only file you need to edit to change what the Sport page says.
 * Add, remove or reorder entries and the layout follows — the page lays out one
 * section per moment, alternating sides, and the dot menu on the right gets
 * one dot per moment automatically.
 *
 * `year` can be a single year ("2019") or a season ("2020/2021") — both fit.
 * In `body`, a blank line ("\n\n") starts a new paragraph.
 */

export type Moment = {
  /** The year or season shown above the photo, and in the dot menu. */
  year: string;
  /** Small mono label above the title. */
  eyebrow: string;
  title: string;
  /** Plain text. A blank line ("\n\n") starts a new paragraph. */
  body: string;
  /** Photos live in /public/sport/ — reference them as "/sport/name.jpg". */
  image?: string;
  /** Required whenever `image` is set. Describes the photo, not the moment. */
  alt?: string;
  /** Placeholder gradient angle, used only while `image` is empty. */
  angle?: string;
  /**
   * The photo's own aspect ratio, as a CSS value: "3/2" for landscape,
   * "2/3" or "3/4" for portrait. The card is sized from this, so photos are
   * never cropped — the frame changes shape instead. Defaults to "3/2".
   */
  aspect?: string;
};

/** The line under the page title; also the page's meta description. */
export const SPORT_INTRO =
  "Wow, what a beautiful journey this is. Looking at a timeline like this makes it easy to focus only on the highlights, but the reality behind it was thousands of hours in the pool, early mornings, doubts, and fatigue. It has never been a straight line to the top, but rather a journey of learning, adjusting, and discovering what truly works. Along the way, I’ve been incredibly grateful for the people I’ve met, the places I’ve traveled for training camps and competitions, and the passion that keeps pulling me back.";

export const MOMENTS: Moment[] = [
  {
    year: "2010",
    eyebrow: "01 — Beginning",
    title: "First club, first laps",
    body:
      "I was an active child who simply loved sports and staying in motion. My parents originally signed me up for basic swim lessons just so I could learn how to stay above water. I quickly fell in love with the feeling of moving through the water, and the club was structured so you could naturally progress group by group as you improved. That’s exactly what I did. I tried soccer and basketball as well, but as training demands grew, I had to choose. I chose swimming.",
    image: "/sport/bamberg-open.jpg",
    alt:
      "A young swimmer in a white GER cap and blue jammers standing poolside " +
      "among other competitors at an outdoor meet.",
    aspect: "3/2",
  },
  {
    year: "2019",
    eyebrow: "02 — Sticking with it",
    title: "Increasing volume",
    body:
      "Over the years, I worked with several coaches across two different clubs in two different cities, eventually moving from youth groups into the top squads in both. This meant training almost every day, putting in significantly more meters in the pool, and adding structured strength and conditioning work. It wasn't always smooth sailing. Dealing with changing coaches and internal club politics took a toll, and there were phases where I dreaded practice and lost some of the joy. At that point, I was ranked around 15th to 25th in Germany for my age group. When the club eventually split, I faced a crossroads: keep grinding the same high-volume way, or try a completely new approach with less meters, higher intensity, more strength, and sharper focus. I immediately knew the answer, and I fully committed to this new path.",
    image: "/sport/LennMick.jpg",
    angle: "30deg",
  },
  {
    year: "2020",
    eyebrow: "03 — Improving",
    title: "First big achievements",
    body:
      "After a year of following this new training philosophy—training continuously through COVID as part of the state squad—we had our first real test at the Junior National Championships. The strategy proved itself: I took 2nd and 3rd place. Training was fun again, and sharing that environment with close friends made all the difference.",
    image: "/sport/butterfly2022.JPG",
    angle: "210deg",
  },
  {
    year: "2020/2021",
    eyebrow: "04 — Keep pushing",
    title: "Doubling down on what worked",
    body:
      "Riding the momentum of that success, we doubled down on the exact same strategy for the following season. The next year, I won my first Junior National title and qualified for my first Open National Championships, suddenly racing alongside the senior athletes. At 16 years old, I made the Open finals in both the 50m and 100m breaststroke, finishing 6th and 7th in the country.",
    image: "/sport/djm-2023.jpg",
    angle: "95deg",
  },
  {
    year: "2021/2022",
    eyebrow: "05 — Big steps",
    title: "Breaking a national age-group record",
    body:
      "At 17, I won my first Open National title in the U21 category. That performance earned me a spot on the German national team, along with funding from Deutsche Sporthilfe. Soon after, I broke the German national age-group record in the 50m breaststroke—becoming the fastest 17-year-old in German history in the event. Around the same time, most of my friends from my home club stopped swimming. I genuinely considered quitting too; without my training partners, it was hard to see why I should keep pushing. But right around that championship meet, the youth coach from the Olympic Training Center in Potsdam invited me to visit and see if Potsdam would be the right fit. After looking at a few Olympic training centers across Germany, I decided to make the move.",
    image: "/sport/djm2023_2.JPG",
    angle: "260deg",
  },
  {
    year: "2022/2023",
    eyebrow: "06 — Training professionally",
    title: "Learning and competing at Junior Europeans",
    body:
      "For the first time, I was training in a world-class environment. Before this, I had spent years training in a short 4x25m pool. In Potsdam, I had access to top-tier coaching, dedicated physiotherapists, and elite facilities. My school was right next to the boarding house, just a five-minute walk from the pool. Everything was dialed in. Adapting wasn't easy. The jump in volume and session frequency was massive, but I adjusted well. As a junior squad, we broke the German national record at the DMSJ. Individually, I qualified for the Junior European Championships. Competing at the highest European junior level, I advanced through the 50m breaststroke semi-finals in 3rd, made the final in 2nd, and ultimately finished 4th—setting personal bests and missing the German junior record by just 0.01 seconds.",
    image: "/sport/djm2023.JPG",
    angle: "340deg",
  },
  {
    year: "2023/2024",
    eyebrow: "07 — Top group",
    title: "The limits of hard work",
    body:
      "Following facility restructuring and the results from the prior year, I moved into the senior top group in Potsdam under a new coach. Once again, I had to adapt, as we pushed volume, intensity, and frequency even higher. From the start, my gut told me this might not suit my physiology, but my coach had an impressive track record, so I trusted his authority over my own instincts. That blind trust led straight into overtraining. My progress stalled, my times plateaued, and slight gains fell far short of what I had worked for. It was a tough period, but it taught me an invaluable lesson: no matter how accomplished a coach is, you always have to think critically and stay in tune with your own body.",
    image: "/sport/sw-gym.jpg",
    angle: "340deg",
  },
  {
    year: "2024/2025",
    eyebrow: "08 — Still working",
    title: "Resetting and rebuilding",
    body:
      "The following season brought mixed emotions. As a relay team, we broke the German record in the 4x100m breaststroke. Individually, I still edged out minor improvements, but my times were still not where I wanted or expected them to be.",
    image: "/sport/DR.JPG",
    angle: "340deg",
  },
  {
    year: "2025/2026",
    eyebrow: "09 — Starting university",
    title: "Finding balance",
    body:
      "Starting university forced me to split my focus between demanding academics and high-performance sport. I reduced my training volume, hoping it would yield the same explosive turnaround I experienced years earlier when cutting meters. It didn’t work that way. I learned quickly that you can't optimize everything simultaneously without clear priorities. On top of that, I was still mentally and physically recovering from overtraining, and the general group sessions simply weren't tailored to what I needed as a pure sprinter. I seriously considered stepping away from competitive swimming altogether to focus on university, life, and my business projects. Even when I stepped away from group sessions to train completely solo at the Olympic center, I still managed to hit personal bests. It worked surprisingly well, but training alone without coaching input was far from sustainable.",
    image: "/sport/lfsh.jpg",
    angle: "340deg",
  },
  {
    year: "2026/2027",
    eyebrow: "10 — Now",
    title: "Going all-in on the 50s",
    body:
      "A new opportunity opened up when my former coach from my first year in Potsdam formed a dedicated squad exclusively for 50m sprinters. The philosophy centers purely on maximum speed and power—a modern approach where quality and recovery take precedence over mindless volume. That is where I am today. Balancing rigorous university studies with elite sprint training isn't simple, and it demands tremendous discipline. But the passion and fun are completely back. Now, we let the racing do the talking. ",
    image: "/sport/stretch.JPG",
    angle: "340deg",
  },
];

/**
 * The numbers at the top of the Sport page, above the journey. They count
 * up as the page loads. `since` is the first year in the calendar of years
 * trained; it shows `years.value` years from there.
 */
export const SPORT_STATS = {
  label: "Statistics",
  journey: "Below is the entire journey",
  medals: { value: 10, suffix: "+", label: "National medals" },
  /** Each record links to the article about it. `kind` is the small blue tag. */
  records: {
    label: "National records",
    list: [
      {
        kind: "Age group",
        event: "50 m breaststroke",
        href: "https://www.swimsportnews.de/olympia-schwimmen-2024-paris/12468-die-deutschen-altersklassenrekorde-des-jahres-2022-nachwuchs",
      },
      {
        kind: "Relay",
        event: "4×50 m breaststroke",
        href: "https://germanaquatics.de/melvin-imoudu-und-malte-graefe-fuehren-potsdam-zum-deutschen-staffelrekord/",
      },
      {
        kind: "Relay",
        event: "4×100 m breaststroke",
        href: "https://germanaquatics.de/melvin-imoudu-fuehrt-potsdams-staffel-zum-deutschen-rekord/",
      },
    ],
  },
  /** Links to the article about the race. */
  europeans: {
    place: 4,
    label: "Junior European Championships",
    href: "https://www.nwzonline.de/sport/junioren-em-im-schwimmen-christopher-weidner-erlebt-in-belgrad-wohl-und-uebel_a_4,0,1618522920.html",
  },
  years: { value: 15, suffix: "+", label: "Years trained", since: 2010 },
};

export type Clipping = {
  headline: string;
  outlet: string;
  /** When it ran, as shown: a month and year, or just the year. */
  date: string;
  /** The scanned clipping, in /public/sport/press/. */
  image: string;
  /** The scan's own pixel size, so the full view never crops it. */
  width: number;
  height: number;
  /** Describes the clipping, including its photo. */
  alt: string;
  /** The same article online, if it exists. */
  href?: string;
};

export type PressLink = {
  headline: string;
  outlet: string;
  year: string;
  href: string;
};

/**
 * The bottom of the Sport page: newspaper clippings first, then links to
 * further coverage online. Newest first in both lists.
 */
export const PRESS = {
  label: "In the press",
  title: "Press",
  linksLabel: "More coverage online",
  clippings: [
    {
      headline: "So vereint er Spitzensport und Schule",
      outlet: "Nordwest-Zeitung",
      date: "January 2023",
      image: "/sport/press/spitzensport-und-schule.jpg",
      width: 737,
      height: 1180,
      alt:
        "Newspaper page headed by a large photo of Christopher swimming butterfly " +
        "in a cap with the German flag and his name.",
      href: "https://www.nwzonline.de/sport/christopher-weidner-schwimmer-vereint-spitzensport-und-abitur-an-eliteschule-in-potsdam_a_4H9mGv6aTXS8ecgck0DHW.html",
    },
    {
      headline: "Weidner setzt Erfolgsserie bei DM fort",
      outlet: "Nordwest-Zeitung",
      date: "November 2022",
      image: "/sport/press/erfolgsserie-bei-dm.jpg",
      width: 1354,
      height: 908,
      alt:
        "Newspaper article in five columns with three portrait photos of " +
        "swimmers, Christopher in the middle.",
      href: "https://www.nwzonline.de/oldenburg-kreis/erfolgreiche-schwimmer-aus-wardenburg_a_51,11,260520674.html",
    },
    {
      headline: "Ihn locken jetzt die Olympia-Schmieden",
      outlet: "Nordwest-Zeitung",
      date: "June 2022",
      image: "/sport/press/olympia-schmieden.jpg",
      width: 622,
      height: 1190,
      alt:
        "Photographed newspaper article with a photo of Christopher wearing " +
        "two medals in front of a sponsor wall.",
    },
  ] satisfies Clipping[],
  links: [
    {
      headline: "Duo aus Oldenburg schwimmt auf Kurzbahn mit Leistungssprung in die deutsche Spitze",
      outlet: "Nordwest-Zeitung",
      year: "2024",
      href: "https://www.nwzonline.de/sport/carlotta-ingenerf-und-christopher-weidner-duo-aus-oldenburg-schwimmt-bei-kurzbahn-dm-in-deutsche-spitze_a_4,1,3153345262.html",
    },
    {
      headline: "So lebt, lernt und trainiert Schwimm-Talent aus Oldenburg auf der Sportschule in Potsdam",
      outlet: "Nordwest-Zeitung",
      year: "2023",
      href: "https://www.nwzonline.de/sport/christopher-weidner-aus-oldenburg-so-lebt-schwimm-ass-auf-der-sportschule-in-potsdam_a_4,0,3700372123.html",
    },
    {
      headline: "Junioren-EM: Christopher Weidner erlebt in Belgrad Wohl und Übel",
      outlet: "Nordwest-Zeitung",
      year: "2023",
      href: "https://www.nwzonline.de/sport/junioren-em-im-schwimmen-christopher-weidner-erlebt-in-belgrad-wohl-und-uebel_a_4,0,1618522920.html",
    },
    {
      headline: "DJM in Berlin: Oldenburger schwimmen zu Medaillen und Bestzeiten",
      outlet: "Nordwest-Zeitung",
      year: "2023",
      href: "https://www.nwzonline.de/sport/djm-in-berlin-oldenburger-schwimmen-zu-medaillen-und-bestzeiten_a_4,0,1149439028.html",
    },
    {
      headline: "Carlotta Ingenerf und Christopher Weidner holen Medaillen bei den Jahrgangsmeisterschaften",
      outlet: "Wardenburger SC",
      year: "2023",
      href: "https://www.wardenburger-sc.de/2023-djm",
    },
    {
      headline: "Sportlerwahl im Landkreis Oldenburg: Lotta Drews, Christopher Weidner und Ahlhorner SV gewinnen",
      outlet: "Nordwest-Zeitung",
      year: "2023",
      href: "https://www.nwzonline.de/sport/sportlerwahl-im-landkreis-oldenburg-lotta-drews-christopher-weidner-und-ahlhorner-sv-gewinnen_a_4,0,747750679.html",
    },
    {
      headline: "DMSJ 2023 – Sieg mit Rekord",
      outlet: "Potsdamer SV",
      year: "2023",
      href: "https://www.potsdamersv.de/2023/01/26/dmsj-2023-sieg-und-rekord/",
    },
    {
      headline: "Gemeinde Wardenburg ehrt ihre erfolgreichsten Sportler des Jahres 2022",
      outlet: "Nordwest-Zeitung",
      year: "2023",
      href: "https://www.nwzonline.de/oldenburg-kreis/gemeinde-wardenburg-ehrt-ihre-erfolgreichsten-sportler-des-jahres-2022-schwimmer-faustballer-und-tischtennisspieler-ausgezeichnet_a_4,0,3544713890.html",
    },
    {
      headline: "Christopher Weidner holt bei DJM Silber und Bronze",
      outlet: "Nordwest-Zeitung",
      year: "2021",
      href: "https://www.nwzonline.de/oldenburg/schwimmen-in-oldenburg-christopher-weidner-holt-bei-djm-silber-und-bronze_a_51,4,1418119270.html",
    },
    {
      headline: "Nachwuchs macht in Hannover fette Beute",
      outlet: "Nordwest-Zeitung",
      year: "2019",
      href: "https://www.nwzonline.de/oldenburg/lokalsport/hannover-schwimmen-nachwuchs-macht-in_a_50,6,2235773273.html",
    },
  ] satisfies PressLink[],
};
