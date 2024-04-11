import GtagManager, {
  GtagConsentsKeys,
  IGtagConsents,
  TGtagConsentValue,
} from "./modules/GtagManager";
import { getCookieValue, setCookie } from "./modules/helpers";

const GTAGCONSENTSINIT = {
  ad_storage: "denied" as TGtagConsentValue,
  ad_user_data: "denied" as TGtagConsentValue,
  ad_personalization: "denied" as TGtagConsentValue,
  analytics_storage: "denied" as TGtagConsentValue,
  // deva_accepted: "denied" as TGtagConsentValue,
};

interface ICookieManagerConfig {
  gtagId: string;
}

export type CookieGtagConsentsKeys = GtagConsentsKeys;
export type ICookieIGtagConsents = IGtagConsents;

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

  private saveCookies() {
    setCookie("cookie_permisson", "set");
  }

  updateGtagConsent(parameter: GtagConsentsKeys, value: TGtagConsentValue) {
    this.gtagManager?.updateConsent(parameter, value);
  }

  updateGtagConsentAll(value: TGtagConsentValue) {
    this.gtagManager?.updateConsentAll(value);
  }

  getGtagConsents() {
    return this.gtagManager?.consents;
  }

  save() {
    this.saveCookies();
    this.gtagManager.saveConsents();

    this.popupVisibility = false;
  }
}
