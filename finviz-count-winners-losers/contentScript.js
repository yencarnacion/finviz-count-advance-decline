function isApproximatelyZero(number, tolerance = 0.001) {
  return Math.abs(number) < tolerance;
}

function compareWith0style(percentage, targetNumber=0){
       if ( isApproximatelyZero(percentage)) {
           return('black');
        } else if (percentage > targetNumber) {
            return('green');
        } else {
            return('red');
        }
}

function boxQuartiles(d) {
    return [
        d3.quantile(d, .25), // lower quartile
        d3.quantile(d, .5),  // median
        d3.quantile(d, .75)  // upper quartile
    ];
}

// Table injection
// Function to create and update the table
function updateTable(aboveCount, belowCount, unchangedCount,
                     amazonValue,
                     appleValue,
                     googValue,
                     googlValue,
                     metaValue,
                     microsoftValue,
                     nvidiaValue,
                     maxChange,
                     minChange,
                     avgChange,
                     medianChange,
                     sdChange) {

    // d3
    let data = [];

    let spans = document.querySelectorAll('td.screener-tickers span');
    spans.forEach((span) => {
        let textContent = span.getAttribute('data-boxover');
        let percentageIndex = textContent.lastIndexOf(': ');
        let percentage = parseFloat(textContent.slice(percentageIndex + 2, -1));

        // Add percentage to changes array
        data.push(percentage);
    });
    
    var margin = {top: 5, right: 5, bottom: 20, left: 15},
	width = 150 - margin.left - margin.right,
	height = 100 - margin.top - margin.bottom;

    // append the svg object to the body of the page

    // Check if the box already exists
    let body = d3.select('body');  // Select the body

    var oldBox = document.getElementById("boxplot");

    if(oldBox)
	oldBox.remove();

    // Create a new svg element and set its id to 'boxplot'
    var svg = body
        .insert('svg', ':first-child')  // Insert svg as the first child of body
	.attr("id", "boxplot")
	.attr("width", width + margin.left + margin.right )
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending);
    
    var xScale = d3.scaleLinear()
	.domain([d3.min(data_sorted), d3.max(data_sorted)]) // input domain
	.range([0, width]); // output range

    var yScale = d3.scaleLinear()
	.domain([0, 1]) // input domain
	.range([height, 0]); // output range

