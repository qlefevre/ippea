<template>

	<table class="msci-world-chart box">
	   <tr>
		  <th colspan="2">Tous les pays et toutes les capitalisations</th>
	   </tr>
	   <tr>
		  <td class="vertical">
			 <div class="vertical">85%</div>
		  </td>
		  <td>
			 <table class="msci-world-chart box">
				<tr>
				   <th>Tous les pays</th>
				</tr>
				<tr>
				   <td>
					  <table class="msci-world-chart">
						 <tr>
							<th colspan="5">Monde</th>
							<th>Émergents</th>
						 </tr>
						 <tr>
							<th>Etats-Unis</th>
							<th>Zone Euro</th>
							<th>Japon</th>
							<th>Royaume-Uni</th>
							<th>Autres</th>
							<td></td>
						 </tr>
						 <tr>
							<td><div class="separator"/>{{msciData.usa}}%</div></td>
							<td><div class="separator"/>{{msciData.euro}}%</div></td>
							<td><div class="separator"/>{{msciData.japan}}%</div></td>
							<td><div class="separator"/>{{msciData.uk}}%</div></td>
							<td><div class="separator"/>{{msciData.others}}%</div></td>
							<td><div class="separator"/>{{msciData.emergingMarkets}}%</div></td>
						 </tr>
					  </table>
				   </td>
				</tr>
			 </table>
		  </td>
	   </tr>
	   <tr>
		  <td class="vertical">
			 <div class="vertical">15%</div>
		  </td>
		  <td>
			 <table class="msci-world-chart box">
				<tr>
				   <th>Petites capitalisations</th>
				</tr>
				<tr>
				<td>
					<table class="msci-world-chart">
						<tr>
						   <th>Etats-Unis</th>
						   <th>Zone Euro</th>
						</tr>
						<tr>
						   <td><div class="separator"/>{{msciData.usa}}%</div></td>
						   <td><div class="separator"/>{{msciData.euro}}%</div></td>
						</tr>
					</table>
				</td>
				</tr>
			 </table>
		  </td>
	   </tr>
	</table>

</template>

<script>
	module.exports = {         
		data(){
			return{}            
		},
		props: {
			msciData: Object
		}
	}
</script>

<style>
table.msci-world-chart.box {
  border-collapse: collapse;
  border: 2px solid #1E90FF;
}
table.msci-world-chart.box td{
  padding: 4px;
}
.msci-world-chart .vertical{
    writing-mode: vertical-rl;
	vertical-align: middle;
	transform: rotate(90deg);
}
table.msci-world-chart, .msci-world-chart table{
  border-collapse: separate;
  border-spacing: 4px 6px;
  text-align: center;
  color: #1E90FF;
  font-size:13px;
}
.msci-world-chart  table, th, td {
  border: 0px;
  vertical-align: bottom;
}
.msci-world-chart th {
  padding: 0.5em;
  background-color: #1E90FF;
  color: white;
  font-weight: 100;
}
.msci-world-chart .separator {
    display: flex;
    align-items: center;
    text-align: center;
}
.msci-world-chart .separator::before, .separator::after {
    content: '';
    flex: 1;
    border-bottom: 2px solid #1E90FF;
}
.msci-world-chart .separator::before {
    margin-right: .25em;
}
.msci-world-chart .separator::after {
    margin-left: .25em;
}
</style>