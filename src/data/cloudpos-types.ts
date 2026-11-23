export type Mod = [string, string, string, string[], string, string];
export type Feat = [string, string, string];

export interface CpVariant {
  n: string;
  short: string;
  c: string;
  ic: string;
  pt: string;
  h: string;
  l: string;
  pr: string[];
  b: [string, string, string][];
  screen: string;
  mods: Mod[];
  f: Feat[];
  day: [string, string][];
  ai: [string, string][];
  faq: [string, string][];
  meta: string;
}

export interface AiCard {
  pill: string;
  h: string;
  p: string;
  u: string;
  a: string;
}

export interface CloudPosContent {
  variants: Record<string, CpVariant>;
  hub: {
    crumb: string;
    h1: string;
    lead: string;
    bizQ: string;
    bizGo: string;
    modelsBtn: string;
    trust: string[];
    shotLabel: string;
    mestH: string;
    mestL: string;
    more: string;
    allH: string;
    allL: string;
    common: Feat[];
    alt: Mod[];
    aiH: string;
    aiL: string;
    ai: AiCard[];
    small: [string, string][];
    devH: string;
    devL: string;
    dev: Feat[];
    safeH: string;
    safe: Feat[];
    stepsH: string;
    steps: [string, string, string][];
    ecoH: string;
    eco: [string, string, string][];
    sec: [string, string][];
    cmpH: string;
    cmpHead: string[];
    cmpShort: string[];
    cmp: [string, string, string][];
    faq: [string, string][];
    meta: string;
    title: string;
  };
  page: {
    allBtn: string;
    forLabel: string;
    probH: string;
    modsH: (n: string) => string;
    modsL: string;
    featsH: string;
    aiH: string;
    aiL: string;
    aiPill: string;
    dayH: string;
    incH: string;
    inc: [string, string][];
    otherH: string;
    otherGo: string;
  };
  form: {
    h: string;
    l: string;
    list: string[];
    companyLabel: string;
    selectLabel: string;
    other: string;
  };
}

export const CP_KEYS = ['retail', 'ristorazione', 'beauty', 'fitness', 'servizi'] as const;
