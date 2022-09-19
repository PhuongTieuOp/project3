//-- =============================================================================
//-- Project3
//--
//-- Date:      8-Sept-2022 
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================

//---- Replace csv files to use api data
// const dataRegionPath = 'data/police_region_df.csv';
// const dataSummaryPath = 'data/offence_summary_df.csv';
// const dataUniqueRegionPath = 'data/region_name.csv';
// const dataRegionOffencePath = 'data/year_region_offence.csv';

const dataRegionPath = '/api/getRegionDetails';
const dataUniqueRegionPath = '/api/getRegionNames';
const dataOffenceSummaryPath = '/api/getOffenceSummary';

const delayChart = 50;

let listRegionName = [];
let listYear = [2022, 2021, 2020, 2019];
let selectedYear;
let selectedRegionName;
let list2022 = [];
let list2021= [];
let list2020 = [];
let list2019= [];
let pieChartSet, lineChartSet, barChartSet, bubbleChartSet; // variables to store chart objects

//===================================================================
function loadUniqueRegion() {
    /* data route */
    console.log("=== loadUniqueRegion ");  
  
    d3.csv(dataUniqueRegionPath).then(function(dataURegion) {
      console.log("d3 of loadUniqueRegion... ");      
      console.log(dataURegion);
      for (var i=0; i < dataURegion.length; i++ ){       
      
        console.log(dataURegion[i].region_name);
        listRegionName.push(dataURegion[i].region_name);
      };
      return listRegionName;
  });
}

//=====================================================================
// Initializes the page with a default plot
function init() {
  // Note: 2 load data functions perform before d3.then() promise function (has delay effect)
  // so that data are ready for use inside the promise function.
  loadUniqueRegion();  
  loadPiechartData();
  d3.csv(dataRegionPath).then(function(data) {    
    console.log("=== In Init(), data below: ");
    console.log(data);
    console.log("new listRegionName: ");
    console.log(listRegionName);

    // create a drop down list for Year and load data into it
    var ddlYear = d3.select("#selYear");
    for (var i=0; i < listYear.length; i++ ){   
      ddlYear.append("option").text(listYear[i]).property("value", listYear[i]);
    };    

    // create a drop down list for Region Name and load data into it
    var ddlRegionName = d3.select("#selDataset");
    for (var i=0; i < listRegionName.length; i++ ){   
        ddlRegionName.append("option").text(listRegionName[i]).property("value", listRegionName[i]);
    };    

    // Use the first item in the dropdown lists
    selectedYear = (listYear[0]);
    selectedRegionName = (listRegionName[0]);
    
    console.log(selectedYear);
    console.log(selectedRegionName);
    // plotPiechart();
    plotCharts();
  }  )
}

// 3. Event handlers and logic flows =========================================
//
// Select the button using its id 
var button = d3.select("#filter-btn");
// Create event handler 
button.on("click", runEnter);

init();

// ===============================================================================
// 2. Functions for Year and region selection dropdown boxes
// ===============================================================================
function runEnter() {   
  selectedYear = d3.select("#selYear").property("value");
  selectedRegionName = d3.select("#selDataset").property("value");   
  console.log(`=== runEnter() == year/region: ${selectedYear}/${selectedRegionName}` );

  plotCharts();
}

