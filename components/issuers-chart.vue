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
		  var issuers = [];
		  this.portfolio.etfs.forEach(row => {
	
		    var issuer = {};
			issuer.name = row.issuer;
			issuer.class = row.issuerClass;
			issuer.percent = Math.round(( row.amount / this.portfolio.totalAmount) *100);
			issuers.push(issuer);
		   });
			return issuers;
		  }
	  }
	}
</script>

