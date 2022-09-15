// Variable declarations 
var data = 'Outputs/offence_summary_df.csv'

// find tbody in html
let tbody = d3.select("tbody");

// defining filter as an array
var filters = [];


//this function builds the table (appending <tr> and <td> for each value to be populated)
function buildTable(data){
    tbody.html("");
    d3.csv(data)
          .then( res => {
            res.forEach(
                (dataRow) => {
                    let row = tbody.append("tr");
                    Object.values(dataRow).forEach((val) => {
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



// the filterListener function will filter the results based on the date field provided on the HTML file.
// to address: Use a date form in your HTML document and write JavaScript code that will listen for events and search through the date/time column to find rows that match user input.
function filterListener(){
    d3.event.preventDefault();
    let uyear = d3.select("#Year").property("value");
    let ulga = d3.select("#lga").property("value");
    console.log("Year entered: ", uyear);
    console.log("LGA Selected: ", ulga);
    // this will work if you provide all of the information
    filters["Year"] = uyear;
    filters["lga"] = ulga;
    console.log("Filters selected", filters);
    let filteredData = data;

        if (ulga) {
            d3.csv(data)
            .then( res => {
                var filteredTable = Object.values(res).filter((row) => row.lga_name === ulga);
                console.log("Filtered table values: ", filteredTable)
                console.log("Filtered data for debugging: ", filteredData);

                tbody.html("");
                filteredTable.forEach(
                    (dataRow) => {
                    let row = tbody.append("tr");
                    Object.values(dataRow).forEach((val) => {
                        let cell = row.append("td");
                        cell.text(val);
                                     });
                    }
                );
            })
            ploty(filteredData);
        }
    }


// Listener for the date filtering
d3.selectAll("#filter-btn").on('click', filterListener);



function ploty(kutyu) {
    let ulga = d3.select("#lga").property("value");

    d3.csv(kutyu)
        .then( res => {
            let filteredTable = Object.values(res).filter((row) => row.lga_name === ulga);
            console.log("Filtered table values for chart: ", filteredTable)
            console.log(filteredTable[0]);
            var x1 = filteredTable[0].a_crime_vs_person;
            var x2 = filteredTable[0].b_property_deception;
            var x3 = filteredTable[0].c_drug_offence;
            var x4 = filteredTable[0].d_public_order_security;
            var x5 = filteredTable[0].e_justice_offence;
            var x6 = filteredTable[0].f_other_offence;


        // Building the horizontal bar chart
        var bar_trace = {
            type: 'bar',
            orientation: 'h',
            x: [x1,x2,x3, x4, x5, x6],
            y: ['A Crimes Against the person','B Property Deception','C Drug Offence', 'D Public order security', 'E Justice offence', 'F Other offence'],
        };
        var bar_data = [bar_trace];
        var bar_title = {
            title: "Number of offences for the selected LGA and year:",
        };

        // Plotting horizontal chart
        Plotly.newPlot("bar", bar_data, bar_title);

    });
}



    dropdown_init();
    buildTable(data);
