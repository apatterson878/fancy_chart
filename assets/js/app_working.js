// const
// svgWidth = 650,
// svgHeight = 450;

const
svgWidth = 650,
svgHeight = 450;

const margin = {
top: 20,
right: 40,
bottom: 80,
left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


let chosenXAxis = "poverty";
let chosenYAxis = "obesity";

//////////////////////////////////////////////////////////////////////////////

function xScale(CensusData, chosenXAxis) {
// create scales
var xLinearScale = d3.scaleLinear()
.domain([d3.min(CensusData, d => d[chosenXAxis]) ,
d3.max(CensusData, d => d[chosenXAxis]) 
])
.range([0, width])

return xLinearScale;

}

function yScale(CensusData, chosenYAxis) {
// create scales
var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(CensusData, d => d[chosenYAxis])
    ])
    .range([height, 0]);


return yLinearScale

}

//////////////////////////////////////////////////////////////////////////////
function renderYAxes(newYScale, yAxis) {
const leftAxis = d3.axisLeft(newYScale);

yAxis.transition()
.duration(1000)
.call(leftAxis);

return yAxis;
}

function renderXAxes(newXScale, xAxis) {
const bottomAxis = d3.axisBottom(newXScale);

xAxis.transition()
.duration(1000)
.call(bottomAxis);

return xAxis;
}


//////////////////////////////////////////////////////////////////////////////

function renderCirclesY(circlesGroupY, newYScale, chosenYaxis) {

circlesGroupY.transition()
.duration(1000)
.attr("cy", d => newYScale(d[chosenYAxis]));

return circlesGroupY;
}

function renderCirclesX(circlesGroupX, newXScale, chosenXaxis,) {

circlesGroupX.transition()
.duration(1000)
.attr("cx", d => newXScale(d[chosenXAxis]));
return circlesGroupX;
}

//////////////////////////////////////////////////////////////////////////////


function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {
    let label  = "";
    let label2 = "";
    let label3 = "";

//////////////////////////////////////////////////////////////////////////////
if (chosenXAxis === "poverty") {
label = "Poverty: ";
label2= "%"
}
if (chosenXAxis === "age") {
label = "Median Age: ";
label2= ""
}
if (chosenXAxis === "income") {
label = "Household Income (Median): ";
label2= " "
}

if (chosenYAxis === "obesity") {
label3 = "Obese: ";
label4= "%"
}
if (chosenYAxis === "smokes") {
label3 = "Smokes: ";
label4= "%"
}
if (chosenYAxis === "healthcare") {
label3 = "Lacks Healthcare: ";
label4= "%"
}

//////////////////////////////////////////////////////////////////////////////
const toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([80, -60])
.html(function(d) {
    return (`<center>${d.state}</center>${label}${d[chosenXAxis]}${label2}<br>${label3}${d[chosenYAxis]}${label4}`);
});

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(data) {
toolTip.show(data, this);
})
// onmouseout event
.on("mouseout", function(data, index) {
toolTip.hide(data, this);
});



return circlesGroup;
}

//////////////////////////////////////////////////////////////////////////////

(async function(){

const CensusData = await d3.csv("data.csv");


CensusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.income = +data.income;
    
});

let xLinearScale = xScale(CensusData, chosenXAxis);
let yLinearScale = yScale(CensusData, chosenYAxis);

const bottomAxis = d3.axisBottom(xLinearScale);
const leftAxis = d3.axisLeft(yLinearScale);


chartGroup.selectAll("text")
      .data(CensusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => d.abbr)
      .attr("class", "stateText")
      




//////////////////////////////////////////////////////////////////////////////

let yAxis = chartGroup.append("g")
    .call(leftAxis);

let xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


//////////////////////////////////////////////////////////////////////////////



let circlesGroup = chartGroup.selectAll("circle")
    .data(CensusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 8)
    .attr("class", "stateCircle")
    

    

const labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

const labelsGroupY = chartGroup.append("g")
    
circlesGroup.selectAll("text")
      .data(CensusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(d => d.abbr)
      .style("font-size", "9px")

//////////////////////////////////////////////////////////////////////////////

const povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

const ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

const incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

//////////////////////////////////////////////////////////////////////////////

const obeseLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", ((0 - margin.left)))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

const smokeLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", ((0 - margin.left)+20))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

const healthcareLabel = labelsGroupY.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", ((0 - margin.left)+40))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");


//////////////////////////////////////////////////////////////////////////////

circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

let value = chosenXAxis
let valueY = chosenYAxis

labelsGroup.selectAll("text")
.on("click", function() {
// get value of selection
value = d3.select(this).attr("value");
if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;
    

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(CensusData, chosenXAxis);

    // updates x axis with transition
    xAxis = renderXAxes(xLinearScale, xAxis);

    
    circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
    

    // updates tooltips with new info
    // circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "age") {
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);

    }
    if (chosenXAxis === "income") {
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
    if (chosenXAxis === "poverty") {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }

}

});

labelsGroupY.selectAll("text")
.on("click", function() {
// get value of selection
valueY = d3.select(this).attr("value");
if (valueY !== chosenYAxis) {

    
    chosenYAxis = valueY;
    

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(CensusData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
    
    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenYAxis === "obesity") {
        obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        smokeLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);

    }
    if (chosenYAxis === "smokes") {
        smokeLabel
            .classed("active", true)
            .classed("inactive", false);
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
    if (chosenYAxis === "healthcare") {
        healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        smokeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
}


    });
})()