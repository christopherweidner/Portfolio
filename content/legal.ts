/**
 * Impressum and Datenschutzerklärung.
 *
 * German law requires both for a site run from Germany, so they are written
 * in German. Everything in [SQUARE BRACKETS] must be filled in before the site
 * goes live — the address in particular has to be a real postal address where
 * you can be reached (no P.O. box).
 *
 * This is a template for a private portfolio without tracking, cookies or
 * embedded third-party content. It is not legal advice: if the site starts
 * selling something, adds analytics or embeds videos, it needs updating.
 */

import { EMAIL } from "@/content/contact";

export type LegalSection = {
  heading: string;
  /** One string per paragraph. A line break inside a string is kept. */
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  /** Short line under the title. */
  lead?: string;
  sections: LegalSection[];
};

const NAME = "Christopher Weidner";
const ADDRESS = "Rosenstraße 40\n14482 Potsdam\nDeutschland";
const HOST = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA";

export const IMPRESSUM: LegalDocument = {
  title: "Impressum",
  sections: [
    {
      heading: "Angaben gemäß § 5 DDG",
      paragraphs: [`${NAME}\n${ADDRESS}`],
    },
    {
      heading: "Kontakt",
      paragraphs: [`E-Mail: ${EMAIL}`],
    },
    {
      heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      paragraphs: [`${NAME}\n${ADDRESS}`],
    },
    {
      heading: "Haftung für Inhalte",
      paragraphs: [
        "Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch keine Gewähr übernehmen. Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
      ],
    },
    {
      heading: "Haftung für Links",
      paragraphs: [
        "Diese Seite enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Werden mir Rechtsverletzungen bekannt, entferne ich derartige Links umgehend.",
      ],
    },
    {
      heading: "Urheberrecht",
      paragraphs: [
        "Die Texte und Fotos auf dieser Seite unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen meiner schriftlichen Zustimmung.",
      ],
    },
  ],
};

export const DATENSCHUTZ: LegalDocument = {
  title: "Datenschutz",
  lead: "Diese Seite ist ein persönliches Portfolio. Sie setzt keine Cookies, nutzt keine Analyse- oder Tracking-Dienste und bindet keine Inhalte Dritter ein.",
  sections: [
    {
      heading: "Verantwortlicher",
      paragraphs: [`${NAME}\n${ADDRESS}\nE-Mail: ${EMAIL}`],
    },
    {
      heading: "Hosting und Server-Logfiles",
      paragraphs: [
        `Diese Website wird gehostet bei ${HOST}. Beim Aufruf der Seite verarbeitet der Hoster automatisch Daten, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem.`,
        "Diese Daten sind technisch erforderlich, um die Website auszuliefern und ihre Sicherheit und Stabilität zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; mein berechtigtes Interesse liegt im sicheren und fehlerfreien Betrieb der Seite. Die Logfiles werden nach kurzer Zeit automatisch gelöscht.",
        "Die Übermittlung erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. der EU-Standardvertragsklauseln.",
      ],
    },
    {
      heading: "Kontakt per E-Mail",
      paragraphs: [
        "Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Adresse und den Inhalt Ihrer Nachricht, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Die Daten werden gelöscht, sobald die Unterhaltung abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten bestehen.",
      ],
    },
    {
      heading: "Schriftarten",
      paragraphs: [
        "Die Schriftarten dieser Seite werden von meinem eigenen Server ausgeliefert. Beim Laden der Seite wird keine Verbindung zu Google oder anderen Schriftanbietern aufgebaut.",
      ],
    },
    {
      heading: "Lokaler Speicher im Browser",
      paragraphs: [
        "Damit die Begrüßungsanimation auf der Startseite nur einmal pro Besuch abläuft, wird im Sitzungsspeicher (Session Storage) Ihres Browsers ein einzelner Eintrag ohne personenbezogene Daten abgelegt. Er wird nicht an mich übertragen und beim Schließen des Browserfensters automatisch gelöscht.",
      ],
    },
    {
      heading: "Links zu sozialen Netzwerken",
      paragraphs: [
        "Auf dieser Seite finden Sie einfache Links zu meinen Profilen bei Instagram, LinkedIn und YouTube. Es handelt sich nicht um eingebettete Plugins: Erst wenn Sie einen Link anklicken, werden Sie auf die Seite des jeweiligen Anbieters weitergeleitet, und erst dann gelten dessen Datenschutzbestimmungen.",
      ],
    },
    {
      heading: "Ihre Rechte",
      paragraphs: [
        "Sie haben jederzeit das Recht auf Auskunft über Ihre bei mir gespeicherten Daten, auf deren Berichtigung, Löschung oder Einschränkung der Verarbeitung, auf Datenübertragbarkeit sowie auf Widerspruch gegen die Verarbeitung (Art. 15–21 DSGVO). Eine formlose E-Mail genügt.",
        "Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, zum Beispiel bei der Landesbeauftragten für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg.",
      ],
    },
  ],
};
