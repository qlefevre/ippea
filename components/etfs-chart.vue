<template>
	<div class="stacked-bar">
		<div v-for="etf in etfs" class="bar etf" v-bind:class="etf.class" v-bind:style="{ width: etf.percent +'%'}">{{etf.name}}</br><div class="percent">{{etf.percent}}%</div></div>
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
		  etfs: function(){
		  var etfs = [];
		  this.portfolio.etfs.forEach(row => {
		    var etf = {};
			etf.name = row.zone;
			etf.class = row.zoneClass;
			etf.percent = Math.round(( row.amount / this.portfolio.totalAmount) *100);
			etfs.push(etf);
		   });
			return etfs;
		  }
	  }
	}
</script>
