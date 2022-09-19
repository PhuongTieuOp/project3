-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

CREATE TABLE "region_incident" (
    "year" int   NOT NULL,
    "region_name" varchar(50)   NOT NULL,
    "lga_name" varchar(50)   NOT NULL,
    "incident_count" int   NOT NULL,
    "rate_per_100000pop" int   NOT NULL
);

CREATE TABLE "lga_offence" (
    "year" int   NOT NULL,
    "region_name" varchar(50)   NOT NULL,
    "psa_name" varchar(50)   NOT NULL,
    "lga_name" varchar(50)   NOT NULL,
    "offence_div_name" varchar(50)   NOT NULL,
    "offence_subdiv_name" varchar(50)   NOT NULL,
    "offence_subgrp_name" varchar(50)   NOT NULL,
    "incident_count" int   NOT NULL,
    "psa_rate_per_100000pop" int   NOT NULL,
    "lga_rate_per_100000pop" int   NOT NULL
);

CREATE TABLE "lga_offence_summary" (
    "year" int   NOT NULL,
    "region_name" varchar(50)   NOT NULL,
    "lga_name" varchar(50)   NOT NULL,
    "a_crime_vs_person" int   NOT NULL,
    "b_property_deception" int   NOT NULL,
    "c_drug_offence" int   NOT NULL,
    "d_public_order_security" int   NOT NULL,
    "e_justice_offence" int   NOT NULL,
    "f_other_offence" int   NOT NULL
);

ALTER TABLE "lga_offence" ADD CONSTRAINT "fk_lga_offence_region_name" FOREIGN KEY("region_name")
REFERENCES "region_incident" ("region_name");

ALTER TABLE "lga_offence_summary" ADD CONSTRAINT "fk_lga_offence_summary_region_name" FOREIGN KEY("region_name")
REFERENCES "region_incident" ("region_name");

ALTER TABLE "lga_offence_summary" ADD CONSTRAINT "fk_lga_offence_summary_lga_name" FOREIGN KEY("lga_name")
REFERENCES "lga_offence" ("lga_name");