// Append the x-axis
    var xAxis = svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));

    // Change the stroke color of the ticks and the axis line to white
    xAxis.selectAll('.tick line').attr('stroke', 'white');
    xAxis.selectAll('.domain').attr('stroke', 'white');

    // Change the fill color of the tick labels to white
    xAxis.selectAll('.tick text').attr('fill', 'white');

    var quartiles = boxQuartiles(data_sorted);

    var boxHeight = 50;
    var boxWidth = quartiles[2] - quartiles[0];

    var box = svg.append("rect")
	.attr("y", height/2 - boxHeight/2) 
	.attr("x", xScale(quartiles[0]))
	.attr("height", boxHeight)
        .attr("width", xScale(boxWidth) - xScale(0))
	.attr("fill", "#69b3a2");

    svg.append("line")
	.attr("y1", height / 2 - boxHeight / 2)
	.attr("x1", xScale(quartiles[1]))
	.attr("y2", height / 2 + boxHeight / 2)
	.attr("x2", xScale(quartiles[1]))
	.attr("stroke", "white")
	.attr("stroke-width", 2);

    var min = d3.min(data_sorted);
    var max = d3.max(data_sorted);

    // lower whisker
    svg.append("line")
	.attr("y1", height / 2)
	.attr("x1", xScale(min))
	.attr("y2", height / 2)
	.attr("x2", xScale(quartiles[0]))
	.attr("stroke", "white")
	.attr("stroke-width", 2);

    // upper whisker
    svg.append("line")
	.attr("y1", height / 2)
	.attr("x1", xScale(quartiles[2]))
	.attr("y2", height / 2)
	.attr("x2", xScale(max))
	.attr("stroke", "white")
	.attr("stroke-width", 2);

    // begin stocks of interest section
    let stocktable = document.getElementById('stockdataExtractorTable');

    if (!stocktable) {
	stocktable = document.createElement('table');
        stocktable.id = 'stockdataExtractorTable';
        stocktable.innerHTML = `
            <tr>
                <th>Symbol</th>
                <th>Change</th>
            </tr>
            <tr>
                <td>AMZN</td>
                <td id="amazonValue"></td>
            </tr>
            <tr>
                <td>AAPL</td>
                <td id="appleValue"></td>
            </tr>
            <tr>
                <td>GOOG</td>
                <td id="googValue"></td>
            </tr>
            <tr>
                <td>GOOGL</td>
                <td id="googlValue"></td>
            </tr>
            <tr>
                <td>META</td>
                <td id="metaValue"></td>
            </tr>
            <tr>
                <td>MSFT</td>
                <td id="microsoftValue"></td>
            </tr>
            <tr>
                <td>NVDA</td>
                <td id="nvidiaValue"></td>
            </tr>`;

	// Inject the table at the top of the body
        document.body.insertBefore(stocktable, document.body.firstChild);
    }

    
    let statstable = document.getElementById('statsExtractorTable');
    if (!statstable) {
        // If the table doesn't exist yet, create it
        statstable = document.createElement('table');
        statstable.id = 'statsExtractorTable';
	statstable.style.border = "1px solid white";

	statstable.innerHTML = `
        <tr style="border: 1px solid white;">
           <th style="border: 1px solid white;">Min</th> 
           <th style="border: 1px solid white;">Max</th>
           <th style="border: 1px solid white;">Avg</th>
           <th style="border: 1px solid white;">Median</th>
           <th style="border: 1px solid white;">q0</th> 
           <th style="border: 1px solid white;">q1</th> 
           <th style="border: 1px solid white;">q2</th> 
           <th style="border: 1px solid white;">Std Dev</th> 
        </tr>                                                                    
        <tr style="border: 1px solid white;">
           <td id="minChange" style="border: 1px solid white;"></td> 
           <td id="maxChange" style="border: 1px solid white;"></td>
           <td id="avgChange" style="border: 1px solid white;"></td>
           <td id="medianChange" style="border: 1px solid white;"></td>
           <td id="quartile0" style="border: 1px solid white;"></td>
           <td id="quartile1" style="border: 1px solid white;"></td>
           <td id="quartile2" style="border: 1px solid white;"></td>
           <td id="sdChange" style="border: 1px solid white;"></td>
        </tr>`;
	
    	document.body.insertBefore(statstable, document.body.firstChild);
    }
    
    let maxChangeCell = document.getElementById('maxChange');
    maxChangeCell.textContent = maxChange;
    
    let minChangeCell = document.getElementById('minChange');
    minChangeCell.textContent = minChange;
    
    let avgChangeCell = document.getElementById('avgChange');
    avgChangeCell.textContent = avgChange.toFixed(2);
    
    let medianChangeCell = document.getElementById('medianChange');
    medianChangeCell.textContent = medianChange;

    let q0Cell = document.getElementById('quartile0');
    q0Cell.textContent = quartiles[0].toFixed(2);
    
    let q1Cell = document.getElementById('quartile1');
    q1Cell.textContent = quartiles[1].toFixed(2);
        
    let q2Cell = document.getElementById('quartile2');
    q2Cell.textContent = quartiles[2].toFixed(2);
    
    let sdChangeCell = document.getElementById('sdChange');
    sdChangeCell.textContent = sdChange.toFixed(2);

    let table = document.getElementById('dataExtractorTable');
    if (!table) {
        // If the table doesn't exist yet, create it
        table = document.createElement('table');
        table.id = 'dataExtractorTable';
        table.innerHTML = `
            <tr>
                <th>Up</th>
                <th>Down</th>
                <th>Unchanged</th>
            </tr>
            <tr>
                <td id="aboveCount"></td>
                <td id="belowCount"></td>
                <td id="unchangedCount"></td>
            </tr>`;

    	document.body.insertBefore(table, document.body.firstChild);
    }

    // Update the counts and background colors
    let aboveCountCell = document.getElementById('aboveCount');
    aboveCountCell.textContent = aboveCount;
    aboveCountCell.style.backgroundColor = 'green';

    let belowCountCell = document.getElementById('belowCount');
    belowCountCell.textContent = belowCount;
    belowCountCell.style.backgroundColor = 'red';

    let unchangedCountCell = document.getElementById('unchangedCount');
    unchangedCountCell.textContent = unchangedCount;
    unchangedCountCell.style.backgroundColor = 'black';
    unchangedCountCell.style.color = 'white';  // to make the text visible on a black background

    let amznValueCell = document.getElementById('amazonValue');
    amznValueCell.textContent = amazonValue;
    amznValueCell.style.backgroundColor = compareWith0style(amazonValue);
    amznValueCell.style.color = 'white';  // to make the text visible on a black\

    let aaplValueCell = document.getElementById('appleValue');
    aaplValueCell.textContent = appleValue;
    aaplValueCell.style.backgroundColor = compareWith0style(appleValue);
    aaplValueCell.style.color = 'white';  // to make the text visible on a black\

    let googValueCell = document.getElementById('googValue');
    googValueCell.textContent = googValue;
    googValueCell.style.backgroundColor = compareWith0style(googValue);
    googValueCell.style.color = 'white';  // to make the text visible on a black\

    let googlValueCell = document.getElementById('googlValue');
    googlValueCell.textContent = googlValue;
    googlValueCell.style.backgroundColor = compareWith0style(googlValue);
    googlValueCell.style.color = 'white';  // to make the text visible on a black\

    let metaValueCell = document.getElementById('metaValue');
    metaValueCell.textContent = metaValue;
    metaValueCell.style.backgroundColor = compareWith0style(metaValue);
    metaValueCell.style.color = 'white';  // to make the text visible on a black\

    let msftValueCell = document.getElementById('microsoftValue');
    msftValueCell.textContent = microsoftValue;
    msftValueCell.style.backgroundColor = compareWith0style(microsoftValue);
    msftValueCell.style.color = 'white';  // to make the text visible on a black\

    let nvdaValueCell = document.getElementById('nvidiaValue');
    nvdaValueCell.textContent = nvidiaValue;
    nvdaValueCell.style.backgroundColor = compareWith0style(nvidiaValue);
    nvdaValueCell.style.color = 'white';  // to make the text visible on a black\

}

