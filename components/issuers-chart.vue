<template>
	<div class="stacked-bar">
		<div v-for="issue in issuers" class="bar issuer" v-bind:class="issue.class" v-bind:style="{ width: issue.percent +'%'}">{{issue.name}}</br><div class="percent">{{issue.percent}}%</div></div>
	</div>
</template>

<script>
	module.exports = {         
		data(){
			return{}            
		},
		props: {
			portfolio: Object
		},
		computed:{
		  issuers:function(){
		  
		  let issuersMap =new Map();
		  this.portfolio.etfs.forEach(row => {
	
		    var issuer = issuersMap.get(row.issuer);
			var name = row.issuer;
			if(issuer == undefined){
				issuer = {};
				issuer.amount = 0;
				issuersMap.set(name, issuer);
			}
			issuer.name = name;
			issuer.class = row.issuerClass;
			issuer.amount += row.amount;
			issuer.percent = Math.round(( issuer.amount / this.portfolio.totalAmount) *100);
			});
			

			var issuers = [];
			for (var issuerValue of issuersMap.values()) {
				issuers.push(issuerValue);
			}

			return issuers;
			}
		}
	}
</script>

