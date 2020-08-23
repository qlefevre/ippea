<template>

	<el-table
	   stripe
	   :data="etfs"
	   style="width: 100%">
	   <el-table-column
		  prop="issuer"
		  label="Émetteur"
		  width="110">
		  <template slot-scope="scope">
			 <el-tag size="medium" class="issuer" v-bind:class="scope.row.issuerClass">{{ scope.row.issuer }}</el-tag>
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="zone"
		  label="Zone"
		  width="110">
		  <template slot-scope="scope">
			 <el-popover trigger="hover" placement="top">
				<p class="center">{{ scope.row.zoneDescription }}</p>
				<div slot="reference" class="name-wrapper">
				   <el-tag size="medium" class="zone"  v-bind:class=" scope.row.zoneClass">{{ scope.row.zone }}</el-tag>
				</div>
			 </el-popover>
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="name"
		  label="ETF"
		  width="200">
		  <template slot-scope="scope">
			 <a class="name" v-bind:href="scope.row.tickerUrl">{{ scope.row.name }}<br>
			 <span class="isin">{{ scope.row.isin }} - {{ scope.row.ticker }}</span></a>
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="amount"
		  label="Montant" 
		  width="90">
		  <template slot-scope="scope">
			 {{ formatCurrency(scope.row.amount) }}
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="netassetvalue"
		  label="VL"
		  width="90">
		  <template slot-scope="scope">
			 {{ formatCurrency(scope.row.netassetvalue) }}
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="targetBuyunit"
		  label="Achat"
		  width="90">
		  <template slot-scope="scope">
			 {{ scope.row.targetBuyunit }}
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="buyunit"
		  label="Achat Cible"
		  width="100">
		  <template slot-scope="scope">
			 {{ scope.row.buyunit }}
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="targetpercent"
		  label="% Cible"
		  width="90">
		  <template slot-scope="scope">
			 {{ scope.row.targetpercent }}%
		  </template>
	   </el-table-column>
	   <el-table-column
		  prop="buyunitpayment"
		  label="Versement Cible"
		  width="100">
		  <template slot-scope="scope">
			 {{ scope.row.buyunitpayment }}
		  </template>
	   </el-table-column>
	</el-table>

</template>

<script>
module.exports = {
    data() {
        return {}
    },
    props: {
        portfolio: Object,
        target: Object,
        payment: Number
    },
    methods: {
        formatCurrency: function(value) {
            return currencyformatter.format(value);
        },
        getPercentageFromTarget: function(name) {
            var value = 0;
            this.target.etfs.forEach(row => {
                if (row.name === name) {
                    value = row.amount;
                    return;
                }
            });
            return value;
        }
    },
    computed: {
        targetTotalAmount: function() {
            return this.portfolio.totalAmount + parseFloat(this.payment);
        },
        etfs: function() {
            var etfs = [];
            var newTargetTotalAmount = this.portfolio.totalAmount;
            this.portfolio.etfs.forEach(row => {
                var etf = Object.assign({}, row);
                var percent = this.getPercentageFromTarget(row.zone) / 100;
                var delta = percent * this.targetTotalAmount - row.amount;
                etf.targetBuyunit = parseFloat(delta / row.netassetvalue).toFixed(2);
                etf.buyunit = Math.round(etf.targetBuyunit);
                etf.buyunit = etf.buyunit <= 0 ? 0 : etf.buyunit;
				etf.buyunitpayment = Math.floor(this.payment*percent/row.netassetvalue);
                newTargetTotalAmount += etf.buyunit * etf.netassetvalue;
                etfs.push(etf);
            });
            etfs.forEach(etf => {
                etf.targetpercent = Math.round((etf.amount + etf.buyunit * etf.netassetvalue) / newTargetTotalAmount * 100);
            });
            return etfs;
        }
    }
}
</script>