function getStockValues() {
  var elements = document.querySelectorAll('td.screener-tickers span');
  var stockData = {};

  elements.forEach(function(element) {
    var bodyText = element.getAttribute('data-boxover');
    if (bodyText) {
      var changeValue = bodyText.split('Change: ')[1].split('%')[0];
      var stockSymbol = element.textContent.trim();
      stockData[stockSymbol] = parseFloat(changeValue);
    }
  });

  return stockData;
}

function scrapeTableData() {

    let aboveCount = 0;
    let belowCount = 0;
    let unchangedCount = 0;
    
    const targetNumber = 0; // Replace this with the number you want to compare

    // Select all spans within the td element with the class 'screener-tickers'
    let spans = document.querySelectorAll('td.screener-tickers span');
    let changes = [];

    spans.forEach((span) => {
        let textContent = span.getAttribute('data-boxover');
        let percentageIndex = textContent.lastIndexOf(': ');
        let percentage = parseFloat(textContent.slice(percentageIndex + 2, -1));

        // Add percentage to changes array
        changes.push(percentage);
	
        // Log the percentage to the console
        // console.log(percentage);

	if ( isApproximatelyZero(percentage)) {
	    unchangedCount++;
        } else if (percentage > targetNumber) {
            aboveCount++;	   
        } else {
            belowCount++;
        }
    });

    // Sorting changes for further use
    changes.sort((a, b) => a - b);

    // Maximum, minimum and average
    let maxChange = changes[changes.length - 1];
    let minChange = changes[0];
    let avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;

    // Median
    let middle = Math.floor(changes.length / 2);
    let medianChange = changes.length % 2 !== 0 ? changes[middle] : (changes[middle - 1] + changes[middle]) / 2;

    // Standard Deviation
    let sdChange = Math.sqrt(changes.map(x => Math.pow(x - avgChange, 2)).reduce((a, b) => a + b) / changes.length);
    
    
    let stockData = getStockValues();
    
    let amazonValue = stockData['AMZN'];
    let appleValue = stockData['AAPL'];
    let googValue  = stockData['GOOG'];
    let googlValue  = stockData['GOOGL'];
    let metaValue = stockData['META'];
    let microsoftValue = stockData['MSFT'];
    let nvidiaValue = stockData['NVDA'];

    /*
    console.log('AboveCount: '+aboveCount);
    console.log('BelowCount: '+belowCount);
    console.log('UnchangedCount: '+unchangedCount);
    console.log('AMZN: ' + amazonValue);
    console.log('AAPL: ' + appleValue);
    console.log('GOOG: ' + googValue);
    console.log('GOOGL: ' + googlValue);
    console.log('META: ' + metaValue);
    console.log('MSFT: ' + microsoftValue);
    console.log('NVDA: ' + nvidiaValue);
    */		  
    // Send a message back to the background script with the counts
    chrome.runtime.sendMessage({
	aboveCount: aboveCount,
	belowCount: belowCount,
	unchangedCount: unchangedCount,
	amazonValue: amazonValue,
        appleValue:  appleValue,
        googValue: googValue,
        googlValue: googlValue,
        metaValue: metaValue,
        microsoftValue: microsoftValue,
        nvidiaValue: nvidiaValue,
        maxChange: maxChange,
        minChange: minChange,
        avgChange: avgChange,
        medianChange: medianChange,
        sdChange: sdChange
	
    });

    // Save the counts to the storage
    
    chrome.storage.sync.set({ aboveCount, belowCount, unchangedCount,
			      amazonValue,
			      appleValue,
                              googValue,
			      googlValue,
			      metaValue,
			      microsoftValue,
                              nvidiaValue,
			      maxChange,
			      minChange,
			      avgChange,
			      medianChange,
			      sdChange
			    });

    // Update the table
    updateTable(aboveCount, belowCount, unchangedCount,
                              amazonValue,
                              appleValue,
                              googValue,
                              googlValue,
                              metaValue,
                              microsoftValue,
                nvidiaValue,
		              maxChange,
                              minChange,
                              avgChange,
                              medianChange,
                sdChange
		
	       );
    
}
scrapeTableData();

// Set an interval to continuously scrape data
setInterval(scrapeTableData, 1000);  // adjust the interval time as necessary
console.log("contentScript.js is loaded!");
