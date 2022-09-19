//-- =============================================================================
//-- Project3
//--
//-- Date:      8-Sept-2022 
//-- ============================================================================= 

// ===============================================================================
// 1. Initialisation 
// ===============================================================================
const dataRegionPath = '/api/getTotalByRegion';

const delayChart = 50;

let listRegionName = [];
let listYear = [2022, 2021, 2020, 2019];
let selectedYear;
let selectedRegionName;
let list2022 = [];
let list2021= [];
let list2020 = [];
let list2019= [];
let barChartSet;

//=====================================================================
// Initializes the page with a default plot
function init() {
  // Note: 2 load data functions perform before d3.then() promise function (has delay effect)
  // so that data are ready for use inside the promise function.
  loadByYear();
  d3.csv(dataRegionPath).then(function(data) {    
    console.log("=== In Init(), data below: ");
    console.log(data);
    plotBarchart();
  }  )
}

init();

// Load region total by year
function loadByYear() {
    d3.csv(dataRegionPath).then((data) => {   
      console.log('loadByYear(), Data as below: ');
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
      
      // create region name list
      for (var i=0; i < list2022.length; i++ ){           
              console.log(list2022[i].region_name);
              listRegionName.push(list2022[i].region_name);
            };
          
      console.log('bf list2022Incidentload---- list2022: '+ list2022);
      var list2022Incident = [];
      var list2021Incident = [];   
      var list2020Incident = [];
      var list2019Incident = [];
      for (var i=0; i < list2022.length; i++ ){
          list2022Incident.push(list2022[i].sum);
          list2021Incident.push(list2021[i].sum);        
          list2020Incident.push(list2020[i].sum);
          list2019Incident.push(list2019[i].sum);
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
// Bar chart setup for 4 years
// ===============================================================================
function plotBarchart(){
    const labels = listRegionName;
    const data = {
      labels: labels,
      datasets: [
        {
          label: '2022',
          data: list2022,
          backgroundColor: "green",
        },
        {
          label: '2021',
          data: list2021,
          backgroundColor: "blue",
        },
        {
          label: '2020',
          data: list2020,
          backgroundColor: "red",
        },    
        {
          label: '2019',
          data: list2019,
          backgroundColor: "orange",
        }
      ]
    };
  
    const chartOptions = {
      options: {
        plugins: {
          title: {
            display: true
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    };
    // If a line chart instance exists, destroy it to reuse the canvas
    if(barChartSet instanceof Chart)    {
      barChartSet.destroy();
    }
  
    var chartCanvas = document.getElementById("bar-chart");
  
  
    var newChart = new Chart(chartCanvas, {
      type: 'bar',
      data: data,
      options: chartOptions
    });
  };