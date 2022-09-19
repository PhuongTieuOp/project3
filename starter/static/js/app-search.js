//-- =============================================================================
//-- Project3
//--
//-- Date:      8-Sept-2022 
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================

//---- Replace csv files to use api data, the rest of logic stay the same
// const dataRegionPath = 'data/police_region_df.csv';

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
      for (var i=0; i < listFiltered.length; i++ ){
        listLgaName.push(listFiltered[i].lga_name);
        // need to descale incident_counts and rates, so that bubble can show
        listIncidentCount.push(listFiltered[i].incident_count/100);        
        listRate.push(Math.round(listFiltered[i].rate_per_100000pop) / 1000);
      };
      console.log('List of listLgaName, listIncidentCount, listRate')
      console.log(listLgaName);
      console.log(listIncidentCount);
      console.log(listRate);

      plotBarchart(listIncidentCount, listLgaName, listRate);  
      plotBublechart(listIncidentCount, listLgaName, listRate);  
  })
}

// ===============================================================================
// 4a. Bar chart setup for all LGAs of a region, using chartjs, html must define a 'canvas
// ===============================================================================

function plotBarchart(incidentCounts, lgaNames, rates){
  
  console.log('Bar chart function:************'); 
   const data = {
    labels: lgaNames,
    datasets: [{
      label:`Region "${selectedRegionName}", LGAs Offence ${incidentCounts.length}`,
      data: incidentCounts,
      backgroundColor: 'darkblue',
      borderColor: 'black',
      borderWidth: 1
    }]
  };

  console.log('before chartOptions =============');
  var chartOptions = {    
    legend: {
      display: true,
      position: 'right top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    options: {    
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
// 4b. Bubble chart setup for all LGAs of a region using plotly
// ===============================================================================
function plotBublechart(incidentCounts, lgaNames, rates){

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
    title: (`<b>`+ `Year ${selectedYear}, Region "${selectedRegionName}", LGA's Offence` + `</b>`),
    xaxis: { title: "Rate per 100,000,000 Population"},
    yaxis: { title: "Incident Count per 100 count" },    
    paper_bgcolor:'rgba(0,0,0,0)', // make background transparent
    plot_bgcolor:'rgba(0,0,0,0)',
    height: 600,
    width: 1100
  };

  var data = [trace1];
  Plotly.newPlot('bubble-chart', data, layout);
};
