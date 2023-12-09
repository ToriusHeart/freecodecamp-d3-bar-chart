import './style.css'
import * as d3 from "d3"
/*document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="main">
    <>
  </div>
`*/

const margin = {top: 20, right: 50, bottom: 90, left: 50};
const w = 800;
const h = 430;

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then((response) => response.json())
  .then(data => {
    const dataset = data.data;
    const svg = d3.select("#chart")
                  .attr("width", w + margin.left + margin.right)
                  .attr("height", h + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xScale = d3.scaleTime()
                      .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
                      .range([0, w]);
    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset, d => d[1])])
                      .range([h, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);
    
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

        function showTooltip(event, d) {
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

        svg.append("text")
            .attr("x", w - 455)
            .attr("y", h + margin.bottom - 30)
            .style("text-align", "right")
            .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
  })

