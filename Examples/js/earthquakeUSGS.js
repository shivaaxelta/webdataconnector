(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Date",
            dataType: tableau.dataTypeEnum.String
        }, {
            id: "Voltage",
            alias: "Voltage",
            dataType: tableau.dataTypeEnum.Integer
        }, {
            id: "Current",
            alias: "Current",
            dataType: tableau.dataTypeEnum.Integer
        }, {
            id: "Hz",
            alias: "Hz",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.Integer
        }, {
            id: "Active",
            alias: "Active",
            columnRole: "dimension",
            // Do not aggregate values as measures in Tableau--makes it easier to add to a map 
            dataType: tableau.dataTypeEnum.Integer
        }];

        var tableSchema = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://aws.axelta.com/getSampleData?deviceNo=VW2117&nodeNo=002&limit=100&timeFrom=0&timeTo=0&hourAvg=null&sensorName=sensor_2&allData=null", function(resp) {
          //  var feat = resp.features,
                tableData = [];
				
				//Krishna
				//JSONArray respArray = resp;
				//JSONArray arr1 = respArray[0].getJSONArray();
				for(var k=0;k<arr1.length;k++){
					JSONObject obj = resp[0].getJSONArray().arr1[k].getJSONObject();
				   JSONObject jsonDataJsonObj =obj.getJSONObject("jsonData");
				   
				   tableData.push({
                    "Date": jsonDataJsonObj.VW_Date,
                    "Voltage": jsonDataJsonObj.voltage,
                    "Current": jsonDataJsonObj.current,
                    "Hz": jsonDataJsonObj.hz,
                    "Active": jsonDataJsonObj.active
                });
				   
				   
				   
				}
				
				
				
            // Iterate over the JSON object
           /* for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "Date": feat[i].id,
                    "Voltage": feat[i].properties.mag,
                    "Current": feat[i].properties.title,
                    "Hz": feat[i].geometry.coordinates[0],
                    "Active": feat[i].geometry.coordinates[1]
                });
            }
*/
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Solar panel demo"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
