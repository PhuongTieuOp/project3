//-- =============================================================================
//-- Project3
//--
//-- Date:      8-Sept-2022 
//-- ============================================================================= 


// Reading the input CSV file for the data analysis 
var data = 'Outputs/offence_summary_df.csv'

// Finding the tbody in policedata.html to insert the table
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


// Populating the local government areas into the dropdown's #LGA select dropdown
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
function filterListener(){
    d3.event.preventDefault();
    let uyear = d3.select("#Year").property("value");
    let ulga = d3.select("#lga").property("value");
    console.log("Year entered: ", uyear);
    console.log("LGA Selected: ", ulga);
    filters["Year"] = uyear;
    filters["lga"] = ulga;
    console.log("Filters selected", filters);
    let filteredData = data;

        if (ulga || uyear ) {
            d3.csv(data)
            .then( res => {
                 var filteredTable = Object.values(res).filter((row) => row.lga_name === ulga && 
                 row.year === uyear
                 );

// this commented out code was something that I experimented before with and didn't want to lose, so I left it here:
//                Object.entries(filters).forEach(([key,value])=> {
//                var filteredTable =  Object.values(res).filter(row => row[key]=== value);

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


// Plotting function to display a horizontal bar chart (MUST HAVE both year and local government area provided)
function ploty(kutyu) {
    let ulga = d3.select("#lga").property("value");
    let uyear = d3.select("#Year").property("value");

    d3.csv(kutyu)
        .then( res => {
            let filteredTable = Object.values(res).filter((row) => row.lga_name === ulga && 
            row.year === uyear   
            );
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


// Main program
    dropdown_init();
    buildTable(data);
