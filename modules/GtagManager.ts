import { getCookieValue, setCookie } from "./helpers";

export type TGtagConsentValue = "denied" | "granted";

export type GtagConsentsKeys =
  | "ad_personalization"
  | "ad_storage"
  | "ad_user_data"
  | "analytics_storage";
// | "deva_accepted";

export interface IGtagConsents {
  ad_personalization: TGtagConsentValue;
  ad_storage: TGtagConsentValue;
  ad_user_data: TGtagConsentValue;
  analytics_storage: TGtagConsentValue;
  // deva_accepted: TGtagConsentValue;
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

  private attachLinkedScript() {
    var script = document.createElement("script");
    script.id = "gtag";
    script.dataset.strategy = "afterInteractive";
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;

    document.body.appendChild(script);
  }

  private attachInitScript() {
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
  }

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

  saveConsents() {
    this.saveConsentsToDataLayer();
    this.saveConsentsToCookies();
  }

  updateConsent(parameter: GtagConsentsKeys, value: TGtagConsentValue) {
    this.consents[parameter] = value;
  }

  updateConsentAll(value: TGtagConsentValue) {
    Object.keys(this.consents).forEach((ckey) => {
      this.consents = {
        ...this.consents,
        [ckey]: value,
      };
    });
  }
}
