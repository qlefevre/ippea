<template>
 <el-table
	 stripe
    :data="portfolio.etfs"
    style="width: 100%">
	  <el-table-column
      prop="issuer"
      label="Émetteur"
      width="100">
	  <template slot-scope="scope">
            <el-tag size="medium" class="issuer" v-bind:class="scope.row.issuer.toLowerCase()">{{ scope.row.issuer }}</el-tag>
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
      width="250">
	   <template slot-scope="scope">
	  <a class="name" v-bind:href="scope.row.tickerUrl">{{ scope.row.name }}<br>
	  <span class="isin">{{ scope.row.isin }} - {{ scope.row.ticker }}</span></a>
	  </template>
    </el-table-column>
  
    <el-table-column
      prop="amount"
      label="Montant">
	  
	    <template slot-scope="scope">
	  {{ formatCurrency(scope.row.amount) }}
	  </template>
    </el-table-column>
  </el-table>

</template>

<script>
module.exports = {         
		data(){
			return{}            
		},
		props: {
			portfolio: Object
		},
    methods: {
      formatCurrency:function (value){
				return currencyformatter.format(value);
		  }
    }
	}
</script>

