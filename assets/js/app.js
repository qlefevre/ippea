// Create our number formatter.
const currencyformatter = new Intl.NumberFormat('fr-FR', {
	style : 'currency',
	currency : 'EUR',
	useGrouping : false
});

var ETF_CACHE = undefined;
var NAME_CACHE =undefined;

/*
 * Extrait les lignes du PEA
 * 
 * @param string pData La chaîne contenant les ETFs à extraire 
 * @return array Un tableau contenant le portefeuille d'ETFs
 */
function extractLines(pData) {
	
	// Suppression des espaces multiples
	let sanitizeData = pData.replace(/\s+/g, ' ');
	// On remplace les virgules par des points
	sanitizeData = sanitizeData.replace(/,/g, '.');
	// Boursorama type compte : on supprime les 'AV'
	//sanitizeData = sanitizeData.replace('NOTIFICATION AV','AV').replace(/% AV/g, '% ');
	// On garde les nombres et les lettres
	sanitizeData = sanitizeData.replace(/[^0-9A-Z. %]/g, '');
	
	// On découpe selon le caractère %
	let rawBlocks = sanitizeData.split(' AV ');
	// On filtre les block ayant MSCI dans le nom
	//let etfBlocks = rawBlocks.filter(rawBlock => rawBlock.includes('MSCI'));

	let etfBlocks = rawBlocks.filter(rawBlock => !rawBlock.includes('LATENTES'));
	
	// On récupère les info pour chaque block
	let portfolio = etfBlocks.map(etfBlock => {
		//let line = etfBlock.replace(/([A-Z]{2})([0-9]{10})/g, '').trim();
		let name = etfBlock.match(/([A-Z0-9 ]*[A-Z]+)/g)[0].trim();
		let isin = extractIsin(etfBlock,name);
		let numbers = etfBlock.substring(etfBlock.lastIndexOf(isin)+ 12).replace(/[^0-9. ]/g, '').replace(/\s+/g, ' ').trim().split(' ');
		let netassetvalue = parseFloat(numbers[2]);
		let amount = parseFloat(parseFloat(parseFloat(numbers[0])*netassetvalue).toFixed(2));
		let issuer = extractIssuer(name,isin);
		let etf = {
			name : name,
			isin : isin,
			amount : amount,
			issuer : issuer,
			netassetvalue : netassetvalue,
		};
		return etf;
	});
	return portfolio;
}
Papa.parsePromise = function(url) {
	  return new Promise((resolve, reject) =>  {
	    Papa.parse(url, {download: true,complete:resolve, error:reject});
	  });
	};

function loadTickers(){
	return Papa.parsePromise("data/etf.csv")
	.then(function(results){
		let etfMap =new Map();
		let nameMap =new Map();
		for (let i = 1; i <  results.data.length; i++) {
			etfMap.set(results.data[i][1], {
					ticker : results.data[i][0],
					isin : results.data[i][1],
					name : results.data[i][2],
					issuer : results.data[i][3]
				});
			nameMap.set(results.data[i][2], results.data[i][1]);
		}
		ETF_CACHE = etfMap;
		NAME_CACHE = nameMap;
	});
	
}

function extractIsin(line,name){
	let isinArray = line.match(/([A-Z]{2})([0-9]{10})/g);
	let isin = undefined;
	// Le code isin est dans la ligne
	if (Array.isArray(isinArray) && isinArray.length) {
		isin = isinArray[0];
	}else{
		// On recherche le code isin à partir du nom
		isin = NAME_CACHE.get(name);
	}
	return isin;
}

function extractIssuer(name,isin){
	let etf = ETF_CACHE.get(isin);
	let issuer = etf == undefined ? 'issuer'  : etf.issuer;
	return issuer;
}

function computedRow(etf) {
	etf.zone = zone(etf.name);
	etf.zoneDescription = zoneDescription(etf.zone);
	etf.zoneClass = etf.zone.toLowerCase().replace('&','').split(' ').join('-');
	if(etf.isin != undefined){
		etfData = ETF_CACHE.get(etf.isin);
		if(etfData != undefined){
			etf.issuer = etfData.issuer;
			etf.issuerClass = etf.issuer.toLowerCase().replace(' ','-');
			etf.ticker = etfData.ticker;
			etf.tickerUrl = 'https://www.boursorama.com/bourse/trackers/cours/1rT'+etf.ticker+'/';
		}
	}
}

function sortEtfsArray(etfsArray){
	var reference_array = ['MSCI World', 'S&P 500', 'STOXX 600', 'TOPIX', 'MSCI AP','MSCI EM','Russel 2000','Small EMU'];
	etfsArray.sort(function(a, b) {
		return reference_array.indexOf(a.zone) - reference_array.indexOf(b.zone);
	});
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
	if (nameUpperCase.includes('SP500'))
		return 'S&P 500';
	if (nameUpperCase.includes('STOXX 600'))
		return 'STOXX 600';
	if (nameUpperCase.includes('TOPIX'))
		return 'TOPIX';
	if (nameUpperCase.includes('ASIP'))
		return 'MSCI AP';
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
	if (zone === 'S&P 500')
		return 'S&P 500';
	if (zone === 'STOXX 600')
		return 'STOXX Europe 600';
	if (zone === 'TOPIX')
		return 'Topix';
	if (zone === 'MSCI AP')
		return 'MSCI AC Asia Pacific';
	return 'Autre';
}


function createPortfolioFromArray(etfs){
	let computedEtfs = [];
	let totalAmount = 0;
	for (let i = 0; i < etfs.length; i++) {
		let etf = Object.assign({},etfs[i]);
		computedRow(etf);
		if(ETF_CACHE.get(etf.isin) != undefined){
			totalAmount += etf.amount;
			computedEtfs.push(etf);
		}
	}
	sortEtfsArray(computedEtfs);
	return {
		totalAmount: totalAmount ,
		etfs:computedEtfs
	};
}

function loadVue(){
new Vue(
		{
			el : '#app',

			data : {
				visible : false,
				tabPosition : 'left',
				selectedTab : 'main',
				target : [ {
					name : 'MSCI World',
					amount : 75
				}, {
					name : 'MSCI EM',
					amount : 10
				}, {
					name : 'Russel 2000',
					amount : 10
				}, {
					name : 'MSCI Small EMU',
					amount : 5
				} ],
				portfolio : [ {

					name : 'LYXOR MSCI WOR PEA',
					isin : 'FR0011869353',
					amount : 2400,
					netassetvalue : 0
				}, {
					name : 'AMUNDI PEA MSCI EM',
					isin : 'FR0013412020',
					amount : 600,
					netassetvalue : 0
				} ],
				inputData : ""

			},
			methods : {
				formatCurrency : function(value) {
					return currencyformatter.format(value);
				},
				importData : function(event) {
					this.portfolio = extractLines(this.inputData);
					this.selectedTab='main';
				}
			},
			computed : {
				computedTarget : function() {
					return createPortfolioFromArray(this.target);
				},
				computedPortfolio : function() {
					return createPortfolioFromArray(this.portfolio);
				}
			},
			components : {
				'portfolio-table' : httpVueLoader('components/portfolio-table.vue'),
				'issuers-chart' : httpVueLoader('components/issuers-chart.vue'),
				'etfs-chart' : httpVueLoader('components/etfs-chart.vue')
			}

		});
}

Promise.all([loadTickers()])
.then(function(values) {
	loadVue();
});

