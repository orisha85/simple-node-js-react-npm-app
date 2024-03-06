import { useEffect, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";

export function aggregateMaterialData(data, dist_hr, costMobalization) {
    console.log("costMobalization",costMobalization)

    const aggregatedData = {};
    data.forEach(item => {
        const key = `${item.Header_ID}_${item.SKU_Group}`;
        if (!aggregatedData[key]) {
            aggregatedData[key] = {
                Header_ID: item.Header_ID,
                SKU_Group: item.SKU_Group,
                Mat_Quantity_Actual: 0,
                Crew_Hour_Standard: 0,
                Labour_Headcount: 0,
                Drive_Distance: dist_hr
                //Mob_Override: 0, // Initialize Mob_Override
                //Labour_Hours_Override: 0 // Initialize Labour_Hours_Override
            };
        }
        aggregatedData[key].Mat_Quantity_Actual += item.Mat_Quantity_Actual || 0;
        aggregatedData[key].Crew_Hour_Standard += parseFloat(item.Crew_Hour_Standard) || 0;
        aggregatedData[key].Labour_Headcount = parseFloat(item.Labour_Headcount) || 0;
    });

    if (costMobalization) {
        Object.values(aggregatedData).forEach(item => {
            const dbRecord = costMobalization ? costMobalization.find(obj => obj.Header_ID == item.Header_ID && obj.SKU_Group == item.SKU_Group) : undefined;
            if (dbRecord) {
                item.Mob_Override = dbRecord.MOB_Count_Override;
                item.Labour_Hours_Override = dbRecord.Total_Override_Hour;
            }
        });
    }

    return Object.values(aggregatedData);
}

export function updateLaborCostTable(Distance_Hour, costMobalization) {
    //console.log("Helper Distance", Distance_Hour);
    const materialCostTable = Tabulator.findTable("#material-cost")[0];
    const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    const materialCostTableData = materialCostTable.getData();
    const aggregatedData = aggregateMaterialData(materialCostTableData, Distance_Hour, costMobalization);
    laborCostTable.replaceData(aggregatedData);
}

export function isTableEmpty(tableDiv) {
    const table = Tabulator.findTable(tableDiv)[0];
    return (table.getData().length === 0)
}

export function formatNumber(value, minFractionDigits, maxFractionDigits, fallback) {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toLocaleString(undefined, { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits });
    } else {
        // Return the fallback value for invalid input
        return fallback;
    }
}
export function formatNumberPercent(value, minFractionDigits, maxFractionDigits, fallback) {
    if (typeof value === 'number' && !isNaN(value)) {
        value = value * 100
        return value.toLocaleString(undefined, { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits }) + "%";
    } else {
        // Return the fallback value for invalid input
        return fallback;
    }
}


export const formattedCalc = function(values, data, calcParams) {
    const totalSum = values.reduce((accumulator, currentValue) => accumulator + (currentValue || 0), 0);
    return formatNumber(totalSum, 0, 0, 0);
};

export const formattedCalcMoney = function(values, data, calcParams) {
    const totalSum = values.reduce((accumulator, currentValue) => accumulator + (currentValue || 0), 0);
    return "$" + formatNumber(totalSum, 0, 2, 0);
};

export const formattedCalcAvgPercent = function(values, data, calcParams) {
    const totalSum = values.reduce((accumulator, currentValue) => accumulator + (currentValue || 0), 0);
    const average = (totalSum / values.length) * 100;
    return formatNumber(average, 0, 2, 0) + "%";
};

// Function to aggregate data by id and SKU_Group
export function aggregatePricingData(data, priceSummary) {
    console.log("priceSummary",priceSummary)

    const aggregatedData = {};
    data.forEach(item => {
        console.log("Data-item",item)
        const sku = item.SKU_Alias_Item_ID ?  item.SKU_Alias_Item_ID : item.SKU_Item_ID
        const key = `${item.Header_ID}_${sku}`; // Trim spaces from SKU_Group
        if (!aggregatedData[key]) {
            aggregatedData[key] = {
                Header_ID: item.Header_ID,
                SKU_Item_ID: sku,
                Mat_UoM: item.Mat_UoM,
                SKU_Item_Desc: item.SKU_Item_Desc,
                SKU_Alias_Item_ID: item.SKU_Alias_Item_ID,
                Unit_Cost: 0,
                Mat_Quantity_Actual: 0,
                Total_Line_Cost: 0
            };
        }
        aggregatedData[key].Unit_Cost += item.Unit_Cost || 0; // Convert null to 0
        aggregatedData[key].Mat_Quantity_Actual += parseFloat(item.Mat_Quantity_Actual) || 0; // Convert null to 0
        aggregatedData[key].Total_Line_Cost += parseFloat(item.Total_Line_Cost) || 0; // Convert null to 0

        if (priceSummary) {
            Object.values(aggregatedData).forEach(item => {
                const dbRecord = priceSummary ? priceSummary.find(obj => obj.Header_ID == item.Header_ID && obj.SKU_Item_ID == item.SKU_Alias_Item_ID) : undefined;
                console.log("dbRecord3",dbRecord)
                if (dbRecord) {
                    item.SKU_Item_Desc = dbRecord.SKU_Alias_Item_Desc;
                    item.Quoted_Qty = dbRecord.Quantity_Quote;
                    item.Price = dbRecord.Price_Per_Unit;
                    item.Quantity_Actual = dbRecord.Quantity_Quote ? dbRecord.Quantity_Quote : dbRecord.Quantity_Actual;
                }
            });
        }

    });
    console.log("aggregatedData",aggregatedData)
    return Object.values(aggregatedData);
};

export function updateBidPricingTable(priceSummary) {
    const costSummaryTable = Tabulator.findTable("#cost-summary")[0];
    const bidPricingTable = Tabulator.findTable("#bid-pricing")[0];
    const costSummaryData = costSummaryTable.getData();
    const aggregatedData = aggregatePricingData(costSummaryData, priceSummary);
    bidPricingTable.replaceData(aggregatedData);
};

export function updateTotalLaborHours() {
    const laborCostTable = Tabulator.findTable("#labor-cost")[0];
    let totalLaborHours = 0;
    laborCostTable.getData().forEach(row => {
        const labourHourStandard = row.Labour_Hour_Standard || 0; // Assuming default to 0 if value is not present
        const labourHeadcount = row.Labour_Headcount || 0; // Assuming default to 0 if value is not present
        const laborHoursForRow = labourHourStandard * labourHeadcount;
        totalLaborHours += laborHoursForRow;
    });
    console.log("totalLaborHours",totalLaborHours)
}