function optionChanged() {    
  selectedYear = d3.select("#selYear").property("value");
  selectedRegionName = d3.select("#selDataset").property("value");     
  console.log(`=== onChanged(), year/region: ${selectedYear}/${selectedRegionName}` );
}
// ===============================================================================
// 4. Plotting charts for a region
// ===============================================================================
function plotCharts() {
  d3.csv(dataRegionPath).then((data) => {   
      console.log('=== plotCharts(), Data as below: ');
      console.log(data);
      console.log('Plot Region year/name as below: ');
      console.log(selectedYear, selectedRegionName);

      // selectedRegionName = "2 Eastern"; // hard code for testing
      // get related data from the given regionName
      var listFiltered = data.filter(item => 
          item.region_name == selectedRegionName && 
          item.year == selectedYear
          );  
      
      console.log('Below listFiltered: ');
      console.log(listFiltered);

      // create lists for column items from the filter array
      var listIncidentCount = [];
      var listLgaName = [];   
      var listRate = [];
      var listRoundRate = [];
      for (var i=0; i < listFiltered.length; i++ ){
        listLgaName.push(listFiltered[i].lga_name);
        listIncidentCount.push(listFiltered[i].incident_count/100);        
        listRate.push(Math.round(listFiltered[i].rate_per_100000pop) / 1000);
        listRoundRate.push(Math.round(listFiltered[i].rate_per_100000pop));
      };
      console.log('List of listLgaName, listIncidentCount, listRate')
      console.log(listLgaName);
      console.log(listIncidentCount);
      console.log(listRate);

      // plotLinechart(listIncidentCount, listLgaName, listRate, listRoundRate); 
      plotBarchart(listIncidentCount, listLgaName, listRate, listRoundRate);  
      plotBublechart(listIncidentCount, listLgaName, listRate, listRoundRate);    
      // plotPiechart(); 
  })
}
// ===============================================================================
// 4a1. Doughnut chart (chart js) for all 4 year
// ===============================================================================
function loadPiechartData() {
  d3.csv(dataOffenceSummaryPath).then((data) => {   
    console.log('loadPiechartData(), Data as below: ');
    console.log(data);

    // get related data from the given regionName
    list2022 = data.filter(item => 
        item.year == 2022
        );  
    list2021 = data.filter(item => 
        item.year == 2021
        );  
    list2020 = data.filter(item => 
        item.year == 2020
        );  
    list2019 = data.filter(item => 
        item.year == 2019
        );  
        
    console.log('bf list2022Incidentload---- list2022: '+ list2022);
    var list2022Incident = [];
    var list2021Incident = [];   
    var list2020Incident = [];
    var list2019Incident = [];
    for (var i=0; i < list2022.length; i++ ){
        list2022Incident.push(list2022[i].offence_total);
        list2021Incident.push(list2021[i].offence_total);        
        list2020Incident.push(list2020[i].offence_total);
        list2019Incident.push(list2019[i].offence_total);
        };
    console.log('list2022Incident: '+ list2022Incident);
    list2022 = list2022Incident;
    list2021 = list2021Incident;
    list2020 = list2020Incident; 
    list2019 = list2019Incident;
    console.log('list2022: '+ list2022);
    return;
  })
}
// ===============================================================================
// 4a1. Doughnut chart (chart js) setup for Police Region
// ===============================================================================
function plotPiechart(){
  console.log('plotPiechart(): ******************');

  console.log('list2022: '+ list2022);
  console.log('list2021: '+ list2021);
  console.log('list2020: '+ list2020);
  console.log('list2019: '+ list2019);

  const data = {
    labels: [
      'pink',
      'Blue',
      'Yellow',
      'green'
    ],
    datasets: [{
      label: ['2022', '2021', '2020', '2019'],
      data: [list2022, list2021, list2020, list2019],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
  
  var chartOptions = {
    legend: {
      delay: delayChart,
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

  // If a line chart instance exists, destroy it to reuse the canvas
  if(pieChartSet instanceof Chart)    {
      pieChartSet.destroy();
  }

  var chartCanvas = document.getElementById("pie-chart");

  var newChart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: data,
    options: chartOptions
  });
}

// ===============================================================================
// 4a2. Line chart (chart js) setup for Police Region
// ===============================================================================

function plotLinechart(incidentCounts, lgaNames, rates, roundRates){
  
  console.log('plotLinechart()************');

    var data2022 = {
      label: "2022", lineTension: 0.4,
      easing: 'linear',
      data: list2022,
      fill: false, borderColor: 'orange'
    };

  var data2021 = {
      label: "2021", lineTension: 0.4, 
      easing: 'linear',
      data: list2021,
      fill: false, borderColor: 'blue'
    };
  
  var data2020 = {
      label: "2020", lineTension: 0.4,
      easing: 'linear',
      data: list2020,
      fill: false, borderColor: 'red'
    };

    var data2019 = {
      label: "2019", lineTension: 0.4,
      easing: 'linear',
      data: list2019,
      fill: false, borderColor: 'green'
    };

  var regionData = {
    labels: ['1 North West Metro', '2 Eastern', '3 Southern Metro', '4 Western', 'Justice Institutions and Immigration Facilities', 'Unincorporated Vic'],
    datasets: [data2022, data2021, data2020, data2019]
  };

  var chartOptions = {
    legend: {
      delay: delayChart,
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };
  
  // If a line chart instance exists, destroy it to reuse the canvas
  if(lineChartSet instanceof Chart)    {
      lineChartSet.destroy();
  }
  var chartCanvas = document.getElementById("line-chart");  

  lineChartSet = new Chart(chartCanvas, {
        type: 'line',
        data: regionData,
        options: chartOptions
    });

}
// ===============================================================================
// 4b. Bar chart setup for first 10 offence LGAs of the region
// ===============================================================================
function plotBarchartpl(incidentCounts, lgaNames, rates,roundRates) {  

  incidentCounts = incidentCounts.slice(0,10).reverse();
  rates = rates.slice(0,10).reverse();
  lgaNames = lgaNames.slice(0,10).reverse();

  var trace1 = {
    x: incidentCounts,
    y: rates,
    text: lgaNames,
    orientation :'h',
    type: "bar"
    };
  var layout = {
    title: (`<b>`+ `Top 10 offence LGAs Found`+`</b>`),
    xaxis: { title: "Incident Count" },
    yaxis: { title: "LGA"}
    };

  var data = [trace1];
  
  Plotly.newPlot("bar-chart", data, layout);
}
//===========================================
function plotBarchart(incidentCounts, lgaNames, rates, roundRates){
  
  console.log('Bar chart function:************'); 
   const data = {
    labels: lgaNames,
    datasets: [{
      label:` Offences of ${incidentCounts.length} LGAs for Region "${selectedRegionName}"`,
      data: incidentCounts,
      backgroundColor: 'darkblue',
      borderColor: 'black',
      borderWidth: 1
    }]
  };
  // </block:setup>

  console.log('before chartOptions =============');
  var chartOptions = {    
    title: 'Victoria Police Region', 
    legend: {
      display: true,
      position: 'right top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    options: {        
      plugins: {
        title: {
            display: true,
            text: 'Victoria Police Region'
        }
      },             
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true
          }
        }],        
        y: {
          beginAtZero: true
        },
      delay: delayChart
      }
    }
  };

  console.log('before barChartSet, new Chart =============');

  // If a line chart instance exists, destroy it to reuse the canvas
  if(barChartSet instanceof Chart)  {
    barChartSet.destroy();
  }
  var chartCanvas = document.getElementById('bar-chart');

  barChartSet = new Chart(chartCanvas, {
    type: 'bar',
    data: data,
    options: chartOptions
  });
}
// ===============================================================================
// 4b. Bubble chart setup for all samples of a region
// ===============================================================================
function plotBublechart(incidentCounts, lgaNames, rates, roundRates){

  var trace1 = {
    x: rates,
    y: incidentCounts,
    text: lgaNames,    
    mode: 'markers',
    marker: {color: 'orange', size: incidentCounts}
  };
  console.log('rates: ' + rates);
  console.log('Incident Count: ' + incidentCounts);
  var layout = {
    title: (`<b>`+ `Year ${selectedYear} "${selectedRegionName}" Region's LGA Offences` + `</b>`),
    xaxis: { title: "Rate per 100,000,000 Population"},
    yaxis: { title: "Incident Count" },    
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)',
    height: 600,
    width: 1200
  };

  var data = [trace1];
  Plotly.newPlot('bubble-chart', data, layout);
};
