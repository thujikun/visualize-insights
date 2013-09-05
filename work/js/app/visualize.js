google.load('visualization', '1', {packages:['corechart']});

(function($) {

    $.fn.googlize = function() {
        var $this = $(this),
            texts = $this.text().split(''),
            colors = ['rgb(103, 122, 246)', 'rgb(194, 39, 45)', 'rgb(237, 190, 0)', 'rgb(98, 170, 0)'],
            colorIndex = 0,
            words = [];

        texts.forEach(function(text) {
            if(text.match(/\s/)) {
                words.push(text);
            } else {
                words.push('<span style="color: '+ colors[colorIndex++ % colors.length] +';">'+ text +'</span>');
            }
        });

        $this.html(words.join(''));
    };

    $(function() {

        $('h1').googlize();

        $(document).on('submit', '.search-form', function(e) {
            const INSIGHTS_API_URL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';

            var url = $(this).find('input[type="url"]').val(),
                query = $.param( {
                    url: url
                }),
                scoreElement = document.getElementsByClassName('score')[0],
                scoreClass = 'score',
                resultElement = document.getElementsByClassName('result')[0],
                impactChartElement = document.getElementById('performance-impact-chart'),
                childs = Array.prototype.slice.call(resultElement.childNodes);

            e.preventDefault();

            childs.forEach(function(child) {
                child.style.display = 'none';
            });

            $.ajax( {
                type: 'GET',
                url: INSIGHTS_API_URL + query,
                dataType: 'jsonp',
                crossDomain: true,
                success: function(response) {
                    console.log(response);
                    var ruleResults = response.formattedResults.ruleResults,
                        ruleResultKeys = Object.keys(ruleResults),
                        data = [],
                        options = {
                            backgroundColor: '#000000',
                            legend: {
                                textStyle: {
                                    color: '#ffffff'
                                }
                            }
                        },
                        chart,
                        sections = Array.prototype.slice.call(document.getElementsByTagName('section'));

                    scoreElement.innerText = response.score;
                    if(100 === response.score) {
                        scoreElement.className = scoreClass + ' perfect';
                    } else if(80 < response.score) {
                        scoreElement.className = scoreClass + ' high';
                    } else if(60 < response.score) {
                        scoreElement.className = scoreClass + ' middle';
                    } else {
                        scoreElement.className = scoreClass + ' low';
                    }

                    sections.forEach(function(section) {
                        section.style.display = 'block';
                    });

                    ruleResultKeys.forEach(function(key) {
                        data.push( [
                            ruleResults[key].localizedRuleName,
                            ruleResults[key].ruleImpact
                        ]);
                    });

                    data = google.visualization.arrayToDataTable(data);

                    chart = new google.visualization.PieChart(impactChartElement);
                    chart.draw(data, options);

                }
            });

        });

    });
}(Zepto));