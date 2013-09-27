google.load('visualization', '1', {packages:['corechart']});

(function() {

    /**
     * @class util
     * utility methods
     */
    var util = Object.create(Object.prototype, {
        obj2Arr: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member util
             * @method obj2Arr
             * change object like array to native array
             * @param {Object} obj object like array
             * @return {Array} native array
             */
            value: function(obj) {
                return Array.prototype.slice.call(obj);
            }
        },

        obj2Query: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member util
             * @method obj2Query
             * change object like array to native array
             * @param {Object} obj object like array
             * @return {Array} native array
             */
            value: (function(obj) {
                var keys = Object.keys(obj),
                    query = [];

                keys.forEach(function(key) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
                });

                return query.join('&');
            })
        },

        googlize: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member util
             * @method googlize
             * change string color like google
             * @param {Object} DOM object
             */
            value: function(element) {
                var texts = element.innerText.split(''),
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

                element.innerHTML = (words.join(''));
            }
        },

        process: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member util
             * @class util.process
             * manage processing functions
             */
            value: {

                /**
                 * @member util.process
                 * @property {Object} element loading DOM
                 */
                element: document.getElementById('loading'),

                /**
                 * @member util.process
                 * @property {Boolean} processing processing flag
                 */
                processing: false,

                /**
                 * @member util.process
                 * @method set
                 * is processing
                 * @return {Boolean} check processing
                 */
                is: function() {
                    return this.processing;
                },

                /**
                 * @member util.process
                 * @method on
                 * processing on
                 */
                on: function() {
                    this.processing = true;
                    this.element.style.display = 'block';
                },

                /**
                 * @member util.process
                 * @method off
                 * processing off
                 */
                off: function() {
                    this.processing = false;
                    this.element.style.display = 'none';
                }
            }
        }

    });

    /**
     * @class SocketManager
     * manage socket.io
     * @param {String} url socket.io server url
     */
    var SocketManager = function() {
        this.init.apply(this, arguments);
    };

    Object.defineProperties(SocketManager.prototype, {

        /**
         * @member SocketManager
         * @method init
         * SocketManager constructor
         * @param {String} url url of websocket
         */
        init: {
            writable : true,
            enumerable : false,
            configurable : false,
            value: function(url) {
                this.socket = io.connect(url);
            }
        },

        /**
         * @member SocketManager
         * @method on
         * observe server send event
         * @param {String} channel channel name
         * @param {Function} fn callback from server send event
         */
        on: {
            writable : true,
            enumerable : false,
            configurable : false,
            value: function(channel, fn) {
                this.socket.on(channel, fn);
            }
        },

        /**
         * @member SocketManager
         * @method send
         * send message to server
         * @param {String} channel channel name
         * @param {message} message parameter to server
         */
        send: {
            writable : true,
            enumerable : false,
            configurable : false,
            value: function(channel, message) {
                this.socket.emit(channel, message);
            }
        }
    });

    /**
     * @class insightsVisualizer
     * visualize pagespeed insights result
     */
    var insightsVisualizer = Object.create(Object.prototype, {
        CONST: {
            writable : false,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @property {Object} CONST constants of insightsVisualizer
             * @property {String} CONST.INSIGHTS_API_URL insight API URL
             * @property {String} CONST.SCORE_CLASS score element class name
             */
            value: {
                INSIGHTS_API_URL: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?',
                SCORE_CLASS: 'score '
            }
        },

        socket: {
            writable : false,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @property {Object} socket socket.io manager instance
             */
            value: new SocketManager('/')
        },

        channels: {
            writable : false,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @property {Object} channels socket.io channel Info
             * @property {String} channels.get get insights result channel
             * @property {String} channels.set set insights result channel
             */
            value: {
                get: 'getInsightsResult',
                set: 'setInsightsResult'
            }
        },

        analyzePerformance: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @method analyzePerformance
             * execute pagespeed insight API
             * @param {Object} e Event object
             */
            value: function(e) {
                var that = this,
                    url = e.currentTarget.querySelector('input[type="url"]').value,
                    type = e.currentTarget.querySelector('input[type="radio"]:checked').value,
                    strategy = type === '1'? 'mobile': 'desktop',
                    query = util.obj2Query( {
                        url: url,
                        strategy: strategy,
                        locale: 'ja'
                    }),
                    resultElement = document.getElementsByClassName('result')[0],
                    childs = util.obj2Arr(resultElement.childNodes),
                    xhr = new XMLHttpRequest();

                e.preventDefault();

                if(util.process.is()) return;

                util.process.on();

                childs.forEach(function(child) {
                    child.style.display = 'none';
                });

                xhr.open('GET', this.CONST.INSIGHTS_API_URL + query, true);
                xhr.responseType = 'JSON';
                xhr.onload = function() {
                    var result = JSON.parse(this.responseText);

                    util.process.off();

                    if(this.status === 200) {
                        insightsVisualizer.socket.send(that.channels.set, result);
                        insightsVisualizer.visualizeInsightsResult(result);
                    } else {
                        alert('error');
                    }
                };
                xhr.send();
            }
        },

        visualizeInsightsResult: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @method visualizeInsightsResult
             * callback of pagespeed insight API
             * @param {Object} response API response
             */
            value: function(response) {
                console.log(response);

                var ruleResults = response.formattedResults.ruleResults,
                    sections = util.obj2Arr(document.getElementsByTagName('section')),
                    scoreElement = document.getElementsByClassName('score')[0],
                    data;

                sections.forEach(function(section) {
                    section.style.display = 'block';
                });

                //render score
                scoreElement.innerText = response.score;
                scoreElement.className = this.CONST.SCORE_CLASS + this.gradeScore(response.score);

                // render impact chart
                data = this.getImpactChartData(ruleResults);
                this.renderChart('pie', data, document.getElementById('performance-impact-chart'));

            }
        },

        gradeScore: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @method gradeScore
             * devide grade rank by score
             * @param {Number} score performance score
             * @return {String} grade rank
             */
            value: function(score) {
                var rank = '';

                if(100 === score) {
                    rank = 'perfect';
                } else if(80 < score) {
                    rank = 'high';
                } else if(60 < score) {
                    rank = 'middle';
                } else {
                    rank = 'low';
                }

                return rank;
            }
        },

        getImpactChartData: {
            writable : true,
            enumerable : false,
            configurable : false,
            /**
             * @member insightsVisualizer
             * @method getImpactChartData
             * make data for impact chart from insight result
             * @param {Object} ruleResults insight result
             * @return {Object} data for impact chart data
             */
            value: function(ruleResults) {
                var ruleResultKeys = Object.keys(ruleResults),
                    data = [];

                ruleResultKeys.forEach(function(key) {
                    data.push( [
                        ruleResults[key].localizedRuleName,
                        ruleResults[key].ruleImpact
                    ]);
                });

                return google.visualization.arrayToDataTable(data);
            }
        },

        /**
         * @member insightsVisualizer
         * @method renderChart
         * render chart from data
         * @param {String} type chart type
         * @param {Object} data data for chart
         * @param {Object} element DOM element of chart
         */
        renderChart: {
            writable : true,
            enumerable : false,
            configurable : false,
            value: function(type, data, element) {
                var chart,
                    options = {
                        backgroundColor: '#000000',
                        legend: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    };

                switch(type) {
                    case 'pie':
                        chart = new google.visualization.PieChart(element);
                        break;
                }

                chart.draw(data, options);
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        util.googlize(document.getElementsByTagName('h1')[0]);
        document.getElementsByClassName('search-form')[0].addEventListener('submit', insightsVisualizer.analyzePerformance.bind(insightsVisualizer), false);
    }, false);

}());