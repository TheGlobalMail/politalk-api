var app = {};

var parties = [
  {name: 'Australian Democrats', colour: '#fd8d3c'},
  {name: 'Australian Greens', colour: '#31a354'},
  {name: 'Australian Labor Party', colour: '#d62728'},
  {name: 'Country Liberal Party', colour: '#9ecae1'},
  {name: 'Democratic Labor Party', colour: '#ff9896'},
  {name: 'Family First Party', colour: '#fdd0a2'},
  {name: 'Independent', colour: '#d9d9d9'},
  {name: 'Liberal Party', colour: '#3182bd'},
  {name: 'National Party', colour: '#bcbddc'}
];

var partyColours = d3.scale.ordinal()
  .domain(_.pluck(parties, 'name'))
  .range(_.pluck(parties, 'colour'));

app.terms = [];
app.data = [];

$(function(){
  loadData();
});

function loadData(){

  app.terms = [];
  app.complete = [];
  _.each(_.range(4), function(index){
    var n = index + 1;
    var keyword = getURLParameter('q' + n);
    var complete = getURLParameter('c' + n);
    if (keyword && keyword.match(/\w/)){
      app.terms.push(keyword);
      $('input[name="q'+ app.terms.length +'"]').val(keyword);
      app.complete.push(complete);
      $('input[name="c'+ app.complete.length +'"]').prop('checked', !!complete);
    }
  });

  // TODO bulk load this perhaps
  $.getJSON('http://localhost:8080/api/weeks', function(data){
    app.weeks = data;
    app.weeksIndex = _.object(data, _.range(data.length));

    async.map(_.zip(app.terms, app.complete), function(termInfo, done){
      $.getJSON('http://localhost:8080/api/wordchoices/term/' + termInfo[0], {c: termInfo[1]}, function(data){
        done(null, data);
      });
    }, function(err, results){
      app.data = results;
      renderCharts();
    });
  });
}

function renderCharts(){
  var margin = {top: 10, right: 10, bottom: 10, left: 60};
  var width = 900 - margin.left - margin.right;
  var individualChartHeight = 150;
  var height = individualChartHeight - margin.top - margin.bottom;
  var options = {
    margin: margin,
    width: width,
    height: height
  };

  app.charts = [];

  var svg = d3.select("#chart-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", individualChartHeight * app.terms.length);

  // set up axis

  _.each(app.terms, function(term, i){
    options.index = i;
    if (!app.data[i].length){
      $('#chart-container').append('<strong style="margin-left:40px">No mentions of ' + term + " found. Try again</strong><br />");
    }else{
      renderChart(svg, options, term, app.data[i]);
    }
  });

  renderLegend();
}

function renderLegend(){
  var $legend = $('#legend tbody');
  _.each(parties, function(party){
    $legend.append('<tr>' +
      '<td>' + party.name + '</td>' +
      '<td style="background-color:'+party.colour+';width:60px;height:1.2em;">&nbsp;</td>' +
      '</tr>'
    );
  });
}

function getURLParameter(name){
  return decodeURIComponent(
    (RegExp(name + '=' + '([^&$#]+)').exec(location.search)||['',''])[1]
  ).replace(/\+/g, ' ');
}


function renderChart(svg, extraOptions, term, termData){
  var series = prepareSeries(termData);
  var max = findMax(series);
  var id = idFromTerm(term);
  var options = {id: id, svg: svg, series: series, max: max, term: term};
  options = _.extend(options, extraOptions);
  var chart = new Chart(options);
  app.charts.push(chart);
}

function prepareSeries(data){
  var series = [];
  var party = {};
  _.each(data, function(datum){
    if (datum.party !== party.name){
      if (party.name) series.push(party);
      party = {name: datum.party, data: []};
    }
    var weeksIndex = app.weeksIndex[datum.week];
    party.data.push({x: weeksIndex, y: datum.freq});
    lastWeekIndex = weeksIndex;
  });

  if (party.name) series.push(party);
  _.each(series, function(partyData){
    var filledSeries = [];
    var xPoints = _.pluck(partyData.data, 'x');
    _.each(app.weeks, function(week){
      var weekIndex = app.weeksIndex[week];
      var matchingIndex = xPoints.indexOf(weekIndex);
      if (matchingIndex === -1){
        filledSeries.push({x: weekIndex, y: 0});
      }else{
        filledSeries.push(partyData.data[matchingIndex]);
      }
    });
    partyData.data = filledSeries;
  });
  return series;
}

function findMax(series){
  var stackedYValues = [];
  _.each(series, function(party){
    _.each(party.data, function(datum, i){
      if (stackedYValues.length < i + 1){
        stackedYValues.push(datum.y);
      }else{
        stackedYValues[i] += datum.y;
      }
    });
  });
  return _.max(stackedYValues);
}

function idFromTerm(term){
  return term.toLowerCase().replace(/^\s/g, '_');
}

function Chart(options){
  this.options = options;
  this.svg = this.options.svg;
  this.series = this.options.series;
  this.id = this.options.id;
  this.chartContainer = this.svg.append("g")
    .attr('class','chart-' + this.options.index)
    .attr("transform", "translate(" + this.options.margin.left + "," + (this.options.height + 10) * this.options.index + ")");
  this.renderAxes();
  this.renderArea();
  this.renderTitle();
}

Chart.prototype.renderAxes = function(){
  this.xScale = d3.scale.ordinal()
    .rangeBands([0, this.options.width])
    .domain(app.weeks);
  this.yScale = d3.scale.linear()
    .range([this.options.height, 0])
    .domain([0, this.options.max]);

  this.xAxisTop = d3.svg.axis().scale(this.xScale).orient("bottom");
  this.xAxisBottom = d3.svg.axis().scale(this.xScale).orient("top");

  if(this.options.index === 0){
    this.chartContainer.append("g")
      .attr("class", "x axis top")
      .attr("transform", "translate(0,0)")
      .call(this.xAxisTop);
  }
  if (this.options.index === (app.terms.length - 1)){
    this.chartContainer.append("g")
      .attr("class", "x axis bottom")
      .attr("transform", "translate(0," + this.options.height + ")")
      .call(this.xAxisBottom);
  }
  this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").ticks(5);
  this.chartContainer.append("g")
    .attr("class", "y axis")
    //.attr("transform", "translate(-15,0)")
    .call(this.yAxis);
};

Chart.prototype.renderArea = function(){
  var xS = this.xScale;
  var yS = this.yScale;
  var area = this.area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return xS(d.x); })
    .y0(function(d){ return yS(d.y0); })
    .y1(function(d) { return yS(d.y0 + d.y); });
  this.stack = d3.layout.stack()
        .values(function(d) { 
          return d.data;
        });
  this.parties = this.stack(this.series);
  this.party = this.chartContainer.selectAll(".party-" + this.id)
    .data(this.parties)
    .enter().append("g")
    .attr("class", "party-" + this.id);
  this.party.append("path")
    .attr("class", "area-" + this.id)
    .attr("transform", "translate(0,0)")
    .attr("d", function(d) {
      var r = area(d.data); 
      return r;
    })
    .style("fill", function(d) { return partyColours(d.name); });
};

Chart.prototype.renderTitle = function(){
  this.chartContainer.append("text")
    .attr("class","graph-title")
    .attr("transform", "translate(15,15)")
    .text(this.options.term);
};
