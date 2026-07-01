// ==========================================================================
// MATRICULAS 360 - JAVASCRIPT CONTROLLER & DATABASE
// ==========================================================================

// 1. DICCIONARIO DE TRADUCCIONES (5 Idiomas)
const TRANSLATIONS = {
  es: {
    title: "Identificador de Matrículas",
    subtitle: "Detección histórica, año de matriculación y tipo de vehículo",
    inputLabel: "Introduce la matrícula a mano:",
    inputPlaceholder: "Ej: 1234 BBB, M-1234-AB, C-9999-BZZ",
    viewLabel: "Vista de la Placa:",
    frontView: "Delantera (Blanca)",
    rearView: "Trasera (Taxis/VTC en azul)",
    engineLabel: "Motor (para distintivo DGT):",
    enginePetrol: "Gasolina / Híbrido Gas.",
    engineDiesel: "Diésel / Híbrido Diés. o Gas",
    engineHybrid: "Enchufable / Eléctrico R.E.",
    engineElectric: "Eléctrico Puro",
    quickExamples: "Ejemplos rápidos para probar:",
    resultTitle: "Detalles del Vehículo Identificado",
    yearLabel: "Año Estimado",
    monthLabel: "Mes Estimado",
    provinceLabel: "Provincia de Origen",
    typeLabel: "Tipo de Matrícula",
    badgeLabel: "Distintivo Ambiental DGT",
    badgeExplanation: "Explicación del Distintivo",
    approxNote: "Nota: Las fechas obtenidas por letras son estimaciones basadas en el ritmo de matriculaciones de la DGT. La fecha exacta e inequívoca del vehículo se encuentra únicamente en su Permiso de Circulación oficial.",
    
    // Tipos de placas
    typeStandard: "Matrícula Ordinaria (Turismo, Camión, Autobús, Motocicleta)",
    typeTaxiRear: "Taxi o VTC (Placa trasera azul obligatoria en España desde 2018)",
    typeMoped: "Ciclomotor (Vehículo de dos ruedas de hasta 50cc)",
    typeTrailer: "Remolque o Semirremolque de más de 750 kg",
    typeHistorical: "Vehículo Histórico (Clásico catalogado)",
    typeCD: "Cuerpo Diplomático (Coche oficial de Embajada)",
    typeCC: "Cuerpo Consular (Coche de Oficina Consular)",
    typeOI: "Organismos Internacionales (Representaciones extranjeras)",
    typeTA: "Personal Técnico-Administrativo de Embajada",
    typeStateGC: "Guardia Civil (Vehículo policial estatal)",
    typeStateCNP: "Cuerpo Nacional de Policía (Coche policial)",
    typeStateET: "Ejército de Tierra (Fuerzas Armadas)",
    typeStateEA: "Ejército del Aire y del Espacio (Fuerzas Armadas)",
    typeStateFN: "Armada Española / Fuerza Naval (Fuerzas Armadas)",
    typeStateE: "Ertzaintza (Policía Autonómica del País Vasco)",
    typeStateCME: "Mossos d'Esquadra (Policía Autonómica de Cataluña)",
    typeStateMF: "Policía Foral de Navarra (Foruzaingoa)",
    
    // Distintivos
    badgeA: "Sin Distintivo (Categoría A)",
    badgeB: "Etiqueta B (Amarilla)",
    badgeC: "Etiqueta C (Verde)",
    badgeECO: "Etiqueta ECO (Verde y Azul)",
    badge0: "Etiqueta Cero Emisiones (Azul)",
    
    badgeTextA: "Vehículos de gasolina matriculados antes de 2000 o diésel antes de 2006. Tienen restricciones estrictas en Zonas de Bajas Emisiones (ZBE).",
    badgeTextB: "Vehículos de gasolina matriculados entre 2000 y 2005, o diésel entre 2006 y 2013/2015. Acceso con ciertas limitaciones en ZBE.",
    badgeTextC: "Vehículos de gasolina desde 2006, o diésel desde 2014/2015. Libre acceso pero con algunas normas en episodios de alta contaminación.",
    badgeTextECO: "Híbridos no enchufables, microhíbridos o de gas (GLP/GNC) que cumplen las normas de emisiones. Bonificaciones de aparcamiento y libre acceso.",
    badgeTextZero: "Eléctricos puros, híbridos enchufables con >40km de autonomía o de pila de combustible. Máximas ventajas de movilidad y aparcamiento gratuito.",

    // Sistemas
    sysNational: "Sistema Nacional Moderno (desde Septiembre de 2000)",
    sysProvAlfanum: "Sistema Provincial Alfanumérico (1971 - 2000)",
    sysProvNum: "Sistema Provincial Numérico Clásico (1900 - 1971)",
    
    invalidPlate: "Matrícula no reconocida o formato incompleto.",
    unknown: "Desconocido",
    unknownProvince: "Código de provincia no identificado en España",
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  },
  en: {
    title: "License Plate Identifier",
    subtitle: "Historical detection, registration year and vehicle type",
    inputLabel: "Enter the plate manually:",
    inputPlaceholder: "E.g.: 1234 BBB, M-1234-AB, C-9999-BZZ",
    viewLabel: "Plate View:",
    frontView: "Front (White)",
    rearView: "Rear (Taxis/VTC in blue)",
    engineLabel: "Engine (for DGT eco-badge):",
    enginePetrol: "Petrol / Petrol Hybrid",
    engineDiesel: "Diesel / Diesel or Gas Hybrid",
    engineHybrid: "Plug-in Hybrid / R.E. Electric",
    engineElectric: "Pure Electric",
    quickExamples: "Quick examples to try:",
    resultTitle: "Identified Vehicle Details",
    yearLabel: "Estimated Year",
    monthLabel: "Estimated Month",
    provinceLabel: "Province of Origin",
    typeLabel: "Plate Type",
    badgeLabel: "DGT Environmental Badge",
    badgeExplanation: "Badge Explanation",
    approxNote: "Note: The registration dates obtained from letters are estimations based on historical DGT registration speed. The exact date is only found in the vehicle's official registration card.",
    
    typeStandard: "Standard Plate (Passenger Car, Truck, Bus, Motorcycle)",
    typeTaxiRear: "Taxi or VTC (Rear blue plate mandatory in Spain since 2018)",
    typeMoped: "Moped (Two-wheel vehicle up to 50cc)",
    typeTrailer: "Trailer or Semi-trailer of more than 750 kg",
    typeHistorical: "Historical Vehicle (Classified Classic)",
    typeCD: "Diplomatic Corps (Embassy official car)",
    typeCC: "Consular Corps (Consulate official car)",
    typeOI: "International Organizations (Foreign representations)",
    typeTA: "Embassy Technical-Administrative Staff",
    typeStateGC: "Civil Guard (State police vehicle)",
    typeStateCNP: "National Police Corps (Police car)",
    typeStateET: "Army (Armed Forces)",
    typeStateEA: "Air and Space Force (Armed Forces)",
    typeStateFN: "Spanish Navy / Naval Force (Armed Forces)",
    typeStateE: "Ertzaintza (Basque Country Regional Police)",
    typeStateCME: "Mossos d'Esquadra (Catalonia Regional Police)",
    typeStateMF: "Navarre Chartered Police (Foruzaingoa)",
    
    badgeA: "No Badge (Category A)",
    badgeB: "Label B (Yellow)",
    badgeC: "Label C (Green)",
    badgeECO: "Label ECO (Green & Blue)",
    badge0: "Label Zero Emissions (Blue)",
    
    badgeTextA: "Petrol vehicles registered before 2000 or diesel before 2006. Strict access restrictions in Low Emission Zones (ZBE).",
    badgeTextB: "Petrol vehicles registered between 2000 and 2005, or diesel between 2006 and 2013/2015. Access allowed with some limitations in ZBE.",
    badgeTextC: "Petrol vehicles since 2006, or diesel since 2014/2015. Free access but subject to rules during high pollution events.",
    badgeTextECO: "Non-plug-in hybrids, mild-hybrids or gas (LPG/CNG) vehicles. Parking discounts and unrestricted ZBE access.",
    badgeTextZero: "Pure electric, plug-in hybrids with >40km range, or fuel cell vehicles. Full mobility benefits and free parking.",

    sysNational: "Modern National System (since September 2000)",
    sysProvAlfanum: "Provincial Alphanumeric System (1971 - 2000)",
    sysProvNum: "Classic Provincial Numeric System (1900 - 1971)",
    
    invalidPlate: "Plate not recognized or incomplete format.",
    unknown: "Unknown",
    unknownProvince: "Province code not identified in Spain",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  ca: {
    title: "Identificador de Matrícules",
    subtitle: "Detecció històrica, any de matriculació i tipus de vehicle",
    inputLabel: "Introdueix la matrícula a mà:",
    inputPlaceholder: "Ex: 1234 BBB, M-1234-AB, C-9999-BZZ",
    viewLabel: "Vista de la Placa:",
    frontView: "Davantera (Blanca)",
    rearView: "Posteriore (Taxis/VTC en blau)",
    engineLabel: "Motor (per distintiu DGT):",
    enginePetrol: "Gasolina / Híbrid Gas.",
    engineDiesel: "Dièsel / Híbrid Diès. o Gas",
    engineHybrid: "Endollable / Elèctric R.E.",
    engineElectric: "Elèctric Pur",
    quickExamples: "Exemples ràpids per provar:",
    resultTitle: "Detalls del Vehicle Identificat",
    yearLabel: "Any Estimat",
    monthLabel: "Mes Estimat",
    provinceLabel: "Província d'Origen",
    typeLabel: "Tipus de Matrícula",
    badgeLabel: "Distintiu Ambiental DGT",
    badgeExplanation: "Explicació del Distintiu",
    approxNote: "Nota: Les dates obtingudes per lletres són estimacions basades en el ritme de matriculacions de la DGT. La data exacta es troba al permís de circulació oficial del vehicle.",
    
    typeStandard: "Matrícula Ordinària (Turisme, Camió, Autobús, Motocicleta)",
    typeTaxiRear: "Taxi o VTC (Placa posterior blava obligatòria a Espanya des de 2018)",
    typeMoped: "Ciclomotor (Vehicle de dues rodes de fins a 50cc)",
    typeTrailer: "Remolc o Semiremolc de més de 750 kg",
    typeHistorical: "Vehicle Històric (Clàssic catalogat)",
    typeCD: "Cos Diplomàtic (Cotxe oficial d'Ambaixada)",
    typeCC: "Cos Consular (Cotxe d'Oficina Consular)",
    typeOI: "Organitzacions Internacionals (Representacions estrangeres)",
    typeTA: "Personal Tècnic-Administratiu d'Ambaixada",
    typeStateGC: "Guàrdia Civil (Vehicle policial estatal)",
    typeStateCNP: "Cos Nacional de Policia (Cotxe policial)",
    typeStateET: "Exèrcit de Terra (Forces Armades)",
    typeStateEA: "Exèrcit de l'Aire i de l'Espai (Forces Armades)",
    typeStateFN: "Armada Espanyola / Força Naval (Forces Armades)",
    typeStateE: "Ertzaintza (Policia Autonòmica del País Basc)",
    typeStateCME: "Mossos d'Esquadra (Policia Autonòmica de Catalunya)",
    typeStateMF: "Policia Foral de Navarra (Foruzaingoa)",
    
    badgeA: "Sense Distintiu (Categoria A)",
    badgeB: "Etiqueta B (Groga)",
    badgeC: "Etiqueta C (Verda)",
    badgeECO: "Etiqueta ECO (Verda i Blava)",
    badge0: "Etiqueta Zero Emissions (Blava)",
    
    badgeTextA: "Vehicles de gasolina matriculats abans del 2000 o dièsel abans del 2006. Restriccions de moviment a les ZBE.",
    badgeTextB: "Vehicles de gasolina matriculats entre 2000 i 2005, o dièsel entre 2006 i 2013/2015. Accés regulat a les ZBE.",
    badgeTextC: "Vehicles de gasolina des de 2006, o dièsel des de 2014/2015. Lliure accés, excepte restriccions per contaminació.",
    badgeTextECO: "Híbrids no endollables, microhíbrids o de gas. Descomptes en zones de pagament i accés lliure a ZBE.",
    badgeTextZero: "Elèctrics purs o híbrids endollables amb autonomia >40km. Màxims avantatges de circulació i aparcament gratuït.",

    sysNational: "Sistema Nacional Modern (des de Setembre de 2000)",
    sysProvAlfanum: "Sistema Provincial Alfanumèric (1971 - 2000)",
    sysProvNum: "Sistema Provincial Numèric Clàssic (1900 - 1971)",
    
    invalidPlate: "Matrícula no reconeguda o format incomplet.",
    unknown: "Desconegut",
    unknownProvince: "Codi de província no identificat a Espanya",
    months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"]
  },
  gl: {
    title: "Identificador de Matrículas",
    subtitle: "Detección histórica, ano de matriculación e tipo de vehículo",
    inputLabel: "Introduce a matrícula a man:",
    inputPlaceholder: "Ex: 1234 BBB, M-1234-AB, C-9999-BZZ",
    viewLabel: "Vista da Placa:",
    frontView: "Dianteira (Branca)",
    rearView: "Traseira (Taxis/VTC en azul)",
    engineLabel: "Motor (para distintivo DGT):",
    enginePetrol: "Gasolina / Híbrido Gas.",
    engineDiesel: "Diésel / Híbrido Diés. o Gas",
    engineHybrid: "Enchufable / Eléctrico R.E.",
    engineElectric: "Eléctrico Puro",
    quickExamples: "Exemplos rápidos para probar:",
    resultTitle: "Detalles do Vehículo Identificado",
    yearLabel: "Ano Estimado",
    monthLabel: "Mes Estimat",
    provinceLabel: "Provincia de Orixe",
    typeLabel: "Tipo de Matrícula",
    badgeLabel: "Distintivo Ambiental DGT",
    badgeExplanation: "Explicación do Distintivo",
    approxNote: "Nota: As datas obtidas por letras son estimacións baseadas no ritmo de matriculacións da DGT. A data exacta atópase no permiso de circulación oficial do vehículo.",
    
    typeStandard: "Matrícula Ordinaria (Turismo, Camión, Autobús, Motocicleta)",
    typeTaxiRear: "Taxi ou VTC (Placa traseira azul obrigatoria en España desde 2018)",
    typeMoped: "Ciclomotor (Vehículo de dúas rodas de ata 50cc)",
    typeTrailer: "Remolque ou Semirremolque de máis de 750 kg",
    typeHistorical: "Vehículo Histórico (Clásico catalogado)",
    typeCD: "Corpo Diplomático (Coche oficial de Embaixada)",
    typeCC: "Corpo Consular (Coche de Oficina Consular)",
    typeOI: "Organismos Internacionais (Representacións estranxeiras)",
    typeTA: "Persoal Técnico-Administrativo de Embaixada",
    typeStateGC: "Garda Civil (Vehículo policial estatal)",
    typeStateCNP: "Corpo Nacional de Policía (Coche policial)",
    typeStateET: "Exército de Terra (Forzas Armadas)",
    typeStateEA: "Exército do Aire e do Espazo (Forzas Armadas)",
    typeStateFN: "Armada Española / Forza Naval (Forzas Armadas)",
    typeStateE: "Ertzaintza (Policía Autonómica de Euskadi)",
    typeStateCME: "Mossos d'Esquadra (Policía Autonómica de Cataluña)",
    typeStateMF: "Policía Foral de Navarra (Foruzaingoa)",
    
    badgeA: "Sen Distintivo (Categoría A)",
    badgeB: "Etiqueta B (Amarela)",
    badgeC: "Etiqueta C (Verde)",
    badgeECO: "Etiqueta ECO (Verde e Azul)",
    badge0: "Etiqueta Cero Emisións (Azul)",
    
    badgeTextA: "Vehículos de gasolina matriculados antes de 2000 ou diésel antes de 2006. Restricións de movemento nas ZBE.",
    badgeTextB: "Vehículos de gasolina matriculados entre 2000 e 2005, ou diésel entre 2006 e 2013/2015. Acceso regulado nas ZBE.",
    badgeTextC: "Vehículos de gasolina desde 2006, ou diésel desde 2014/2015. Libre acceso, salvo episodios de alta contaminación.",
    badgeTextECO: "Híbridos non enchufables, microhíbridos ou de gas. Descontos en zonas de aparcamento regulado e acceso ZBE.",
    badgeTextZero: "Eléctricos puros ou híbridos enchufables con autonomía >40km. Máximas vantaxes de mobilidade e aparcamento de balde.",

    sysNational: "Sistema Nacional Moderno (desde Setembro de 2000)",
    sysProvAlfanum: "Sistema Provincial Alfanumérico (1971 - 2000)",
    sysProvNum: "Sistema Provincial Numérico Clásico (1900 - 1971)",
    
    invalidPlate: "Matrícula non recoñecida ou formato incompleto.",
    unknown: "Descoñecido",
    unknownProvince: "Código de provincia non identificado en España",
    months: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"]
  },
  eu: {
    title: "Matrikula Identifikatzailea",
    subtitle: "Detekzio historikoa, matrikulazio urtea eta ibilgailu mota",
    inputLabel: "Idatzi matrikula eskuz:",
    inputPlaceholder: "Adib: 1234 BBB, M-1234-AB, C-9999-BZZ",
    viewLabel: "Plakaren Ikuspegia:",
    frontView: "Aurrekoa (Zuria)",
    rearView: "Atzekoa (Taxi/VTC urdina)",
    engineLabel: "Motorra (DGT ingurumen-ikurrerako):",
    enginePetrol: "Gasolina / Gasolina Hibridoa",
    engineDiesel: "Diésela / Diésel edo Gas Hibridoa",
    engineHybrid: "Entxufagarria / R.E. Elektrikoa",
    engineElectric: "Elektriko Garbia",
    quickExamples: "Adibide azkarrak probatzeko:",
    resultTitle: "Identifikatutako Ibilgailuaren Xehetasunak",
    yearLabel: "Estimatutako Urtea",
    monthLabel: "Estimatutako Hilabetea",
    provinceLabel: "Jatorrizko Probintzia",
    typeLabel: "Matrikula Mota",
    badgeLabel: "DGT Ingurumen Ikurra",
    badgeExplanation: "Ikurraren Azalpena",
    approxNote: "Oharra: Letren bidez lortutako matrikulazio datak DGTren matrikulazio erritmoan oinarritutako estimazioak dira. Data zehatza ibilgailuaren Zirkulazio Baimen ofizialean bakarrik dago.",
    
    typeStandard: "Matrikula Arrunta (Turismoa, Kamioia, Autobusa, Motozikleta)",
    typeTaxiRear: "Taxia edo VTC (Atzeko plaka urdina nahitaezkoa Espainian 2018tik)",
    typeMoped: "Ziklomotorea (50cc arteko bi gurpileko ibilgailua)",
    typeTrailer: "750 kg-tik gorako atoi edo erdi-atoia",
    typeHistorical: "Ibilgailu Historikoa (Klasiko katalogatua)",
    typeCD: "Kide Diplomatikoa (Enbaxadako auto ofiziala)",
    typeCC: "Kontsuletako Kidea (Kontsuletxeko auto ofiziala)",
    typeOI: "Nazioarteko Erakundeak (Atzerriko ordezkariak)",
    typeTA: "Enbaxadako Langile Tekniko-Administratiboa",
    typeStateGC: "Guardia Zibila (Estatuko polizia ibilgailua)",
    typeStateCNP: "Polizia Nazionala (Polizia autoa)",
    typeStateET: "Lurreko Armada (Armada)",
    typeStateEA: "Aire eta Espazioko Armada (Armada)",
    typeStateFN: "Itsas Armada (Armada)",
    typeStateE: "Ertzaintza (Euskal Autonomia Erkidegoko Polizia)",
    typeStateCME: "Mossos d'Esquadra (Kataluniako Polizia)",
    typeStateMF: "Nafarroako Foruzaingoa",
    
    badgeA: "Ikurrik Gabea (A Kategoria)",
    badgeB: "B Ikurra (Horia)",
    badgeC: "C Ikurra (Berdea)",
    badgeECO: "ECO Ikurra (Berdea eta Urdina)",
    badge0: "Zero Igorpen Ikurra (Urdina)",
    
    badgeTextA: "2000 baino lehen matrikulatutako gasolina-autoak edo 2006 baino lehenagoko diesel-autoak. Murrizketa handiak Emisio Baxuko Eremuetan (EBE/ZBE).",
    badgeTextB: "2000 eta 2005 arteko gasolina-autoak, edo 2006 eta 2013/2015 arteko diesel-autoak. Sarrera mugatua EBEetan.",
    badgeTextC: "2006tik aurrerako gasolina-autoak, edo 2014/2015etik aurrerako diesel-autoak. Sarrera librea, kutsadura handiko egunetan izan ezik.",
    badgeTextECO: "Hibrido ez-entxufagarriak, microhíbridoak edo gas-ibilgailuak. Aparkatzeko deskontuak eta sarrera librea ZBEetan.",
    badgeTextZero: "Elektriko garbiak, >40km-ko autonomia duten hibrido entxufagarriak. Mugikortasun abantaila guztiak eta doako aparkalekua.",

    sysNational: "Matrikulazio Sistema Nazional Modernoa (2000ko irailetik)",
    sysProvAlfanum: "Probintzia Matrikulazio Sistema Alfanumerikoa (1971 - 2000)",
    sysProvNum: "Probintzia Matrikulazio Sistema Klasiko Numerikoa (1900 - 1971)",
    
    invalidPlate: "Matrikula ezezaguna edo formatu osatugabea.",
    unknown: "Ezezaguna",
    unknownProvince: "Espainiako probintzia kodea ez da identifikatu",
    months: ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua"]
  }
};

// 2. CONSONANTES PERMITIDAS SISTEMA MODERN
const CONSONANTS = ['B','C','D','F','G','H','J','K','L','M','N','P','R','S','T','V','W','X','Y','Z'];

// 3. HITOS MODERNOS (Diciembre de cada año / inicio)
// JS Date meses son 0-indexed (8=Sep, 11=Dic)
const MODERN_MILESTONES = [
  { letters: 'BBB', date: new Date(2000, 8, 18) },  // 18 Sep 2000 (Inicio)
  { letters: 'BDR', date: new Date(2000, 11, 31) }, // Fin 2000
  { letters: 'BZZ', date: new Date(2001, 11, 31) }, // Fin 2001
  { letters: 'CLK', date: new Date(2002, 11, 31) },
  { letters: 'CZX', date: new Date(2003, 11, 31) },
  { letters: 'DKK', date: new Date(2004, 11, 31) },
  { letters: 'DXX', date: new Date(2005, 11, 31) },
  { letters: 'FBV', date: new Date(2006, 11, 31) },
  { letters: 'FNZ', date: new Date(2007, 11, 31) },
  { letters: 'GCT', date: new Date(2008, 11, 31) },
  { letters: 'GSB', date: new Date(2009, 11, 31) },
  { letters: 'GZZ', date: new Date(2010, 11, 31) },
  { letters: 'HJW', date: new Date(2011, 11, 31) },
  { letters: 'HNX', date: new Date(2012, 11, 31) },
  { letters: 'HVB', date: new Date(2013, 11, 31) },
  { letters: 'JDC', date: new Date(2014, 11, 31) },
  { letters: 'JMF', date: new Date(2015, 11, 31) },
  { letters: 'JWZ', date: new Date(2016, 11, 31) },
  { letters: 'KGN', date: new Date(2017, 11, 31) },
  { letters: 'KSS', date: new Date(2018, 11, 31) },
  { letters: 'LDR', date: new Date(2019, 11, 31) },
  { letters: 'LMC', date: new Date(2020, 11, 31) },
  { letters: 'LVV', date: new Date(2021, 11, 31) },
  { letters: 'MDD', date: new Date(2022, 11, 31) },
  { letters: 'MMN', date: new Date(2023, 11, 31) },
  { letters: 'MXP', date: new Date(2024, 11, 31) },
  { letters: 'NJS', date: new Date(2025, 11, 31) },
  { letters: 'NNT', date: new Date(2026, 4, 31) }  // Mayo 2026 (Estimado/Último dato)
];

// 4. DICCIONARIO DE PROVINCIAS
const PROVINCES = {
  'A':   { name: 'Alicante', finalLetters: 'EN', max1971: 150000 },
  'AB':  { name: 'Albacete', finalLetters: 'V',  max1971: 45000 },
  'AL':  { name: 'Almería', finalLetters: 'AK', max1971: 40000 },
  'AV':  { name: 'Ávila', finalLetters: 'I',  max1971: 20000 },
  'B':   { name: 'Barcelona', finalLetters: 'XG', max1971: 960000 },
  'BA':  { name: 'Badajoz', finalLetters: 'AG', max1971: 65000 },
  'BI':  { name: 'Vizcaya', finalLetters: 'BC', max1971: 180000 },
  'BU':  { name: 'Burgos', finalLetters: 'Z',  max1971: 50000 },
  'C':   { name: 'La Coruña', finalLetters: 'CK', max1971: 120000 },
  'CA':  { name: 'Cádiz', finalLetters: 'BT', max1971: 110000 },
  'CC':  { name: 'Cáceres', finalLetters: 'U',  max1971: 40000 },
  'CE':  { name: 'Ceuta', finalLetters: 'F',  max1971: 15000 },
  'CO':  { name: 'Córdoba', finalLetters: 'AY', max1971: 75000 },
  'CR':  { name: 'Ciudad Real', finalLetters: 'Z',  max1971: 55000 },
  'CS':  { name: 'Castellón', finalLetters: 'AW', max1971: 55000 },
  'CU':  { name: 'Cuenca', finalLetters: 'K',  max1971: 25000 },
  'GE':  { name: 'Girona (GE)', finalLetters: 'BT', max1971: 65000 },
  'GI':  { name: 'Girona (GI)', finalLetters: 'BT', max1971: 65000 },
  'GC':  { name: 'Las Palmas', finalLetters: 'CL', max1971: 110000 },
  'GR':  { name: 'Granada', finalLetters: 'AZ', max1971: 70000 },
  'GU':  { name: 'Guadalajara', finalLetters: 'J',  max1971: 20000 },
  'H':   { name: 'Huelva', finalLetters: 'AB', max1971: 40000 },
  'HU':  { name: 'Huesca', finalLetters: 'P',  max1971: 30000 },
  'IB':  { name: 'Islas Baleares', finalLetters: 'DT', max1971: 150000 },
  'J':   { name: 'Jaén', finalLetters: 'AG', max1971: 60000 },
  'L':   { name: 'Lleida', finalLetters: 'AJ', max1971: 55000 },
  'LE':  { name: 'León', finalLetters: 'AJ', max1971: 60000 },
  'LO':  { name: 'La Rioja', finalLetters: 'V',  max1971: 35000 },
  'LU':  { name: 'Lugo', finalLetters: 'X',  max1971: 35000 },
  'M':   { name: 'Madrid', finalLetters: 'ZX', max1971: 960985 },
  'MA':  { name: 'Málaga', finalLetters: 'CX', max1971: 140000 },
  'ML':  { name: 'Melilla', finalLetters: 'F',  max1971: 15000 },
  'MU':  { name: 'Murcia', finalLetters: 'BX', max1971: 110000 },
  'NA':  { name: 'Navarra', finalLetters: 'BD', max1971: 85000 },
  'O':   { name: 'Asturias', finalLetters: 'AX', max1971: 130000 },
  'OR':  { name: 'Ourense (OR)', finalLetters: 'K',  max1971: 35000 },
  'OU':  { name: 'Ourense (OU)', finalLetters: 'K',  max1971: 35000 },
  'P':   { name: 'Palencia', finalLetters: 'J',  max1971: 25000 },
  'PM':  { name: 'Baleares (PM)', finalLetters: 'DT', max1971: 150000 },
  'PO':  { name: 'Pontevedra', finalLetters: 'BC', max1971: 100000 },
  'S':   { name: 'Cantabria', finalLetters: 'AH', max1971: 75000 },
  'SA':  { name: 'Salamanca', finalLetters: 'P',  max1971: 45000 },
  'SE':  { name: 'Sevilla', finalLetters: 'DL', max1971: 200000 },
  'SG':  { name: 'Segovia', finalLetters: 'H',  max1971: 25000 },
  'SO':  { name: 'Soria', finalLetters: 'E',  max1971: 12000 },
  'SS':  { name: 'Guipúzcoa', finalLetters: 'BK', max1971: 110000 },
  'T':   { name: 'Tarragona', finalLetters: 'AX', max1971: 60000 },
  'TE':  { name: 'Teruel', finalLetters: 'F',  max1971: 18000 },
  'TF':  { name: 'Santa Cruz de Tenerife', finalLetters: 'CE', max1971: 100000 },
  'TO':  { name: 'Toledo', finalLetters: 'T',  max1971: 55000 },
  'V':   { name: 'Valencia', finalLetters: 'HV', max1971: 350000 },
  'VA':  { name: 'Valladolid', finalLetters: 'AJ', max1971: 75000 },
  'VI':  { name: 'Álava / Vitoria', finalLetters: 'Y',  max1971: 30000 },
  'ZA':  { name: 'Zamora', finalLetters: 'H',  max1971: 25000 },
  'Z':   { name: 'Zaragoza', finalLetters: 'AP', max1971: 120000 }
};

// 5. VARIABLES DE ESTADO
let currentLang = 'es';
let plateView = 'front'; // 'front' | 'rear'
let currentEngine = 'petrol'; // 'petrol' | 'diesel' | 'hybrid' | 'electric'

// 6. FUNCIONES DE CÁLCULO ALFABÉTICO

// Convertir 3 letras modernas en un índice entero (0 a 7999)
function getModernLettersIndex(lettersStr) {
  if (lettersStr.length !== 3) return -1;
  const l1 = lettersStr[0].toUpperCase();
  const l2 = lettersStr[1].toUpperCase();
  const l3 = lettersStr[2].toUpperCase();
  
  const i1 = CONSONANTS.indexOf(l1);
  const i2 = CONSONANTS.indexOf(l2);
  const i3 = CONSONANTS.indexOf(l3);
  
  if (i1 === -1 || i2 === -1 || i3 === -1) return -1;
  return i1 * 400 + i2 * 20 + i3;
}

// Convertir letras del sufijo provincial (A-Z sin Ñ ni Q) en un índice (0 a 649)
const PROV_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W','X','Y','Z'];
function getProvincialLettersIndex(lettersStr) {
  if (!lettersStr) return 0;
  const str = lettersStr.toUpperCase();
  if (str.length === 1) {
    return PROV_LETTERS.indexOf(str[0]);
  } else if (str.length === 2) {
    const i1 = PROV_LETTERS.indexOf(str[0]);
    const i2 = PROV_LETTERS.indexOf(str[1]);
    if (i1 === -1 || i2 === -1) return 0;
    return 25 + i1 * 25 + i2;
  }
  return 0;
}

// 7. FUNCIONES DE ESTIMACIÓN DE AÑO

// Sistema Nacional (0000 BBB)
function estimateModernYear(letters) {
  const idx = getModernLettersIndex(letters);
  if (idx === -1) return null;
  
  // Buscar el hito correspondiente
  let startMilestone = MODERN_MILESTONES[0];
  let startIdx = 0; // BBB
  
  let endMilestone = MODERN_MILESTONES[0];
  let endIdx = 0;
  
  if (idx === 0) {
    return { year: 2000, month: 8 }; // Septiembre 2000
  }
  
  for (let i = 1; i < MODERN_MILESTONES.length; i++) {
    const mLetters = MODERN_MILESTONES[i].letters;
    const mIdx = getModernLettersIndex(mLetters);
    if (idx <= mIdx) {
      endMilestone = MODERN_MILESTONES[i];
      endIdx = mIdx;
      startMilestone = MODERN_MILESTONES[i - 1];
      startIdx = getModernLettersIndex(startMilestone.letters);
      break;
    }
  }
  
  // Si no se encuentra hito (ej: NKF o posterior a finales de 2026), usar el último
  if (endIdx === 0) {
    endMilestone = MODERN_MILESTONES[MODERN_MILESTONES.length - 1];
    endIdx = getModernLettersIndex(endMilestone.letters);
    startMilestone = MODERN_MILESTONES[MODERN_MILESTONES.length - 2];
    startIdx = getModernLettersIndex(startMilestone.letters);
  }
  
  // Interpolación lineal de tiempo
  const tStart = startMilestone.date.getTime();
  const tEnd = endMilestone.date.getTime();
  const ratio = (idx - startIdx) / (endIdx - startIdx);
  const estimatedTime = tStart + ratio * (tEnd - tStart);
  
  const estimatedDate = new Date(estimatedTime);
  return {
    year: estimatedDate.getFullYear(),
    month: estimatedDate.getMonth()
  };
}

// Sistema Provincial Alfanumérico (M-1234-AB)
function estimateProvincialAlfanumYear(provinceCode, suffix) {
  const startMs = new Date(1971, 9, 1).getTime(); // Octubre 1971
  const endMs = new Date(2000, 8, 18).getTime();  // 18 Septiembre 2000
  
  const prov = PROVINCES[provinceCode.toUpperCase()];
  const finalLetters = prov ? prov.finalLetters : 'Z';
  
  const idx = getProvincialLettersIndex(suffix);
  const maxIdx = getProvincialLettersIndex(finalLetters);
  
  if (idx > maxIdx) {
    // Si la letra es posterior a la última alcanzada, es un valor erróneo o un caso excepcional, limitar al final del sistema
    return { year: 2000, month: 8 };
  }
  
  // Interpolación lineal de ritmo provincial
  const ratio = maxIdx > 0 ? idx / maxIdx : 0.5;
  // Añadir un leve factor de aceleración del mercado (el parque creció más rápido en los 90s)
  const correctedRatio = Math.pow(ratio, 1.15); // Acelera un poco hacia el final
  
  const estimatedTime = startMs + correctedRatio * (endMs - startMs);
  const estimatedDate = new Date(estimatedTime);
  
  return {
    year: estimatedDate.getFullYear(),
    month: estimatedDate.getMonth()
  };
}

// Sistema Provincial Numérico (M-123456)
function estimateProvincialNumericYear(provinceCode, number) {
  const startMs = new Date(1900, 9, 31).getTime(); // Oct 1900
  const endMs = new Date(1971, 9, 1).getTime();   // Oct 1971
  
  const prov = PROVINCES[provinceCode.toUpperCase()];
  const maxNum = prov ? prov.max1971 : 100000;
  
  const ratio = Math.min(1, Math.max(0, number / maxNum));
  // Curva exponencial: las matriculaciones despegaron a partir de 1955-1960 (Seat 600)
  const correctedRatio = Math.pow(ratio, 0.45);
  
  const estimatedTime = startMs + correctedRatio * (endMs - startMs);
  const estimatedDate = new Date(estimatedTime);
  
  return {
    year: estimatedDate.getFullYear(),
    month: estimatedDate.getMonth()
  };
}

// 8. LÓGICA DE DISTINTIVOS AMBIENTALES DGT
function getDgtBadge(year, fuel) {
  if (!year) return { badge: 'none', label: 'badgeA', desc: 'badgeTextA' };
  
  // Eléctrico Puro -> Siempre Cero Emisiones
  if (fuel === 'electric') {
    return { badge: 'badge-0', label: 'badge0', desc: 'badgeTextZero' };
  }
  
  // Enchufable (Híbridos enchufables con autonomía o eléctricos R.E.) -> ECO o Cero
  if (fuel === 'hybrid') {
    return { badge: 'badge-0', label: 'badge0', desc: 'badgeTextZero' };
  }
  
  // Si el coche es Gasolina (o Híbrido Gasolina estándar)
  if (fuel === 'petrol') {
    if (year < 2000) {
      return { badge: 'none', label: 'badgeA', desc: 'badgeTextA' };
    } else if (year >= 2000 && year <= 2005) {
      return { badge: 'badge-b', label: 'badgeB', desc: 'badgeTextB' };
    } else {
      return { badge: 'badge-c', label: 'badgeC', desc: 'badgeTextC' };
    }
  }
  
  // Si el coche es Diésel (o Híbrido Diésel estándar)
  if (fuel === 'diesel') {
    if (year < 2006) {
      return { badge: 'none', label: 'badgeA', desc: 'badgeTextA' };
    } else if (year >= 2006 && year <= 2013) {
      return { badge: 'badge-b', label: 'badgeB', desc: 'badgeTextB' };
    } else {
      return { badge: 'badge-c', label: 'badgeC', desc: 'badgeTextC' };
    }
  }
  
  return { badge: 'none', label: 'badgeA', desc: 'badgeTextA' };
}

// 9. PARSEADOR SINTÁCTICO DE MATRÍCULAS
function parsePlate(rawInput) {
  // Limpiar caracteres
  const text = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (text.length < 2) {
    return { valid: false, messageKey: 'invalidPlate' };
  }
  
  // A. SISTEMA NACIONAL MODERNO (1234 BBB)
  // Formato: 4 números + 3 consonantes
  const rxModern = /^(\d{4})([BCDFGHJKLMNPRSTVWXYZ]{3})$/;
  if (rxModern.test(text)) {
    const match = text.match(rxModern);
    const digits = match[1];
    const letters = match[2];
    const est = estimateModernYear(letters);
    
    return {
      valid: true,
      format: 'MODERN_STANDARD',
      displayPlate: `${digits} ${letters}`,
      raw: text,
      systemKey: 'sysNational',
      year: est ? est.year : null,
      month: est ? est.month : null,
      province: null,
      typeKey: 'typeStandard'
    };
  }
  
  // B. CICLOMOTORES MODERNOS (C 1234 BBB)
  const rxMoped = /^C(\d{4})([BCDFGHJKLMNPRSTVWXYZ]{3})$/;
  if (rxMoped.test(text)) {
    const match = text.match(rxMoped);
    const digits = match[1];
    const letters = match[2];
    const est = estimateModernYear(letters);
    
    return {
      valid: true,
      format: 'MOPED',
      displayPlate: `C ${digits} ${letters}`,
      raw: text,
      systemKey: 'sysNational',
      year: est ? est.year : null,
      month: est ? est.month : null,
      province: null,
      typeKey: 'typeMoped'
    };
  }
  
  // C. REMOLQUES MODERNOS (R 1234 BBB)
  const rxTrailer = /^R(\d{4})([BCDFGHJKLMNPRSTVWXYZ]{3})$/;
  if (rxTrailer.test(text)) {
    const match = text.match(rxTrailer);
    const digits = match[1];
    const letters = match[2];
    const est = estimateModernYear(letters);
    
    return {
      valid: true,
      format: 'TRAILER',
      displayPlate: `R ${digits} ${letters}`,
      raw: text,
      systemKey: 'sysNational',
      year: est ? est.year : null,
      month: est ? est.month : null,
      province: null,
      typeKey: 'typeTrailer'
    };
  }
  
  // D. HISTÓRICOS MODERNOS (H 1234 BBB)
  const rxHistorical = /^H(\d{4})([BCDFGHJKLMNPRSTVWXYZ]{3})$/;
  if (rxHistorical.test(text)) {
    const match = text.match(rxHistorical);
    const digits = match[1];
    const letters = match[2];
    const est = estimateModernYear(letters);
    
    return {
      valid: true,
      format: 'HISTORICAL',
      displayPlate: `H ${digits} ${letters}`,
      raw: text,
      systemKey: 'sysNational',
      year: est ? est.year : null,
      month: est ? est.month : null,
      province: null,
      typeKey: 'typeHistorical'
    };
  }
  
  // E. DIPLOMÁTICOS (CD 12 345, CC 12 345, OI 12 345, TA 12 345)
  const rxDiplomatic = /^(CD|CC|OI|TA)(\d{1,3})(\d{2,3})$/;
  if (rxDiplomatic.test(text)) {
    const match = text.match(rxDiplomatic);
    const prefix = match[1];
    const country = match[2];
    const serial = match[3];
    
    let typeKey = 'typeCD';
    if (prefix === 'CC') typeKey = 'typeCC';
    if (prefix === 'OI') typeKey = 'typeOI';
    if (prefix === 'TA') typeKey = 'typeTA';
    
    return {
      valid: true,
      format: `DIPLOMATIC_${prefix}`,
      displayPlate: `${prefix} ${country} ${serial}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2018, // Diplomáticas modernas
      month: 6,
      province: null,
      typeKey: typeKey
    };
  }
  
  // F. FUERZAS DEL ESTADO & POLICÍAS
  // PGC Guardia Civil
  const rxPGC = /^PGC(\d{4})([A-Z])$/;
  if (rxPGC.test(text)) {
    const match = text.match(rxPGC);
    return {
      valid: true,
      format: 'STATE_PGC',
      displayPlate: `PGC ${match[1]} ${match[2]}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2012,
      month: 6,
      province: null,
      typeKey: 'typeStateGC'
    };
  }
  
  // CNP Policía
  const rxCNP = /^CNP(\d{5,6})$/;
  if (rxCNP.test(text)) {
    return {
      valid: true,
      format: 'STATE_CNP',
      displayPlate: `CNP ${text.substring(3)}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2014,
      month: 2,
      province: null,
      typeKey: 'typeStateCNP'
    };
  }
  
  // Ejércitos ET, EA, FN
  const rxArmy = /^(ET|EA|FN)(\d{5,6})$/;
  if (rxArmy.test(text)) {
    const match = text.match(rxArmy);
    const prefix = match[1];
    const num = match[2];
    let typeKey = 'typeStateET';
    if (prefix === 'EA') typeKey = 'typeStateEA';
    if (prefix === 'FN') typeKey = 'typeStateFN';
    
    return {
      valid: true,
      format: `STATE_${prefix}`,
      displayPlate: `${prefix} ${num}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2008,
      month: 10,
      province: null,
      typeKey: typeKey
    };
  }
  
  // Autonómicas: Ertzaintza (E-1234), Mossos (CME-12345), Policía Foral (MF-1234)
  const rxErt = /^E(\d{4})$/;
  if (rxErt.test(text)) {
    return {
      valid: true,
      format: 'STATE_E',
      displayPlate: `E ${text.substring(1)}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2010,
      month: 3,
      province: null,
      typeKey: 'typeStateE'
    };
  }
  const rxCme = /^CME(\d{5})$/;
  if (rxCme.test(text)) {
    return {
      valid: true,
      format: 'STATE_CME',
      displayPlate: `CME ${text.substring(3)}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2011,
      month: 8,
      province: null,
      typeKey: 'typeStateCME'
    };
  }
  const rxMf = /^MF(\d{4})$/;
  if (rxMf.test(text)) {
    return {
      valid: true,
      format: 'STATE_MF',
      displayPlate: `MF ${text.substring(2)}`,
      raw: text,
      systemKey: 'sysNational',
      year: 2013,
      month: 0,
      province: null,
      typeKey: 'typeStateMF'
    };
  }
  
  // G. SISTEMA PROVINCIAL ALFANUMÉRICO (M-1234-AB)
  const rxProvAlfanum = /^([A-Z]{1,2})(\d{4})([A-Z]{1,2})$/;
  if (rxProvAlfanum.test(text)) {
    const match = text.match(rxProvAlfanum);
    const pCode = match[1];
    const digits = match[2];
    const suffix = match[3];
    
    if (PROVINCES[pCode]) {
      const est = estimateProvincialAlfanumYear(pCode, suffix);
      return {
        valid: true,
        format: 'PROVINCIAL_ALPHANUMERIC',
        displayPlate: `${pCode}-${digits}-${suffix}`,
        raw: text,
        systemKey: 'sysProvAlfanum',
        year: est.year,
        month: est.month,
        province: PROVINCES[pCode].name,
        typeKey: 'typeStandard'
      };
    }
  }
  
  // H. SISTEMA PROVINCIAL NUMÉRICO CLÁSICO (M-123456)
  const rxProvNum = /^([A-Z]{1,2})(\d{1,6})$/;
  if (rxProvNum.test(text)) {
    const match = text.match(rxProvNum);
    const pCode = match[1];
    const digits = match[2];
    
    if (PROVINCES[pCode]) {
      const est = estimateProvincialNumericYear(pCode, parseInt(digits, 10));
      return {
        valid: true,
        format: 'PROVINCIAL_NUMERIC',
        displayPlate: `${pCode}-${digits}`,
        raw: text,
        systemKey: 'sysProvNum',
        year: est.year,
        month: est.month,
        province: PROVINCES[pCode].name,
        typeKey: 'typeStandard'
      };
    }
  }
  
  return { valid: false, messageKey: 'invalidPlate' };
}

// 10. CONTROLADOR Y GESTOR DE EVENTOS DOM
function translateInterface() {
  const dict = TRANSLATIONS[currentLang];
  
  // Traducir todos los elementos con [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  
  // Traducir placeholders de inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });
  
  // Actualizar análisis
  triggerAnalysis();
}

function triggerAnalysis() {
  const plateInput = document.getElementById('plateInput');
  const rawValue = plateInput.value;
  const result = parsePlate(rawValue);
  
  const dict = TRANSLATIONS[currentLang];
  const resultsCard = document.getElementById('resultsCard');
  const errorMsg = document.getElementById('errorMsg');
  
  if (!rawValue.trim()) {
    resultsCard.classList.remove('active');
    errorMsg.classList.remove('show');
    renderPlaceholderPlate();
    return;
  }
  
  if (!result.valid) {
    resultsCard.classList.remove('active');
    errorMsg.textContent = dict[result.messageKey] || result.messageKey;
    errorMsg.classList.add('show');
    renderErrorPlate(rawValue);
    return;
  }
  
  // Ocultar error
  errorMsg.classList.remove('show');
  
  // Activar contenedor de resultados
  resultsCard.classList.add('active');
  
  // 1. Renderizar Placa Físicamente
  renderPhysicalPlate(result);
  
  // 2. Rellenar Datos en los campos de Resultados
  document.getElementById('resYear').textContent = result.year ? result.year : '--';
  document.getElementById('resMonth').textContent = result.month !== null ? dict.months[result.month] : '--';
  document.getElementById('resProvince').textContent = result.province ? result.province : '--';
  document.getElementById('resType').textContent = dict[result.typeKey] || dict.unknown;
  
  // Calcular Distintivo Ambiental
  let activeFuel = currentEngine;
  const badgeInfo = getDgtBadge(result.year, activeFuel);
  
  const badgeBadge = document.getElementById('badgeBadge');
  const badgeTitle = document.getElementById('badgeTitle');
  const badgeDesc = document.getElementById('badgeDesc');
  
  // Limpiar clases previas del distintivo
  badgeBadge.className = 'badge-circle none';
  
  if (badgeInfo.badge === 'none') {
    badgeBadge.classList.add('none');
    badgeBadge.textContent = 'A';
  } else {
    badgeBadge.classList.add(badgeInfo.badge);
    if (badgeInfo.badge === 'badge-b') badgeBadge.textContent = 'B';
    if (badgeInfo.badge === 'badge-c') badgeBadge.textContent = 'C';
    if (badgeInfo.badge === 'badge-0') badgeBadge.textContent = '0';
    if (badgeInfo.badge === 'badge-eco') badgeBadge.textContent = 'ECO';
  }
  
  badgeTitle.textContent = dict[badgeInfo.label];
  badgeDesc.textContent = dict[badgeInfo.desc];
}

// Renderizados de la Placa
function renderPlaceholderPlate() {
  const plateContainer = document.getElementById('plateContainer');
  plateContainer.className = 'plate-body standard';
  plateContainer.innerHTML = `
    <div class="euroband">
      <div class="stars">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        <span>★</span><span>★</span>
      </div>
      <span class="country">E</span>
    </div>
    <div class="plate-number font-plate">0000 BBB</div>
  `;
}

function renderErrorPlate(text) {
  const plateContainer = document.getElementById('plateContainer');
  plateContainer.className = 'plate-body error';
  const cleanVal = text.toUpperCase().substring(0, 12);
  plateContainer.innerHTML = `
    <div class="plate-number font-plate text-error">${cleanVal}</div>
  `;
}

function renderPhysicalPlate(result) {
  const plateContainer = document.getElementById('plateContainer');
  plateContainer.className = 'plate-body';
  
  let layoutHtml = '';
  
  if (result.format === 'MODERN_STANDARD') {
    const isTaxiVtc = document.getElementById('taxiVtcToggle').checked;
    
    if (isTaxiVtc && plateView === 'rear') {
      plateContainer.classList.add('taxi-blue');
    } else {
      plateContainer.classList.add('standard');
    }
    
    layoutHtml = `
      <div class="euroband">
        <div class="stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span>
        </div>
        <span class="country">E</span>
      </div>
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  } 
  else if (result.format === 'MOPED') {
    plateContainer.classList.add('moped-yellow');
    layoutHtml = `
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  else if (result.format === 'TRAILER') {
    plateContainer.classList.add('trailer-red');
    layoutHtml = `
      <div class="euroband">
        <div class="stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span>
        </div>
        <span class="country">E</span>
      </div>
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  else if (result.format === 'HISTORICAL') {
    plateContainer.classList.add('standard');
    layoutHtml = `
      <div class="euroband">
        <div class="stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span>
        </div>
        <span class="country">E</span>
      </div>
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  else if (result.format.startsWith('DIPLOMATIC_')) {
    const prefix = result.format.split('_')[1];
    
    if (prefix === 'CD') {
      plateContainer.classList.add('diplo-cd-red');
    } else if (prefix === 'CC') {
      plateContainer.classList.add('diplo-cc-green');
    } else if (prefix === 'TA') {
      plateContainer.classList.add('diplo-ta-yellow');
    } else if (prefix === 'OI') {
      plateContainer.classList.add('diplo-oi-blue');
    }
    
    layoutHtml = `
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  else if (result.format.startsWith('STATE_')) {
    plateContainer.classList.add('standard');
    layoutHtml = `
      <div class="euroband">
        <div class="stars">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          <span>★</span><span>★</span>
        </div>
        <span class="country">E</span>
      </div>
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  else if (result.format === 'PROVINCIAL_ALPHANUMERIC' || result.format === 'PROVINCIAL_NUMERIC') {
    plateContainer.classList.add('provincial-classic');
    layoutHtml = `
      <div class="plate-number font-plate">${result.displayPlate}</div>
    `;
  }
  
  plateContainer.innerHTML = layoutHtml;
}

// INICIALIZACIÓN DE LA APLICACIÓN AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {
  // 1. Selector de Idioma
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.getAttribute('data-lang');
      translateInterface();
    });
  });
  
  // 2. Input de Matrícula
  const plateInput = document.getElementById('plateInput');
  plateInput.addEventListener('input', () => {
    triggerAnalysis();
  });
  
  // Botón Limpiar
  document.getElementById('clearBtn').addEventListener('click', () => {
    plateInput.value = '';
    triggerAnalysis();
    plateInput.focus();
  });
  
  // 3. Vista de Placa (Delantera / Trasera)
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      plateView = e.currentTarget.getAttribute('data-view');
      
      const taxiContainer = document.getElementById('taxiToggleContainer');
      if (plateView === 'rear') {
        taxiContainer.classList.add('show');
      } else {
        taxiContainer.classList.remove('show');
      }
      
      triggerAnalysis();
    });
  });
  
  // Checkbox de Taxi/VTC
  document.getElementById('taxiVtcToggle').addEventListener('change', () => {
    triggerAnalysis();
  });
  
  // 4. Selector de Motor
  document.querySelectorAll('.engine-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.engine-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentEngine = e.currentTarget.getAttribute('data-engine');
      triggerAnalysis();
    });
  });
  
  // 5. Clics en Ejemplos Rápidos
  document.querySelectorAll('.example-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      plateInput.value = e.target.getAttribute('data-plate');
      
      const forceTaxi = e.target.getAttribute('data-taxi') === 'true';
      const taxiCheckbox = document.getElementById('taxiVtcToggle');
      const taxiContainer = document.getElementById('taxiToggleContainer');
      
      if (forceTaxi) {
        document.querySelectorAll('.view-btn').forEach(b => {
          if (b.getAttribute('data-view') === 'rear') b.classList.add('active');
          else b.classList.remove('active');
        });
        plateView = 'rear';
        taxiCheckbox.checked = true;
        taxiContainer.classList.add('show');
      } else {
        document.querySelectorAll('.view-btn').forEach(b => {
          if (b.getAttribute('data-view') === 'front') b.classList.add('active');
          else b.classList.remove('active');
        });
        plateView = 'front';
        taxiCheckbox.checked = false;
        taxiContainer.classList.remove('show');
      }
      
      triggerAnalysis();
    });
  });
  
  translateInterface();
});
