// Variable declarations 
var data = 'Outputs/offence_summary_df.csv'

// find tbody in html
let tbody = d3.select("tbody");

// defining filter as an array
var filters = [];

// DEFINING FUNCTIONS TO BUILD TABLE STRUCTURE AND TO LISTEN TO EVENTS

//this function builds the table (appending <tr> and <td> for each value to be populated)
function buildTable(data){
    tbody.html("");
    d3.csv(data)
          .then( res => {
            res.forEach(
                (dataRow) => {
            //for each row in data.js, we insert <tr>
                    let row = tbody.append("tr");
//                    console.log(dataRow.lga_name);
                    Object.values(dataRow).forEach((val) => {
            // //for each cell, we insert <td> and the value 
                         let cell = row.append("td");
                         cell.text(val);
                         });

                });
            })
}


// LGA into dropdown
function dropdown_init() {
    var dropdown = d3.select("#lga")
    d3.csv(data)
        .then( res => {
        res.forEach(
            lga_name => dropdown
              .append("option")
              .text(lga_name.lga_name)
              .property('value', lga_name.lga_name)           
             )

       });
};

dropdown_init();


// the filterListener function will filter the results based on the date field provided on the HTML file.
// to address: Use a date form in your HTML document and write JavaScript code that will listen for events and search through the date/time column to find rows that match user input.
function filterListener(){
    d3.event.preventDefault();
    let uyear = d3.select("#Year").property("value");
    let ulga = d3.select("#lga").property("value");
    console.log(uyear);
    console.log(ulga);
    // this will work if you provide all of the information
    filters["Year"] = uyear;
    filters["lga"] = ulga;
    console.log(filters);
    let filteredData = data;

// // Option 1 - DON'T DELETE
//     if(uyear || ulga ) {
//        Object.entries(filters).forEach(([key,value])=> {
//        filteredData =  Object.values(filteredData).filteredData.filter(row => row[key]=== value);
//        });
//     };

    // Option 2 - DON'T DELETE! 
 
        if(uyear) {
            console.log(Object.values(filteredData).filter((row) => row.Year === uyear));
            filteredData = Object.values(filteredData).filter((row) => row.Year === uyear);
            // filteredData = filteredData.filter((row) => row.Year === uyear);
        }
        if (ulga) {
            console.log(Object.values(filteredData).filter((row) => row.lga === ulga));
            filteredData = Object.values(filteredData).filter((row) => row.lga === ulga);
//            filteredData = filteredData.filter((row) => row.lga === ulga);

        }
    

    // console.log(filteredData);
    // }
    buildTable(filteredData);
}


// Listener for the date filtering
d3.selectAll("#filter-btn").on('click', filterListener);

//Populate tableData from data.js and this will display on the webpage
buildTable(data);


function plotting(unique_id) {
    d3.json(samples).then(function (data) {
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObj => sampleObj.id == unique_id);
        var results = resultsArray[0];
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // Building the horizontal bar chart
        var bar_trace = {
            type: 'bar',
            orientation: 'h',
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
        };
        var bar_data = [bar_trace];
        var bar_title = {
            title: "Top 10 OTU values for the selected individual",
        };

        // Plotting horizontal chart
        Plotly.newPlot("bar", bar_data, bar_title);

    });
}