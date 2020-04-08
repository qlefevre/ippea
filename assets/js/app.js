// Create our number formatter.
const currencyformatter = new Intl.NumberFormat('fr-FR', {
	style : 'currency',
	currency : 'EUR',
	useGrouping : false
});

// Extrait les lignes du PEA à partir des données d'entrées

function extractLines(data) {
	
	// Suppression des espaces multiples
	let sanitizeData = data.replace(/\s+/g, ' ');
	// On remplace les virgules par des points
	sanitizeData = sanitizeData.replace(/,/g, '.');
	// Boursorama type compte : on supprime les 'AV' 
	sanitizeData = sanitizeData.replace('NOTIFICATION AV','AV').replace(/% AV/g, '% ');
	// On garde les nombres et les lettres
	sanitizeData = sanitizeData.replace(/[^0-9A-Z. %]/g, '');
	
	// On découpe selon le caractère %
	let rawBlocks = sanitizeData.split('%');
	// On filtre les block ayant MSCI dans le nom
	let etfBlocks = rawBlocks.filter(rawBlock => rawBlock.includes('MSCI'));
	
	// On récupère les info pour chaque block
	let portfolio = etfBlocks.map(etfBlock => {
		let line = etfBlock.replace(/([A-Z]{2})([0-9]{10})/g, '').trim();
		let isin = extractIsin(etfBlock);
		let name = line.replace(/[^A-Z ]/g, '').trim(); 
		let numbers = line.replace(/[^0-9. ]/g, '').replace(/\s+/g, ' ').trim().split(' ');
		let amount = parseFloat((parseFloat(numbers[0])*parseFloat(numbers[2])).toFixed(2));
		let etf = {
			name : name,
			isin : isin,
			amount : amount
		};
		return etf;
	});
	return portfolio;
}

function extractIsin(line){
	let isinArray = line.match(/([A-Z]{2})([0-9]{10})/g);
	let isin = '';
	if (Array.isArray(isinArray) && isinArray.length) {
		isin = isinArray[0];
	}
	return isin;
}

function computedRow(etf) {
	etf.zone = zone(etf.name);
	etf.zoneDescription = zoneDescription(etf.zone);
	etf.zoneClass = etf.zone.toLowerCase().split(' ').join('-');
	etf.issuer = issuer(etf.name);
	etf.issuerClass = etf.issuer.toLowerCase();
}

function zone(name) {
	var nameUpperCase = name.toUpperCase();
	if (nameUpperCase.includes('MSCI WOR'))
		return 'MSCI World';
	if (nameUpperCase.includes('MSCI EM'))
		return 'MSCI EM';
	if (nameUpperCase.includes('RUSSEL 2000'))
		return 'Russel 2000';
	if (nameUpperCase.includes('SMALL EMU'))
		return 'Small EMU';
	return 'Autre';
}

function zoneDescription(zone) {
	if (zone === 'MSCI World')
		return 'MSCI World';
	if (zone === 'MSCI EM')
		return 'MSCI Emerging Markets';
	if (zone === 'Russel 2000')
		return 'Russel 2000';
	if (zone === 'Small EMU')
		return 'MSCI Small EMU';
	return 'Autre';
}

function issuer(name) {
	if (name.includes('LYXOR'))
		return 'Lyxor';
	if (name.includes('AMUNDI'))
		return 'Amundi';
	return 'Autre';
}


function createPortfolioFromArray(etfs){
	var computedEtfs = [];
	var totalAmount = 0;
	for (var i = 0; i < etfs.length; i++) {
		var etf = Object.assign({},etfs[i]);
		computedRow(etf);
		totalAmount += etf.amount;
		computedEtfs.push(etf);
		
	}
	return {
  	  totalAmount: totalAmount ,
	  etfs:computedEtfs};
}

