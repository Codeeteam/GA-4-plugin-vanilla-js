import GtagManager, {
  GtagConsentsKeys,
  TGtagConsentValue,
} from "./GtagManager";
import { getCookieValue, setCookie } from "./helpers";

const GTAGCONSENTSINIT = {
  ad_personalization_storage: "denied" as TGtagConsentValue,
  ad_storage: "denied" as TGtagConsentValue,
  ad_user_data_storage: "denied" as TGtagConsentValue,
  analytics_storage: "denied" as TGtagConsentValue,
  deva_accepted: "denied" as TGtagConsentValue,
};

interface ICookieManagerConfig {
  gtagId: string;
}

export default class CookieManager {
  private gtagManager: GtagManager;

  popupVisibility: boolean;

  constructor(cfg: ICookieManagerConfig) {
    this.gtagManager = new GtagManager({
      id: cfg.gtagId,
      consents: GTAGCONSENTSINIT,
    });
    this.popupVisibility = true;

    this.init();
  }

  private init() {
    const isAlreadySaved = getCookieValue("cookie_permisson");

    if (!!isAlreadySaved) {
      this.popupVisibility = false;
      this.gtagManager.init(true);
    } else this.gtagManager.init();
  }

  // Save data to cookies
  private saveCookies() {
    setCookie("cookie_permisson", "set");
  }

  // Handle gtag update
  updateGtagConsent(parameter: GtagConsentsKeys, value: TGtagConsentValue) {
    this.gtagManager?.updateConsent(parameter, value);
  }

  getGtagConsents() {
    return this.gtagManager?.consents;
  }

  showData() {
    console.log(this);
  }

  save() {
    this.saveCookies();
    this.gtagManager.saveConsents();

    this.popupVisibility = false;
  }
}
