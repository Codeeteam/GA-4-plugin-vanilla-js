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

  private attachLinkedScript = () => {
    var script = document.createElement("script");
    script.id = "gtag";
    script.dataset.strategy = "afterInteractive";
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;

    document.body.appendChild(script);
  };

  private attachInitScript = () => {
    var script = document.createElement("script");
    script.id = "gtag-init";
    script.dataset.strategy = "afterInteractive";
    script.defer = true;

    script.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('consent','default', 
      ${JSON.stringify(this.consents, null, "\t")} 
    )

    gtag('config', '${this.id}');
    `;

    document.body.appendChild(script);
  };

  // Get consents from cookies
  private getConsentsFromCookies() {
    Object.keys(this.consents).forEach((ckey) => {
      this.consents = {
        ...this.consents,
        [ckey]: getCookieValue(ckey) || "denied",
      };
    });
  }

  private saveConsentsToDataLayer() {
    (window as any).gtag("consent", "update", this.consents);
  }

  private saveConsentsToCookies() {
    Object.keys(this.consents).forEach((ckey) => {
      setCookie(ckey, this.consents[ckey as GtagConsentsKeys]);
    });
  }

  init(isAlreadySaved?: boolean) {
    if (isAlreadySaved) this.getConsentsFromCookies();

    this.attachLinkedScript();
    this.attachInitScript();
  }

  // Save consents
  saveConsents() {
    this.saveConsentsToDataLayer();
    this.saveConsentsToCookies();
  }

  // Handle consent update
  updateConsent(parameter: GtagConsentsKeys, value: TGtagConsentValue) {
    this.consents[parameter] = value;
  }
}
