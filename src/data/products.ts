import type { Lang } from './routes';

export interface ProductText {
  cat: string;
  desc: string;
  /** H1 for the generic product page */
  h1?: string;
  feats?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  color: string;
  abbr: string;
  sector: string;
  domain: string;
  appUrl: string;
  it: ProductText;
  en: ProductText;
}

export const PRODUCTS: Product[] = [
  {
    id: 'cloudstay', slug: 'cloudstay', name: 'CloudStay', brand: 'Pamasoft CloudStay', color: '#1550dc', abbr: 'CS', sector: 'hotel',
    domain: 'cloudstay.pamasoft.com', appUrl: 'https://cloudstay.pamasoft.com',
    it: { cat: 'Hotel e strutture ricettive', desc: 'Booking diretto, PMS, prezzi e pulizie. Prenotabile anche dagli assistenti AI.' },
    en: { cat: 'Hotels and hospitality', desc: 'Direct booking, PMS, pricing and housekeeping. Bookable from AI assistants too.' },
  },
  {
    id: 'cloudpos', slug: 'cloudpos', name: 'CloudPos', brand: 'Pamasoft CloudPos', color: '#0f9f8f', abbr: 'CP', sector: 'negozi',
    domain: 'cloudpos.pamasoft.com', appUrl: 'https://cloudpos.pamasoft.com',
    it: { cat: 'Negozi, ristoranti, beauty, fitness', desc: 'Cassa cloud che si adatta al tuo mestiere: magazzino, sala, agenda e clienti.' },
    en: { cat: 'Shops, restaurants, beauty, fitness', desc: 'A cloud point of sale that adapts to your trade: stock, dining room, calendar and customers.' },
  },
  {
    id: 'cloudreviews', slug: 'cloudreviews', name: 'CloudReviews', brand: 'Pamasoft CloudReviews', color: '#f59e0b', abbr: 'CR', sector: 'negozi',
    domain: 'cloudreviews.pamasoft.com', appUrl: 'https://cloudreviews.pamasoft.com/register',
    it: {
      cat: 'Attività locali', desc: 'Più recensioni Google in automatico, senza violare le regole.',
      h1: 'Più recensioni Google, nel rispetto delle regole.',
      feats: ['Richiesta automatica dopo il servizio, con orari e ritardo', 'Follow-up e riattivazione dei clienti soddisfatti', 'Avviso al titolare sui voti da 1 a 3 stelle', 'Import clienti da CSV con invio graduale', 'QR e link permanente per il bancone', 'API ed eventi per collegarlo al tuo gestionale'],
    },
    en: {
      cat: 'Local businesses', desc: 'More Google reviews on autopilot, without breaking the rules.',
      h1: 'More Google reviews, playing by the rules.',
      feats: ['Automatic request after the service, with send times and delay', 'Follow-ups and re-engagement of happy customers', 'Owner alert on 1 to 3 star ratings', 'Customer import from CSV with gradual sending', 'QR code and permanent link for the counter', 'API and events to connect it to your business software'],
    },
  },
  {
    id: 'cloudsuite', slug: 'cloudsuite', name: 'CloudSuite', brand: 'Pamasoft CloudSuite', color: '#6d4ce6', abbr: 'SU', sector: 'pmi',
    domain: 'cloudsuite.pamasoft.com', appUrl: 'https://cloudsuite.pamasoft.com',
    it: {
      cat: 'PMI e professionisti', desc: 'Fatturazione elettronica, tesoreria a 90 giorni, CRM e assistente AI.',
      h1: 'Fatture, incassi e clienti in un unico posto, con l\'AI.',
      feats: ['Fatturazione elettronica SdI e scadenzario', 'Tesoreria con previsione di cassa a 90 giorni', 'CRM con pipeline, task e chiamate', 'Lead generation per codice ATECO e territorio', 'Dati azienda compilati dalla partita IVA', 'Pamasoft AI: domande e azioni con conferma'],
    },
    en: {
      cat: 'SMEs and professionals', desc: 'E-invoicing, 90-day treasury, CRM and an AI assistant.',
      h1: 'Invoices, payments and customers in one place, with AI.',
      feats: ['Italian SdI e-invoicing and due-date tracking', 'Treasury with a 90-day cash forecast', 'CRM with pipeline, tasks and calls', 'Lead generation by ATECO code and area', 'Company details filled in from the VAT number', 'Pamasoft AI: questions and actions you confirm'],
    },
  },
  {
    id: 'posway', slug: 'posway', name: 'Posway', brand: 'Posway', color: '#0ea5e9', abbr: 'PW', sector: 'pmi',
    domain: 'posway.io', appUrl: 'https://posway.io',
    it: {
      cat: 'Pagamenti', desc: 'Link e QR di pagamento, abbonamenti SEPA, terminali POS e crypto in euro.',
      h1: 'Incassi online e in negozio, anche in crypto.',
      feats: ['Link e QR di pagamento', 'Abbonamenti con addebito SEPA', 'Terminali POS per i pagamenti in presenza', 'Criptovalute convertite in euro', 'API e webhook per piattaforme partner', 'Report ed export degli incassi'],
    },
    en: {
      cat: 'Payments', desc: 'Payment links and QR codes, SEPA subscriptions, POS terminals and crypto paid out in euro.',
      h1: 'Get paid online and in store, even in crypto.',
      feats: ['Payment links and QR codes', 'Subscriptions with SEPA direct debit', 'POS terminals for in-person payments', 'Cryptocurrencies converted into euro', 'API and webhooks for partner platforms', 'Payment reports and exports'],
    },
  },
  {
    id: 'healthcare', slug: 'pamasoft-healthcare', name: 'Healthcare', brand: 'Pamasoft Healthcare', color: '#e11d48', abbr: 'HC', sector: 'sanita',
    domain: 'healthcare.pamasoft.com', appUrl: 'https://healthcare.pamasoft.com',
    it: {
      cat: 'Case di cura e poliambulatori', desc: 'Pazienti, agenda, cartelle, referti, SdI e Sistema TS.',
      h1: 'Il gestionale per case di cura e poliambulatori.',
      feats: ['Anagrafica pazienti, consensi e documenti', 'Agenda per medico, ambulatorio ed équipe', 'Cartelle cliniche e referti', 'Ricevute, fatture SdI e Sistema TS', 'Dashboard per medico, infermiere, direzione e segreteria', 'Database separato per ogni struttura'],
    },
    en: {
      cat: 'Care homes and outpatient clinics', desc: 'Patients, scheduling, records, reports, SdI e-invoicing and Sistema TS.',
      h1: 'The management software for care homes and outpatient clinics.',
      feats: ['Patient records, consents and documents', 'Scheduling by doctor, clinic room and team', 'Medical records and reports', 'Receipts, SdI e-invoices and Sistema TS', 'Dashboards for doctors, nurses, management and front desk', 'A separate database for each facility'],
    },
  },
  {
    id: 'virtualclinic', slug: 'virtual-clinic', name: 'Virtual Clinic', brand: 'Virtual Clinic', color: '#db2777', abbr: 'VC', sector: 'sanita',
    domain: 'virtualclinic.it', appUrl: 'https://virtualclinic.it',
    it: {
      cat: 'Pazienti, medici e cliniche', desc: 'Televisite, prenotazioni, referti e pagamenti in una piattaforma.',
      h1: 'Televisite che uniscono pazienti, medici e cliniche.',
      feats: ['Per i pazienti: trova lo specialista e prenota', 'Videovisita dal browser, senza installare nulla', 'Per i medici: agenda, disponibilità e referti', 'Per le cliniche: medici, tariffe e fatturazione', 'Promemoria automatici e Google Calendar', 'Assistente AI per orientare il paziente'],
    },
    en: {
      cat: 'Patients, doctors and clinics', desc: 'Video consultations, bookings, reports and payments in one platform.',
      h1: 'Video consultations that bring patients, doctors and clinics together.',
      feats: ['For patients: find the specialist and book', 'Video visits from the browser, nothing to install', 'For doctors: calendar, availability and reports', 'For clinics: doctors, fees and invoicing', 'Automatic reminders and Google Calendar', 'AI assistant to guide the patient'],
    },
  },
  {
    id: 'spoortal', slug: 'spoortal', name: 'SPOORTAL', brand: 'SPOORTAL', color: '#16a34a', abbr: 'SP', sector: 'sport',
    domain: 'spoortal.it', appUrl: 'https://spoortal.it',
    it: {
      cat: 'Enti e federazioni sportive', desc: 'Affiliazioni, tessere, pagamenti e storico di ogni società.',
      h1: 'Affiliazioni e tesseramenti per enti sportivi.',
      feats: ['Affiliazioni con scadenze e badge', 'Tessere e catalogo sport e discipline', 'Listini per affiliato e pagamenti online', 'Storico completo di ogni società', 'Pagina pubblica dell\'ente', 'Inviti agli utenti ed export'],
    },
    en: {
      cat: 'Sports bodies and federations', desc: 'Affiliations, membership cards, payments and the history of every club.',
      h1: 'Affiliations and memberships for sports bodies.',
      feats: ['Affiliations with expiry dates and badges', 'Membership cards and a catalogue of sports and disciplines', 'Price lists per affiliate and online payments', 'Full history of every club', 'Public page for the organisation', 'User invitations and exports'],
    },
  },
  {
    id: 'playten', slug: 'playten', name: 'Playten', brand: 'Playten', color: '#ea580c', abbr: 'PT', sector: 'sport',
    domain: 'playten.net', appUrl: 'https://playten.net',
    it: {
      cat: 'Circoli tennis, padel, pickleball', desc: 'Prenotazione campi, tariffe per socio, wallet e pagamenti.',
      h1: 'La app di prenotazione per circoli tennis e padel.',
      feats: ['Prenotazione campi da app', 'Tariffe per categoria socio e tipo di partita', 'Quota per singolo partecipante', 'Wallet prepagato e terminali POS', 'Chiusure e limiti di prenotazione', 'Un solo account per più circoli'],
    },
    en: {
      cat: 'Tennis, padel and pickleball clubs', desc: 'Court booking, member pricing, wallet and payments.',
      h1: 'The booking app for tennis and padel clubs.',
      feats: ['Court booking from the app', 'Prices by member category and match type', 'Per-player share of the fee', 'Prepaid wallet and POS terminals', 'Closures and booking limits', 'One account for several clubs'],
    },
  },
];

export const productById = (id: string) => {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown product ${id}`);
  return p;
};

export const SECTORS: Record<Lang, [string, string][]> = {
  it: [['tutti', 'Tutti'], ['hotel', 'Hotel'], ['negozi', 'Negozi e ristoranti'], ['pmi', 'PMI e pagamenti'], ['sanita', 'Sanità'], ['sport', 'Sport']],
  en: [['tutti', 'All'], ['hotel', 'Hotels'], ['negozi', 'Shops and restaurants'], ['pmi', 'SMEs and payments'], ['sanita', 'Healthcare'], ['sport', 'Sport']],
};

export const MENU_GROUPS: Record<Lang, [string, string[]][]> = {
  it: [['Hotel e commercio', ['cloudstay', 'cloudpos', 'cloudreviews']], ['PMI e sanità', ['cloudsuite', 'posway', 'healthcare']], ['Telemedicina e sport', ['virtualclinic', 'spoortal', 'playten']]],
  en: [['Hospitality and retail', ['cloudstay', 'cloudpos', 'cloudreviews']], ['SMEs and healthcare', ['cloudsuite', 'posway', 'healthcare']], ['Telemedicine and sport', ['virtualclinic', 'spoortal', 'playten']]],
};
