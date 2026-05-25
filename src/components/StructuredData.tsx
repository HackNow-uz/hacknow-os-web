const BASE_URL = "https://os.hacknow.uz";
const HACKNOW_URL = "https://hacknow.uz";

// Statik JSON-LD schemalar — faqat hardcoded ma'lumot, user input yo'q
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HackNow LLC",
  url: HACKNOW_URL,
  logo: `${BASE_URL}/hacknow-icon.png`,
  sameAs: [] as string[],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HackNow OS",
  url: BASE_URL,
  description:
    "O'zbekistonning birinchi pentesting va kiberxavfsizlik Linux distributivi",
  publisher: {
    "@type": "Organization",
    name: "HackNow LLC",
    url: HACKNOW_URL,
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HackNow OS",
  operatingSystem: "Linux/Debian",
  applicationCategory: "SecurityApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "HackNow OS — O'zbekistonning birinchi pentesting va kiberxavfsizlik Linux distributivi. 60+ pentest tool, XFCE desktop, Debian 12 Bookworm asosida.",
  url: BASE_URL,
  image: `${BASE_URL}/hacknow-wallpaper.png`,
  author: {
    "@type": "Organization",
    name: "HackNow LLC",
    url: HACKNOW_URL,
  },
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
