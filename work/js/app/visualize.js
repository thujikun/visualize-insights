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

            var url = $(this).find('input[type="url"]').val();
            var query = $.param( {
                url: url
            });

            e.preventDefault();

            $.ajax( {
                type: 'GET',
                url: INSIGHTS_API_URL + query,
                dataType: 'jsonp',
                crossDomain: true,
                success: function(response) {
                    console.log(response);
                    var results = response.formattedResults.ruleResults,
                        resultKeys = Object.keys(results),
                        data = [['Task', 'Hours per Day']],
                        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
                        options = {
                            backgroundColor: '#000000',
                            legend: {
                                textStyle: {
                                    color: '#ffffff'
                                }
                            }
                        },
                        chartData,
                        chart;

                    document.getElementById('performance-impact').style.display = 'block';

                    resultKeys.forEach(function(key) {
                        data.push( [
                            results[key].localizedRuleName,
                            results[key].ruleImpact
                        ]);
                    });

                    data = google.visualization.arrayToDataTable(data);

                    chart = new google.visualization.PieChart(document.getElementById('performance-impact-chart'));
                    chart.draw(data, options);

                }
            });

        });

    });
}(Zepto));