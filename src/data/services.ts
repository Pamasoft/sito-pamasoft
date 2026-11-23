import type { Lang } from './routes';

export interface ServiceText {
  n: string;
  h: string;
  l: string;
  b: [string, string][];
  s: [string, string][];
  meta: string;
}

export interface Service {
  key: string;
  ic: string;
  p: string[];
  it: ServiceText;
  en: ServiceText;
}

export const SERVICES: Service[] = [
  {
    key: 'intelligenza-artificiale', ic: 'spark', p: ['cloudsuite', 'cloudstay', 'cloudpos'],
    it: {
      n: 'Intelligenza artificiale',
      h: 'AI su misura per i processi della tua azienda.',
      l: 'Assistenti che rispondono sui tuoi dati, automazioni che tolgono lavoro ripetitivo, analisi che anticipano le decisioni. Le stesse competenze che usiamo nei nostri prodotti, applicate al tuo caso.',
      b: [['Decisioni basate sui dati', 'Analisi predittive su vendite, scorte, cassa e clienti.'], ['Meno lavoro ripetitivo', 'Documenti, email e dati letti e smistati in automatico.'], ['Clienti seguiti meglio', 'Assistenti che rispondono 24 ore su 24, con passaggio a una persona quando serve.']],
      s: [['AI generativa e assistenti', 'Chatbot e copiloti su documenti e dati aziendali, con i modelli AI più adatti al caso.'], ['Machine learning', 'Modelli predittivi per previsioni di domanda, classificazione e anomalie.'], ['Computer vision', 'Riconoscimento di oggetti e documenti, controllo qualità visivo.'], ['Elaborazione del linguaggio', 'Estrazione di dati da PDF, email e contratti; classificazione e sintesi.'], ['Automazione dei processi', 'Flussi che collegano gestionali, email e AI, con approvazione umana.'], ['Strategia e formazione', 'Dove l\'AI conviene davvero, con quali dati, e come formare il team.']],
      meta: 'Intelligenza artificiale su misura: assistenti sui dati aziendali, automazioni, machine learning e analisi. Le competenze dei prodotti Pamasoft, applicate al tuo caso.',
    },
    en: {
      n: 'Artificial intelligence',
      h: 'AI built around your company\'s processes.',
      l: 'Assistants that answer from your data, automations that take repetitive work off your plate, analysis that helps you decide ahead of time. The same skills we use in our own products, applied to your case.',
      b: [['Data-driven decisions', 'Predictive analysis on sales, stock, cash and customers.'], ['Less repetitive work', 'Documents, emails and data read and routed automatically.'], ['Better customer care', 'Assistants that answer around the clock and hand over to a person when needed.']],
      s: [['Generative AI and assistants', 'Chatbots and copilots on company documents and data, with the AI models that best fit the case.'], ['Machine learning', 'Predictive models for demand forecasting, classification and anomaly detection.'], ['Computer vision', 'Object and document recognition, visual quality control.'], ['Language processing', 'Data extraction from PDFs, emails and contracts; classification and summaries.'], ['Process automation', 'Flows that connect business software, email and AI, with human approval.'], ['Strategy and training', 'Where AI really pays off, with which data, and how to train your team.']],
      meta: 'Custom artificial intelligence: assistants on company data, automation, machine learning and analytics. The skills behind Pamasoft products, applied to your case.',
    },
  },
  {
    key: 'cloud-computing', ic: 'cloud', p: ['cloudsuite', 'posway'],
    it: {
      n: 'Cloud computing AWS',
      h: 'Il tuo software su AWS, sicuro e senza sorprese in bolletta.',
      l: 'Migrazioni, architetture scalabili e DevOps. È dove gestiamo i nostri prodotti ogni giorno: portiamo la stessa esperienza sui tuoi sistemi.',
      b: [['Cresce con te', 'Risorse che si adattano al carico, senza server da comprare.'], ['Costi sotto controllo', 'Architetture dimensionate e monitorate, paghi quello che usi.'], ['Continuità operativa', 'Backup automatici e ripristino in caso di guasto.']],
      s: [['Migrazione al cloud', 'Analisi, piano e trasferimento di applicazioni e database senza fermare il lavoro.'], ['Applicazioni scalabili', 'Il software regge i picchi di lavoro senza rallentare.'], ['Dati al sicuro', 'Database gestiti con backup automatici e copie di riserva.'], ['Rete e sicurezza', 'Accessi, reti private e protezioni configurati a regola d\'arte.'], ['Aggiornamenti senza interruzioni', 'Rilasci automatici, con ambienti di prova separati dalla produzione.'], ['Monitoraggio e costi', 'Allarmi in tempo reale e revisione periodica della spesa.']],
      meta: 'Cloud computing AWS: migrazioni, architetture scalabili, backup e monitoraggio dei costi. Portiamo sui tuoi sistemi l\'esperienza con cui gestiamo i nostri prodotti.',
    },
    en: {
      n: 'AWS cloud computing',
      h: 'Your software on AWS, secure and with no surprises on the bill.',
      l: 'Migrations, scalable architectures and DevOps. It is where we run our own products every day, and we bring the same experience to your systems.',
      b: [['Grows with you', 'Resources that adapt to the load, with no servers to buy.'], ['Costs under control', 'Right-sized, monitored architectures: you pay for what you use.'], ['Business continuity', 'Automatic backups and recovery when something fails.']],
      s: [['Cloud migration', 'Assessment, plan and transfer of applications and databases without stopping work.'], ['Scalable applications', 'Software that handles peaks without slowing down.'], ['Data kept safe', 'Managed databases with automatic backups and spare copies.'], ['Network and security', 'Access, private networks and protections configured properly.'], ['Updates without downtime', 'Automated releases, with test environments kept apart from production.'], ['Monitoring and costs', 'Real-time alerts and regular spending reviews.']],
      meta: 'AWS cloud computing: migrations, scalable architectures, backups and cost monitoring. We bring the experience we use to run our own products to your systems.',
    },
  },
  {
    key: 'blockchain', ic: 'chain', p: ['posway'],
    it: {
      n: 'Blockchain e Web3',
      h: 'Blockchain dove serve davvero: fiducia, tracciabilità, pagamenti.',
      l: 'Smart contract, tokenizzazione e pagamenti in criptovaluta integrati nei processi reali. Valutiamo con te se la blockchain porta un vantaggio, e la sviluppiamo solo se lo porta.',
      b: [['Dati non modificabili', 'Registri condivisi e verificabili da tutti i partecipanti.'], ['Meno intermediari', 'Regole che si eseguono da sole con gli smart contract.'], ['Nuovi modelli di business', 'Asset tokenizzati, programmi fedeltà e pagamenti globali.']],
      s: [['Smart contract', 'Sviluppo e audit su Ethereum, Polygon e reti compatibili.'], ['Tokenizzazione di asset', 'Immobili, opere, quote e crediti rappresentati come token, con attenzione alla normativa.'], ['Pagamenti in crypto', 'Accetti criptovalute e ricevi euro sul conto, integrato con Posway.'], ['Tracciabilità di filiera', 'Origine e passaggi di prodotti registrati e verificabili dal cliente finale.'], ['dApp e integrazione wallet', 'Interfacce web3 semplici, con MetaMask e WalletConnect.'], ['Strategia Web3', 'Valutazione di fattibilità, tokenomics e roadmap.']],
      meta: 'Blockchain e Web3 dove servono davvero: smart contract, tokenizzazione, tracciabilità di filiera e pagamenti in criptovaluta con accredito in euro.',
    },
    en: {
      n: 'Blockchain and Web3',
      h: 'Blockchain where it really helps: trust, traceability, payments.',
      l: 'Smart contracts, tokenisation and crypto payments built into real processes. We assess with you whether blockchain brings an advantage, and we only build it if it does.',
      b: [['Tamper-proof data', 'Shared ledgers that every participant can verify.'], ['Fewer intermediaries', 'Rules that run on their own through smart contracts.'], ['New business models', 'Tokenised assets, loyalty programmes and global payments.']],
      s: [['Smart contracts', 'Development and audits on Ethereum, Polygon and compatible networks.'], ['Asset tokenisation', 'Property, artworks, shares and credits represented as tokens, with care for regulation.'], ['Crypto payments', 'Accept cryptocurrencies and receive euro in your account, integrated with Posway.'], ['Supply chain traceability', 'Product origin and every step recorded and verifiable by the end customer.'], ['dApps and wallet integration', 'Simple web3 interfaces, with MetaMask and WalletConnect.'], ['Web3 strategy', 'Feasibility assessment, tokenomics and roadmap.']],
      meta: 'Blockchain and Web3 where they really help: smart contracts, tokenisation, supply chain traceability and crypto payments paid out in euro.',
    },
  },
  {
    key: 'cybersecurity', ic: 'shield', p: ['healthcare', 'posway'],
    it: {
      n: 'Cybersecurity',
      h: 'Proteggi dati, sistemi e clienti prima che sia un problema.',
      l: 'Analisi delle vulnerabilità, messa in sicurezza delle infrastrutture e adeguamento normativo. Con un piano chiaro e priorità che si possono realizzare.',
      b: [['Rischi conosciuti', 'Sai dove sei esposto e cosa correggere per primo.'], ['Normative rispettate', 'GDPR e NIS2 affrontati con documenti e misure concrete.'], ['Pronti all\'imprevisto', 'Backup, piani di risposta e ripristino testati.']],
      s: [['Vulnerability assessment', 'Scansione e analisi di applicazioni, server e reti.'], ['Penetration test', 'Test controllati che simulano un attacco reale.'], ['Sicurezza cloud', 'Revisione della configurazione cloud: permessi, reti, cifratura.'], ['GDPR e NIS2', 'Analisi dei gap, registri, procedure e formazione.'], ['Risposta agli incidenti', 'Piano di emergenza, contenimento e analisi dopo l\'evento.'], ['Formazione del personale', 'Phishing e buone pratiche per chi lavora ogni giorno.']],
      meta: 'Cybersecurity per le aziende: vulnerability assessment, penetration test, sicurezza cloud, GDPR e NIS2, risposta agli incidenti e formazione del personale.',
    },
    en: {
      n: 'Cybersecurity',
      h: 'Protect data, systems and customers before it becomes a problem.',
      l: 'Vulnerability assessment, infrastructure hardening and regulatory compliance. With a clear plan and priorities you can actually deliver.',
      b: [['Known risks', 'You know where you are exposed and what to fix first.'], ['Compliance in place', 'GDPR and NIS2 handled with concrete documents and measures.'], ['Ready for the unexpected', 'Tested backups, response plans and recovery.']],
      s: [['Vulnerability assessment', 'Scanning and analysis of applications, servers and networks.'], ['Penetration testing', 'Controlled tests that simulate a real attack.'], ['Cloud security', 'Review of your cloud setup: permissions, networks, encryption.'], ['GDPR and NIS2', 'Gap analysis, records, procedures and training.'], ['Incident response', 'Emergency plan, containment and post-incident analysis.'], ['Staff training', 'Phishing awareness and good habits for everyday work.']],
      meta: 'Cybersecurity for companies: vulnerability assessment, penetration testing, cloud security, GDPR and NIS2, incident response and staff training.',
    },
  },
  {
    key: 'sviluppo-applicazioni-web', ic: 'code', p: ['cloudsuite', 'cloudpos', 'healthcare'],
    it: {
      n: 'Progetti su misura',
      h: 'Gestionali e piattaforme web costruiti attorno al tuo lavoro.',
      l: 'Dall\'idea al prodotto online: progettiamo e sviluppiamo gestionali, piattaforme web e app costruiti attorno ai tuoi processi.',
      b: [['Su misura', 'Il software segue i tuoi processi, non il contrario.'], ['Pronto a crescere', 'Architettura multi-azienda e cloud fin dal primo giorno.'], ['Integrato', 'Si collega a fatturazione, pagamenti e sistemi esistenti.']],
      s: [['Analisi e UX', 'Workshop, flussi e prototipi navigabili prima di scrivere codice.'], ['Gestionali e piattaforme', 'Software web sicuro e veloce, pronto per più sedi e più utenti.'], ['Interfacce semplici', 'Schermate chiare da usare su computer, tablet e smartphone.'], ['App mobile', 'App e web app per staff sul campo e clienti finali.'], ['Integrazioni e API', 'SdI, pagamenti, gestionali, e-commerce e servizi esterni.'], ['Manutenzione', 'Evoluzione continua, monitoraggio e assistenza.']],
      meta: 'Progetti su misura: gestionali, piattaforme web e app costruiti attorno ai tuoi processi, integrati con fatturazione, pagamenti e sistemi esistenti.',
    },
    en: {
      n: 'Custom projects',
      h: 'Business software and web platforms built around the way you work.',
      l: 'From idea to live product: we design and build business software, web platforms and apps around your processes.',
      b: [['Made for you', 'The software follows your processes, not the other way round.'], ['Ready to grow', 'Multi-company, cloud architecture from day one.'], ['Connected', 'It links up with invoicing, payments and the systems you already have.']],
      s: [['Analysis and UX', 'Workshops, flows and clickable prototypes before any code is written.'], ['Business software and platforms', 'Secure, fast web software, ready for multiple sites and users.'], ['Simple interfaces', 'Clear screens to use on computer, tablet and smartphone.'], ['Mobile apps', 'Apps and web apps for field staff and end customers.'], ['Integrations and APIs', 'SdI e-invoicing, payments, business software, e-commerce and external services.'], ['Maintenance', 'Ongoing evolution, monitoring and support.']],
      meta: 'Custom projects: business software, web platforms and apps built around your processes and connected to invoicing, payments and existing systems.',
    },
  },
];

export const serviceByKey = (k: string) => {
  const s = SERVICES.find((x) => x.key === k);
  if (!s) throw new Error(`Unknown service ${k}`);
  return s;
};

/** Short labels used in the footer, as in the mockup */
export const SERVICE_FOOTER: Record<Lang, Record<string, string>> = {
  it: { 'intelligenza-artificiale': 'Intelligenza artificiale', 'cloud-computing': 'Cloud AWS', blockchain: 'Blockchain e Web3', cybersecurity: 'Cybersecurity', 'sviluppo-applicazioni-web': 'Progetti su misura' },
  en: { 'intelligenza-artificiale': 'Artificial intelligence', 'cloud-computing': 'AWS cloud', blockchain: 'Blockchain and Web3', cybersecurity: 'Cybersecurity', 'sviluppo-applicazioni-web': 'Custom projects' },
};
