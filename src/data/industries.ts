export interface IndustryText {
  n: string;
  h: string;
  l: string;
  s: [string, string][];
  meta: string;
}

export interface Industry {
  key: string;
  p: string[];
  it: IndustryText;
  en: IndustryText;
}

export const INDUSTRIES: Industry[] = [
  {
    key: 'healthcare', p: ['healthcare', 'virtualclinic'],
    it: {
      n: 'Sanità',
      h: 'Software per strutture sanitarie: dalla segreteria alla cartella clinica.',
      l: 'Case di cura, poliambulatori e studi medici digitalizzano agenda, cartelle, referti e fatturazione, con la protezione che i dati sanitari richiedono.',
      s: [['Cartella clinica elettronica', 'Storico paziente, documenti e referti in un unico fascicolo.'], ['Agenda e prenotazioni', 'Calendario per medico e ambulatorio, promemoria automatici.'], ['Telemedicina', 'Televisite, documenti condivisi e pagamenti online.'], ['Fatturazione sanitaria', 'Ricevute, fatture SdI e invio al Sistema TS.'], ['Ruoli e permessi', 'Medici, infermieri, direzione sanitaria e segreteria vedono ciò che serve.'], ['Migrazione dati', 'Portiamo i dati dal gestionale che usi oggi.']],
      meta: 'Software per la sanità: cartella clinica, agenda, telemedicina e fatturazione sanitaria con Sistema TS per case di cura, poliambulatori e studi medici.',
    },
    en: {
      n: 'Healthcare',
      h: 'Software for healthcare facilities: from the front desk to the medical record.',
      l: 'Care homes, outpatient clinics and medical practices digitise scheduling, records, reports and invoicing, with the protection that health data requires.',
      s: [['Electronic medical record', 'Patient history, documents and reports in a single file.'], ['Scheduling and bookings', 'Calendar by doctor and clinic room, automatic reminders.'], ['Telemedicine', 'Video consultations, shared documents and online payments.'], ['Healthcare invoicing', 'Receipts, SdI e-invoices and submission to Sistema TS.'], ['Roles and permissions', 'Doctors, nurses, medical management and front desk see what they need.'], ['Data migration', 'We bring your data over from the software you use today.']],
      meta: 'Healthcare software: medical records, scheduling, telemedicine and healthcare invoicing for care homes, outpatient clinics and medical practices.',
    },
  },
  {
    key: 'retail', p: ['cloudpos', 'cloudreviews', 'posway'],
    it: {
      n: 'Retail',
      h: 'Negozi più veloci in cassa e più ordinati in magazzino.',
      l: 'Cassa cloud, magazzino con taglie e colori, clienti e recensioni: tutto collegato, dal bancone al report di fine mese.',
      s: [['Cassa cloud', 'Vendite, resi e sconti da computer, tablet o smartphone.'], ['Magazzino', 'Varianti taglia/colore, etichette e import dagli ordini dei fornitori.'], ['Clienti', 'Storico acquisti e preferenze per vendere meglio.'], ['Pagamenti', 'Carta, link e terminali POS integrati.'], ['Recensioni Google', 'Richiesta automatica dopo l\'acquisto.'], ['Analisi', 'Cosa vende, quando e con quale margine.']],
      meta: 'Software per il retail: cassa cloud, magazzino con taglie e colori, clienti, pagamenti e recensioni Google, tutto collegato.',
    },
    en: {
      n: 'Retail',
      h: 'Shops that are faster at the till and tidier in the stockroom.',
      l: 'Cloud till, stock with sizes and colours, customers and reviews: all connected, from the counter to the month-end report.',
      s: [['Cloud till', 'Sales, returns and discounts from computer, tablet or smartphone.'], ['Stock', 'Size and colour variants, labels and import from supplier orders.'], ['Customers', 'Purchase history and preferences to sell better.'], ['Payments', 'Cards, payment links and POS terminals built in.'], ['Google reviews', 'Automatic request after the purchase.'], ['Analytics', 'What sells, when and with what margin.']],
      meta: 'Retail software: cloud till, stock with sizes and colours, customers, payments and Google reviews, all connected.',
    },
  },
  {
    key: 'hospitality', p: ['cloudstay', 'cloudpos', 'cloudreviews'],
    it: {
      n: 'Hospitality',
      h: 'Hotel, ristoranti e strutture che vendono di più sul canale diretto.',
      l: 'Prenotazioni dirette, gestione della struttura, sala e cucina, pagamenti e recensioni: piattaforme pensate per chi accoglie.',
      s: [['Booking engine e PMS', 'Prenotazioni dirette, calendario camere e check-in.'], ['Revenue management', 'Prezzi suggeriti in base a domanda ed eventi.'], ['Ristorazione', 'Sala tavoli, comande in cucina e app per i camerieri.'], ['Pagamenti', 'Incassi online e al banco, riconciliati.'], ['Recensioni', 'Più recensioni Google dopo ogni soggiorno o cena.'], ['AI per l\'ospite', 'Prenotazione anche tramite gli assistenti AI.']],
      meta: 'Software per l\'hospitality: booking engine e PMS per hotel, sala e cucina per ristoranti, pagamenti e recensioni, con prenotazione anche dagli assistenti AI.',
    },
    en: {
      n: 'Hospitality',
      h: 'Hotels, restaurants and venues that sell more through their direct channel.',
      l: 'Direct bookings, property management, dining room and kitchen, payments and reviews: platforms designed for people who welcome guests.',
      s: [['Booking engine and PMS', 'Direct bookings, room calendar and check-in.'], ['Revenue management', 'Suggested prices based on demand and events.'], ['Restaurants', 'Table map, kitchen orders and an app for waiters.'], ['Payments', 'Online and over-the-counter payments, reconciled.'], ['Reviews', 'More Google reviews after every stay or dinner.'], ['AI for guests', 'Bookings through AI assistants too.']],
      meta: 'Hospitality software: booking engine and PMS for hotels, dining room and kitchen for restaurants, payments and reviews, bookable from AI assistants too.',
    },
  },
  {
    key: 'manufacturing', p: ['cloudsuite', 'posway'],
    it: {
      n: 'Manifattura',
      h: 'PMI manifatturiere con dati, scadenze e cassa sotto controllo.',
      l: 'Gestionale cloud, integrazioni con le macchine e i sistemi di fabbrica, AI sui dati di produzione e vendita.',
      s: [['Gestionale e fatturazione', 'Clienti, fornitori, fatture SdI e scadenze.'], ['Tesoreria', 'Saldo e previsione di cassa a 90 giorni.'], ['CRM e lead generation', 'Pipeline commerciale e ricerca di nuovi clienti per settore.'], ['Integrazioni di fabbrica', 'Collegamento con MES, ERP e sensori IoT.'], ['AI sui dati', 'Previsioni di domanda e analisi in linguaggio naturale.'], ['Cloud e sicurezza', 'Infrastruttura AWS e protezione dei dati industriali.']],
      meta: 'Software per la manifattura: gestionale cloud, fatturazione SdI, tesoreria, CRM, integrazioni di fabbrica e AI sui dati di produzione e vendita.',
    },
    en: {
      n: 'Manufacturing',
      h: 'Manufacturing SMEs with data, deadlines and cash under control.',
      l: 'Cloud business software, integrations with machines and factory systems, AI on production and sales data.',
      s: [['Business software and invoicing', 'Customers, suppliers, SdI e-invoices and due dates.'], ['Treasury', 'Balance and 90-day cash forecast.'], ['CRM and lead generation', 'Sales pipeline and new customer search by industry.'], ['Factory integrations', 'Connections with MES, ERP and IoT sensors.'], ['AI on your data', 'Demand forecasts and analysis in plain language.'], ['Cloud and security', 'AWS infrastructure and protection of industrial data.']],
      meta: 'Manufacturing software: cloud business software, e-invoicing, treasury, CRM, factory integrations and AI on production and sales data.',
    },
  },
  {
    key: 'travel-logistics', p: ['cloudstay', 'posway'],
    it: {
      n: 'Travel e logistica',
      h: 'Prenotazioni, flotte e spedizioni gestite in tempo reale.',
      l: 'Sistemi di prenotazione, pagamenti e integrazioni per operatori turistici e aziende di logistica.',
      s: [['Sistemi di prenotazione', 'Disponibilità, tariffe e pagamenti online.'], ['Gestione flotte', 'Mezzi, autisti e manutenzioni in un\'unica vista.'], ['Ottimizzazione percorsi', 'Algoritmi per ridurre chilometri e tempi.'], ['Integrazioni', 'Collegamento con corrieri, portali e gestionali.'], ['Pagamenti', 'Link, abbonamenti e incassi multi-valuta.'], ['Analisi', 'Indicatori di servizio e costi per tratta.']],
      meta: 'Software per travel e logistica: sistemi di prenotazione, gestione flotte, ottimizzazione percorsi, integrazioni e pagamenti.',
    },
    en: {
      n: 'Travel and logistics',
      h: 'Bookings, fleets and shipments managed in real time.',
      l: 'Booking systems, payments and integrations for tour operators and logistics companies.',
      s: [['Booking systems', 'Availability, rates and online payments.'], ['Fleet management', 'Vehicles, drivers and maintenance in a single view.'], ['Route optimisation', 'Algorithms that cut kilometres and time.'], ['Integrations', 'Connections with couriers, portals and business software.'], ['Payments', 'Payment links, subscriptions and multi-currency collection.'], ['Analytics', 'Service indicators and costs per route.']],
      meta: 'Travel and logistics software: booking systems, fleet management, route optimisation, integrations and payments.',
    },
  },
  {
    key: 'media-entertainment', p: ['playten', 'spoortal', 'posway'],
    it: {
      n: 'Sport e intrattenimento',
      h: 'Club, enti sportivi e piattaforme media, digitali dall\'iscrizione al pagamento.',
      l: 'Prenotazione campi, tesseramenti, affiliazioni e piattaforme di contenuti con pagamenti integrati.',
      s: [['Prenotazione campi', 'App per soci, tariffe per categoria e wallet.'], ['Affiliazioni e tessere', 'Enti e federazioni con scadenze e pagamenti online.'], ['Piattaforme di contenuti', 'CMS, streaming e gestione dei diritti.'], ['Pagamenti', 'Quote, abbonamenti e terminali al circolo.'], ['Community', 'Comunicazioni, eventi e iscrizioni.'], ['Analisi', 'Presenze, incassi e andamento delle iscrizioni.']],
      meta: 'Software per sport e intrattenimento: prenotazione campi, affiliazioni e tesseramenti, piattaforme di contenuti e pagamenti integrati.',
    },
    en: {
      n: 'Sport and entertainment',
      h: 'Clubs, sports bodies and media platforms, digital from sign-up to payment.',
      l: 'Court booking, memberships, affiliations and content platforms with built-in payments.',
      s: [['Court booking', 'Member app, prices by category and wallet.'], ['Affiliations and membership cards', 'Bodies and federations with expiry dates and online payments.'], ['Content platforms', 'CMS, streaming and rights management.'], ['Payments', 'Fees, subscriptions and terminals at the club.'], ['Community', 'Announcements, events and registrations.'], ['Analytics', 'Attendance, revenue and registration trends.']],
      meta: 'Sport and entertainment software: court booking, affiliations and memberships, content platforms and built-in payments.',
    },
  },
];
