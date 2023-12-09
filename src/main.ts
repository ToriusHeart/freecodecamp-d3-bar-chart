import './style.css'
import * as d3 from "d3"

const margin = {top: 20, right: 50, bottom: 90, left: 50};
const w = 800;
const h = 430;

type DataType = [dataDate: string, dataGdp: number];

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then((response) => response.json())
  .then(data => {
    const dataset: DataType[]= data.data;
    //Declaring date array and related min/max explicitly
    const datasetDates : string[] = dataset.map((d: DataType) => d[0]);
    const minDate = d3.min(datasetDates);
    const maxDate = d3.max(datasetDates);
    //Same for GDP array
    const datasetGdp: number[] = dataset.map(d => d[1]);
    const maxGdp = d3.max(datasetGdp);
    //Declaring SVG parameters
    const svg = d3.select("#chart")
                  .attr("width", w + margin.left + margin.right)
                  .attr("height", h + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //Declaring scales
    const xScale = d3.scaleTime()
                      .domain([new Date(minDate!), new Date(maxDate!)])
                      .range([0, w]);
    const yScale = d3.scaleLinear()
                      .domain([0, maxGdp!])
                      .range([h, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    //Appending axises
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);
    //Adding bars and related tooltips
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d  => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", w / dataset.length)
        .attr("height", d => h - yScale(d[1]))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

        const tooltip = d3.select("#tooltip");
        //Tooltip related f
        function showTooltip(event: MouseEvent, d : DataType) {
          const year = d[0].substring(0, 4);
          let quarter;
          let temp = d[0].substring(5, 7);
          switch(temp) {
            case "01":
              quarter = "Q1";
              break;
            case "04":
              quarter = "Q2";
              break;
            case "07":
              quarter = "Q3";
              break;
            case "10":
              quarter = "Q4";
              break;
          }
          tooltip.style("display", "block")
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 30) + "px")
                  .attr("data-date", d[0])
                  .html(`${year} ${quarter}<br>\$${d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} Billion`)
        }
        function hideTooltip() {
          tooltip.style("display", "none")
        }
        //Finally appending the info text
        svg.append("text")
            .attr("class", "info")
            .attr("x", w - 455)
            .attr("y", h + margin.bottom - 30)
            .style("text-align", "right")
            .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
  })

