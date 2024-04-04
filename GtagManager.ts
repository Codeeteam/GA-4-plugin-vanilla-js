import { getCookieValue, setCookie } from "./helpers";

export type TGtagConsentValue = "denied" | "granted";

export type GtagConsentsKeys =
  | "ad_personalization_storage"
  | "ad_storage"
  | "ad_user_data_storage"
  | "analytics_storage"
  | "deva_accepted";

export interface IGtagConsents {
  ad_personalization_storage: TGtagConsentValue;
  ad_storage: TGtagConsentValue;
  ad_user_data_storage: TGtagConsentValue;
  analytics_storage: TGtagConsentValue;
  deva_accepted: TGtagConsentValue;
}

interface IGtagManagerConfig {
  id: string;
  consents: IGtagConsents;
}

export default class GtagManager {
  id: string;
  consents: IGtagConsents;

  constructor(cfg: IGtagManagerConfig) {
    this.id = cfg.id;
    this.consents = cfg.consents;
  }

  init() {
    console.log(JSON.stringify(this.consents));

    /*

      Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });

                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
        }}
      />

    */
  }

  // Get consents from cookies
  getConsentsFromCookies() {
    Object.keys(this.consents).forEach((ckey) => {
      this.consents = {
        ...this.consents,
        [ckey]: getCookieValue(ckey) || "denied",
      };
    });
  }

  // Save consents to cookies
  saveConsentToCookies() {
    Object.keys(this.consents).forEach((ckey) => {
      setCookie(ckey, this.consents[ckey as GtagConsentsKeys]);
    });
  }

  // Handle consent update
  updateConsent(parameter: GtagConsentsKeys, value: TGtagConsentValue) {
    this.consents[parameter] = value;

    // numero uno
    // function gtag() {
    //   window.dataLayer = window.dataLayer || [];
    //   window.dataLayer.push(arguments);
    // }

    // const sendConsent = useCallback((consent) => {
    //   gtag("consent", "default", consent);
    // }, []);


    // numero dos
    // useEffect(() => {
    //   const newValue = cookieConsent ? "granted" : "denied";

    //   window.gtag("consent", "update", {
    //     analytics_storage: newValue,
    //   });

    //   setLocalStorage("cookie_consent", cookieConsent);
    // }, [cookieConsent]);
  }
}
