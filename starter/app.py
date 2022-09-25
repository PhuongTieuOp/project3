#====================================================================
# Project 3
#
# Issue Date:  29 Aug 2022
# Submit Date: 19 Sep 2022
#====================================================================
# 1. Import libraries
#====================================================================
import os
import pandas as pd
from flask import (
    Flask,
    render_template)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from db_conn import DB_conn     # db connection key

#=====================================================================
# 2. Flask Setup
#=====================================================================
app = Flask(__name__)

#======================================================================
# 3. Database Setup
#======================================================================

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_conn', '')

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

engine = create_engine(DB_conn)
conn = engine.connect()

#=======================================================================
# 4. Create route(s) that render template(s)
#=======================================================================
@app.route("/")
def compare():
    return render_template("compare_region.html")

@app.route("/api/searchRegion")
def search():
    return render_template("search_region.html")

@app.route("/api/policeData")
def policedata():
    return render_template("policedata.html")

@app.route("/api/getMapData")
def getGeojsondata():
    return render_template("map_data.html") 

#========================================================================
# 5. Define routes to retrieve data from database. These routes can be used/called in any app.js
#========================================================================
# Get unique Region Names
@app.route("/api/getRegionNames")
def getRegNames():
    
    df = pd.read_sql("Select distinct region_name from region_incident group by region_name",engine)
    conn.close()
    
    data = df.to_csv(index=False)
    return data

#==============================================================
# Get Region details
@app.route("/api/getRegionDetails")
def getRegDetails():
    
    df = pd.read_sql("Select * from region_incident order by 1 desc, 2, 4 desc",engine)
    conn.close()
    
    data = df.to_csv(index=False)
    return data

#===============================================================
# Get Offence summary details
@app.route("/api/getTotalByRegion")
def getTotByRegion():
    
    df = pd.read_sql("Select distinct year, region_name, sum(incident_count) from region_incident group by year, region_name order by 1 desc, 2",engine)
    conn.close()
    
    data = df.to_csv(index=False)
    return data

#===============================================================
# Get Offence summary details
@app.route("/api/getOffenceSummary")
def getOffSummary():
    
    df = pd.read_sql("Select * from lga_offence_summary",engine)
    conn.close()
    
    data = df.to_csv(index=False)
    return data

#===============================================================
# Get LGA postcode, lat/lon for map layout base on year
@app.route("/api/getMapData")
def getGeojsonData():
    
    # Define sql variables for a dynamic sql string
    sql_select="select s.year, s.region_name, p.lga_name, s.offence_total, p.postcode, p.latitude, p.longitude "
    sql_from = " from lga_offence_summary s, region_postcode p "
    sql_where = " where p.lga_name = s.lga_name and s.year = "
    sql_orderby = " order by 1 desc, 2 asc, 4 desc"

    # Build a geojson object using the retrieved data
    geojson_list = []
    years = [2022, 2021, 2020, 2019]
    
    for i in range(0, 4):
        # Build sql string for db query        
        year = years[i]
        sql_string = f"{sql_select} {sql_from} {sql_where} {year} {sql_orderby}" 
        df = pd.read_sql(sql_string,engine)     

        for idx, row in df.iterrows():
            print(f"i, idx, row : {i}, {idx}; year, region, lga : {row['year']}, {row['region_name']}, {row['lga_name']}=======")
            geojson = {"type": "FeatureCollection", "features": []}
            
            feature = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [row['longitude'], row['latitude']]},
                "properties": {"year" : row['year'], "region": row['region_name'], "lga" : row['lga_name'], "offence" : row['offence_total']}}
            geojson['features'].append(feature)

        geojson_list.append(geojson)        

    return geojson_list

#==========================================================================
# 6. Run app
#==========================================================================
if __name__ == "__main__":
    app.run()
