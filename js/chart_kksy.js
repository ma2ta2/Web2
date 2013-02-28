$(document).ready(function() {

var options = {
 chart: {
 renderTo: 'container',
 defaultSeriesType: 'line',
 marginRight: 130,
 marginBottom: 25,
 	 
  zoomType: 'xy',
  spacingRight: 20
 },
 title: {
 style: {
 color: 'skyblue'
 },
 text: '国際収支'
 },
 plotOptions: {
 	 line: {connectNulls : true}
 },
 legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 900,
    y: 150,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF'
 },
 xAxis: {
 categories: []
 },
 yAxis: {
 title: {
 style: {
 color: 'skyblue'
 },
 text: '円'
 },
 labels: {
	formatter: function() {
		return this.value;
	}
 },
 plotLines: [
 {
 value: 0,
 width: 2,
 color: 'red'
 }
 ]
 },
 series: []
 }
var flag;
 $.get('../data/kokusyu.csv', function(data) {
 // Split the lines
 var lines = data.split('\n');
 
 // Iterate over the lines and add categories or series
 $.each(lines, function(lineNo, line) {
 var items = line.split(',');
 
 // header line contains categories
 if (lineNo == 0) {
 $.each(items, function(itemNo, item) {
 if (itemNo > 0) {
 	 if((item.substring(5,7)) ==("01")){	//if(flag==0||flag==1||flag%12==0){
 		options.xAxis.categories.push(item.substring(2,4));//7
 		flag=item.substring(5,7);
 	 } else {options.xAxis.categories.push(" ");
 	 }
 }
 });
 }
 /*$( csv ).each( function(i, val) {
        // CSVの１行目はヘッダなのでパス
        if (i == 0 | isNaN(val[1])) return;
 
        var time = Date.parse(val[0]);
        temperature.push( [time, val[1]] );
    });
    var date = moment(graphData.items[i].Date, "yy");
    */
 // the rest of the lines contain data with their name in the first position
 else {
 var series = {
 data: []
 };
 $.each(items, function(itemNo, item) {
 if (itemNo == 0) {
  // var time = Date.parse(item[0]);
  series.name = item;
 }
 else {
 	 if(item == 0){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	 /*
 	if(item == 0&&series.name=="CA(a+b+c)"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="G&S"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="TB"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="Exprt"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="Imprt"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="Services"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="Income"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="CT"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="C&FA(d+e)"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="FA"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="CapA"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="CiAS"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}
 	if(item == 0&&series.name=="E&O"&&flag!="12"){
 	series.data.push(null);
 	} else {series.data.push(parseFloat(item));}*/
 }
 });
 
 	options.series.push(series);
 }
 });
 
 // Create the chart
 var chart = new Highcharts.Chart(options);
 });
 });
 