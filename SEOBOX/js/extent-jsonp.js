/* current view */
var currentView = 0;

/* counts */
var totalTests, passedTests, failedTests, fatalTests, warningTests, errorTests, skippedTests, unknownTests;
var totalSteps, passedSteps, failedSteps, fatalSteps, warningSteps, errorSteps, infoSteps, skippedSteps, unknownSteps;

totalTests = $('div#testDataCount input#totalTests').val().replace(/,/g, "");
passedTests = $('div#testDataCount input#passedTests').val().replace(/,/g, "");
failedTests = $('div#testDataCount input#failedTests').val().replace(/,/g, "");
fatalTests = $('div#testDataCount input#fatalTests').val().replace(/,/g, "");
warningTests = $('div#testDataCount input#warningTests').val().replace(/,/g, "");
errorTests = $('div#testDataCount input#errorTests').val().replace(/,/g, "");
skippedTests = $('div#testDataCount input#skippedTests').val().replace(/,/g, "");
unknownTests = $('div#testDataCount input#unknownTests').val().replace(/,/g, "");
totalSteps = $('div#testDataCount input#totalSteps').val().replace(/,/g, "");
passedSteps = $('div#testDataCount input#passedSteps').val().replace(/,/g, "");
failedSteps = $('div#testDataCount input#failedSteps').val().replace(/,/g, "");
fatalSteps = $('div#testDataCount input#fatalSteps').val().replace(/,/g, "");
warningSteps = $('div#testDataCount input#warningSteps').val().replace(/,/g, "");
errorSteps = $('div#testDataCount input#errorSteps').val().replace(/,/g, "");
infoSteps = $('div#testDataCount input#infoSteps').val().replace(/,/g, "");
skippedSteps = $('div#testDataCount input#skippedSteps').val().replace(/,/g, "");
unknownSteps = $('div#testDataCount input#unknownSteps').val().replace(/,/g, "");
var data = [{
        value: parseInt(passedTests),
        color: '#00af00',
        highlight: '#32bf32',
        label: 'Pass'
    }, {
        value: parseInt(failedTests),
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'Fail'
    }, {
        value: parseInt(fatalTests),
        color: '#8b0000',
        highlight: '#a23232',
        label: 'Fatal'
    }, {
        value: parseInt(errorTests),
        color: '#ff6347',
        highlight: '#ff826b',
        label: 'Error'
    }, {
        value: parseInt(warningTests),
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'Warning'
    }, {
        value: parseInt(skippedTests),
        color: '#1e90ff',
        highlight: '#4aa6ff',
        label: 'Skip'
    }, {
        value: parseInt(unknownTests),
        color: '#222',
        highlight: '#444',
        label: 'Unknown'
    }];

var data1 = [{
        value: parseInt(passedSteps),
        color: '#00af00',
        highlight: '#32bf32',
        label: 'Pass'
    }, {
        value: parseInt(infoSteps),
        color: '#46BFBD',
        highlight: '#5AD3D1',
        label: 'Info'
    }, {
        value: parseInt(failedSteps),
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'Fail'
    }, {
        value: parseInt(fatalSteps),
        color: '#8b0000',
        highlight: '#a23232',
        label: 'Fatal'
    }, {
        value: parseInt(errorSteps),
        color: '#ff6347',
        highlight: '#ff826b',
        label: 'Error'
    }, {
        value: parseInt(warningSteps),
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'Warning'
    }, {
        value: parseInt(skippedSteps),
        color: '#1e90ff',
        highlight: '#4aa6ff',
        label: 'Skip'
    }, {
        value: parseInt(unknownSteps),
        color: '#222',
        highlight: '#444',
        label: 'Unknown'
    }];

/* fixed-containers */
var ct; // current page id
var chartHeight = 0;

var currentBrowserIE = detectIE();

$(function () {

    ct = $('#test-view');

    var timer = false;
    timer = setInterval(function () {
        _adjustSize();
    }, 200);

    $('._addedTable').mousemove(function () {
        _adjustSize();
    });

    if (currentBrowserIE != false) {
        $('._addedCell1').resizable({
            minWidth: 300,
            handles: "e"
        });
    } else {
        $('._addedCell1').css({
            'resize': 'horizontal'
        })
    }
    _adjustSize();
});


/* -- Check if current page is test or category -- */
function _updateCurrentStage(n) {
    currentView = n;

    if (n === -1) {
        $('body').removeClass('default');
        return;
    }

    $('body').addClass('default');

    window.scrollTo(0, 0);

    chartHeight = 0;

    if (n == 0) {
        ct = $('#test-view');

        setTimeout(function () {
            if ($('.charts').is(':visible'))
                chartHeight = 275;
        }, 200);
    } else if (n == 1)
        ct = $('#categories-view');
    else if (n == 2)
        ct = $('#exceptions-view');
    else
        return;

    var timer = setTimeout(function () {
        _adjustSize();
        clearTimeout(timer);
    }, 100);
}
/* -- Check if current page is test or category -- */

function _adjustSize() {
    ct.find('._addedTable').css({
        'height': ($(window).height() - 50 - chartHeight) + 'px'
    });

    ct.find('._addedCell1, ._addedCell2').css({
        'height': ($(window).height() - 50 - chartHeight) + 'px'
    });
    ct.find('._addedCell1 .contents, ._addedCell2 .contents').css({
        'height': ($(window).height() - 65 - chartHeight) + 'px'
    });

    if ($(window).width() < 992)
        ct.find('._addedCell2').css({
            'width': Math.round($(window).width() - 5 - ct.find('._addedCell1').width()) + 'px'
        });
    else
        ct.find('._addedCell2').css({
            'width': Math.round($(window).width() - 5 - ct.find('._addedCell1').width()) + 'px'
        });

}


function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


/* side-nav navigation [SIDE-NAV] */
$('.analysis').click(function () {
    $('body').addClass('hide-overflow');
    $('.container > .row').addClass('hide');

    var el = $(this);
    var cls = el.children('a').prop('class');

    $('#' + cls).removeClass('hide');

    if (cls == 'test-view') {
        if ($('#enableDashboard').hasClass('enabled') && $('#dashboard-view').hasClass('hide'))
            $('#enableDashboard').click().addClass('enabled');
    } else {
        if (cls == 'dashboard-view' || cls == 'testrunner-logs-view')
            $('body').removeClass('hide-overflow');

        // if any other view besides test-view, show all divs of dashboard-view
        $('#dashboard-view > div').removeClass('hide');

    }

    $('#slide-out > .analysis').removeClass('active');
    el.addClass('active');
});




/* view category info [CATEGORIES] */
$('.category-item').click(function (evt) {
    $('#cat-collection .category-item').removeClass('active');
    $('#cat-details-wrapper .cat-container').html('');

    var el = $(this).addClass('active').find('.cat-body').clone();
    $('#cat-details-wrapper .cat-name').text($(this).find('.category-name').text());
    $('#cat-details-wrapper .cat-container').append($(el));
});

/* category filter by status */
$('#cat-details-wrapper, #exception-details-wrapper').click(function (evt) {
    var t = $(evt.target);

    if (t.is('.exception-link') || t.is('.category-link')) {
        var id = t.attr('extentid');
        findTestByNameId(t.text().trim(), id);
    }

    if (t.is('.filter, .icon')) {
        if (t.hasClass('icon')) {
            t = t.parent();
        }

        var wrap = $('#cat-details-wrapper');

        /* push effect */
        $('#cat-details-wrapper .filter').removeClass('active')
        t.addClass('active');

        wrap.find('tbody > tr').removeClass('hide');

        if (t.hasClass('pass')) {
            wrap.find('tbody > tr:not(.pass)').addClass('hide');
        } else if (t.hasClass('fail')) {
            wrap.find('tbody > tr:not(.fail)').addClass('hide');
        } else {
            wrap.find('tbody > tr.fail, tbody > tr.pass').addClass('hide');
        }
    }
});




/* move up and down to browse tests */
$(window).keydown(function (e) {
    var target = null,
            sibling = null;

    (currentView === 0) && (target = $('li.test.displayed.active'), sibling = '.test.displayed');
    (currentView === 1) && (target = $('li.category-item.displayed.active'), sibling = '.category-item.displayed');
    (currentView === 2) && (target = $('li.exception-item.displayed.active'), sibling = '.exception-item.displayed');

    if (target !== null) {
        (e.which === 40) && target.nextAll(sibling).first().click();
        (e.which === 38) && target.prevAll(sibling).first().click();
    }
});

/* toggle steps by status in details container */
$('.step-filters').click(function (evt) {
    $('.details-container').find('tbody > tr').removeClass('displayed hide');

    var cls = $(evt.target).parent().attr('status');
    if (cls.indexOf('clear') < 0) {
        $('.details-container').find('tbody > tr').removeClass('displayed hide');

        $('.details-container td.status.' + cls).parent().addClass('displayed');
        $('.details-container tbody > tr').not('.displayed').addClass('hide');
    }
});

/* toggle search */
$('.mdi-action-search, .fa-search').click(function () {
    $(this).toggleClass('active');
    $('.validate').toggle();
    var s = $('.search > .input-field');
    s.animate({
        width: s.css('width') == '0px' ? '200px' : '0px'
    }, 200).toggleClass('enabled', 200);
});

/* filter tests by text in test and categories view */
$.fn.dynamicTestSearch = function (id) {
    var target = $(this);
    var searchBox = $(id);

    searchBox.off('keyup').on('keyup', function () {
        pattern = RegExp(searchBox.val(), 'gi');

        if (searchBox.val() == '') {
            target.removeClass('hide').addClass('displayed');
        } else {
            target.each(function () {
                var t = $(this);
                if (pattern.test(t.html())) {
                    t.removeClass('hide').addClass('displayed');
                } else {
                    t.removeClass('displayed').addClass('hide');
                }
            });
        }
    });

    return target;
}


/* clicking the category tag will automatically filter tests by category */
$('#test-details-wrapper').click(function (evt) {
    var el = $(evt.target);

    if (el.hasClass('category')) {
        var label = el.text();

        $('#category-toggle a').filter(
                function () {
                    return ($(this).text() == label);
                }).click();
    }
});

/* toggle steps by status in details container */
$('.step-filters').click(function (evt) {
    $('.details-container').find('tbody > tr').removeClass('displayed hide');

    var cls = $(evt.target).parent().attr('status');
    if (cls.indexOf('clear') < 0) {
        $('.details-container').find('tbody > tr').removeClass('displayed hide');

        $('.details-container td.status.' + cls).parent().addClass('displayed');
        $('.details-container tbody > tr').not('.displayed').addClass('hide');
    }
});

/* filter tests by status [TEST] */
$('#tests-toggle li').click(function () {
    if ($(this).hasClass('clear')) {
        resetFilters();
        return;
    }

    var opt = $(this).text().toLowerCase();
    var cat = $('#category-toggle li.active').text().toLowerCase().replace(/\./g, '').replace(/\#/g, '').replace(/ /g, '');

    $('#tests-toggle li').removeClass('active');
    $(this).addClass('active');
    $('.test, .node-list > li').addClass('hide').removeClass('displayed');

    if (cat != '') {
        $('#test-collection .category-assigned.' + cat).closest('.test.' + opt + ', .test:has(.test-node.' + opt + ')').removeClass('hide').addClass('displayed');
        $('.node-list > li.' + opt).removeClass('hide').addClass('displayed');
    } else {
        $('.test:has(.test-node.' + opt + '), .test.' + opt + ', .node-list > li.' + opt).removeClass('hide').addClass('displayed');
    }

    $('#test-view .tests-toggle > i').addClass('active');
    $('#test-collection .test.displayed').eq(0).click();

});

/* filter tests by category [TEST] */
$('#category-toggle li').click(function () {
    if ($(this).hasClass('clear')) {
        resetFilters();
        return;
    }

    var opt = $(this).text().toLowerCase().replace(/\./g, '').replace(/\#/g, '').replace(/ /g, '');
    var status = $('#tests-toggle li.active').text().toLowerCase();

    $('#category-toggle li').removeClass('active');
    $(this).addClass('active');
    $('.test').addClass('hide').removeClass('displayed');

    if (status != '') {
        $('#test-collection .category-assigned.' + opt).closest('.test.' + status + ', .test:has(.test-node.' + status + ')').removeClass('hide').addClass('displayed');
    } else {
        $('#test-collection .category-assigned.' + opt).closest('.test').removeClass('hide').addClass('displayed');
    }

    $('#test-view .category-toggle > i').addClass('active');
    $('.test.displayed').eq(0).click();

});

/* clear filters button */
$('#clear-filters').click(function () {
    resetFilters();
});

$(document).ready(function () {
    /* init */
    $('select').material_select();
    /* select the first category item in categories view by default */
    $('.category-item').eq(0).click();
    /* select the first test in test's view by default */
    $('.test').eq(0).click();
    /* bind the search functionality on Tests, Categories and Exceptions view */
    $('#test-collection .test').dynamicTestSearch('#test-view #searchTests');
    $('#cat-collection .category-item').dynamicTestSearch('#categories-view #searchTests');
    /* if only header row is available for test, hide the table [TEST] */
    $('.table-results').filter(function () {
        return ($(this).find('tr').length == 1);
    }).hide(0);
    $('.details-container .test-body .test-steps table.table-results').css('display', 'table');
    /*----- Charts   ----*/
    var ctx2 = $('#test-analysis').get(0).getContext('2d');
    var testChart = new Chart(ctx2).Doughnut(data, options);
    drawLegend(testChart, 'test-analysis');
    var ctx1 = $('#step-analysis').get(0).getContext('2d');
    var stepChart = new Chart(ctx1).Doughnut(data1, options);
    drawLegend(stepChart, 'step-analysis');
    $('li.analysis.waves-effect.active').click();
    var total = $('.total-tests .panel-lead').text();
    var passed = $('.t-pass-count').text();
    var percentage = Math.round((passed * 100) / (total));
    var pieData = [{
            value: percentage,
            color: "#3F9F3F",
            label: 'Passed'
        },
        {
            value: 100 - percentage,
            color: "#eceff5",
            label: 'Failed'
        }];
    var ctx = $('#percentage').get(0).getContext('2d');
    var stepChart1 = new Chart(ctx).Doughnut(pieData, options);
    drawLegend(stepChart1, 'percentage');
    $('ul.doughnut-legend').addClass('right');
    $('.pass-percentage.panel-lead').text(percentage + '%');
    $('#dashboard-view .determinate').attr('style', 'width:' + percentage + '%');
    /*----- Charts Ends  ----*/
//document.getElementById('tries').scrollIntoView()

});


/* action to perform when 'Clear Filters' option is selected [TEST] */
function resetFilters(cb) {
    $('.dropdown-content, .dropdown-content li').removeClass('active');
    $('.test, .node-list > li').addClass('displayed').removeClass('hide');
    $('#test-view .tests-toggle > i, #test-view .category-toggle > i').removeClass('active');
    if (cb) {
        cb();
    }
}

/* formats date in mm-dd-yyyy hh:mm:ss [UTIL] */
function formatDt(d) {
    return d.getFullYear() + '-' + ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2) + ':' + ('00' + d.getSeconds()).slice(-2);
}

/* finds test by its name and extentId [UTIL] */
function findTestByNameId(name, id) {
    $('.test').each(function () {
        var t = $(this);
        if (t.find('.test-name').text().trim() == name && t.attr('extentid') == id) {
            $('.analysis > .test-view').click();
            t.click();
            return;
        }
    });
}


/* dashboard chart options [DASHBOARD] */
var options = {
    segmentShowStroke: false,
    percentageInnerCutout: 55,
    animationSteps: 100,
    // String - Animation easing effect
    animationEasing: "easeOutBounce",
    // Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    // Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: true,
    legendTemplate: '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++) {%><li><%if(segments[i].label && segments[i].value){%><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%=segments[i].label%><%}%></li><%}%></ul>'
};



/* draw legend for test and step charts [DASHBOARD] */
function drawLegend(chart, id) {
    var helpers = Chart.helpers;
    var legendHolder = document.getElementById(id);
    legendHolder.innerHTML = chart.generateLegend();

    helpers.each(legendHolder.firstChild.childNodes, function (legendNode, index) {
        helpers.addEvent(legendNode, 'mouseover', function () {
            var activeSegment = chart.segments[index];
            activeSegment.save();
            activeSegment.fillColor = activeSegment.highlightColor;
            chart.showTooltip([activeSegment]);
            activeSegment.restore();
        });
    });
    Chart.helpers.addEvent(legendHolder.firstChild, 'mouseout', function () {
        chart.draw();
    });
    $('#' + id).after(legendHolder.firstChild);
}


var page = 0;
var limit = 1000;
var totalLogs = limit;
var id;
var testName;
/* view test info [TEST] */
$('.test').click(function () {
    var t = $(this);
    totalLogs = limit;
    page = 0;
    id = t.attr('extentid');
    testName = t.find('div.test-head span.test-name').text();
    page = parseInt($('#testDataCount #pageNo').val('0').val());
    $('#test-collection .test').removeClass('active');
    $('#test-details-wrapper .test-body').html('');
    var el = t.addClass('active').find('.test-body').clone();
    $('#test-details-wrapper .details-name').html(t.find('.test-name').html());
    $('#test-details-wrapper .details-container').append($(el));
    $('.details-container .test-body .test-steps table.table-results').css('display', 'table');

    $('.details-container #loadMore').bind('click', function () {
        if ($(this).attr('data-clickable') == 'true') {
            fetchResults();
        }
    });
    fetchResults();
});


//var host=$("div#testDataCount input#host").val();
//var port=parseInt($("div#testDataCount input#port").val().replace(/,/g, ""))+1000;
//var port=parseInt($("div#testDataCount input#port").val().replace(/,/g, ""))+1000;


function fetchResults() {
    $('.details-container #loadMore').html('<i class="material-icons left">loop</i> Loading Results...');
    $('.details-container #loadMore').attr('data-clickable', 'false');
    $('.details-container #loadMore').removeClass('hide');
    if (totalLogs < limit) {
        $('.details-container #loadMore').addClass('hide');
        return;
    }
   
     var url = 'http://10.207.16.9/SEOBOX/FetchResults?report=' + $('#testDataCount #report').val() + '&test_name=' + testName + '&limit=' + limit + '&skip=' + page;
    
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'jsonp',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.error(errorThrown);
        },
        success: function (result) {
            totalLogs = result.total_rows;
            page = page + limit;
            if (totalLogs < limit) {
                $('.details-container #loadMore').addClass('hide');
            }
            $('.details-container #loadMore').attr('data-clickable', 'true');
            $('.details-container #loadMore').html('Load More Results');
            $.each(result.rows, function (index, log) {
                //	log=$.parseJSON(log); <td><div class='status label capitalize "+log.status.toLowerCase()+"'>"+log.status+"</div></td>
				var d=log.status=='WARNING'? 'WARN':log.status;
                $('.details-container .test-body .test-steps table.table-results tbody').append('<tr></tr>');
                var ic = "<td class='status " + log.status.toLowerCase() + "' title='" + log.status + "' alt='" + log.status + "'><div class='status label capitalize " + log.status.toLowerCase() + "'>" + d + "</div></td><td class='timestamp'>" + log.time + "</td><td class='step-name'>" + log.step + "</td><td class='step-details'>" + log.detail + "</td>";
                $('.details-container .test-body .test-steps table.table-results >tbody >tr:last-child').html(ic);
            });
            initpageSpeedModal();
			initStructuredDataModal();
        }
    });
}
function initpageSpeedModal() {
    $('.modal-trigger').leanModal();
    $('a.googlePageSpeed').click(function () {
        var node = $('div#pageSpeedModal div.modal-content p');
        $(node).html('');
        $.ajax({
            url: 'http://10.207.16.9/SEOBOX/PageSpeedInsight?report=' + $('#testDataCount #report').val() + '&type=' + $(this).attr('data-type') + '&key=' + $(this).attr('data-key'),
            type: 'get',
            dataType: 'jsonp',
            crossDomain: true,
            jsonp: 'jsonp',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error(errorThrown);
            },
            success: function (result, text, response) {
                    $.each(result.data.pageStats, function (index, stat) {
                        $('div#pageSpeedModal div.modal-content #resources .left table').append('<tr></tr>');
                        var d = '<td>' + index + '</td><td>' + stat + '</td>';
                        $('div#pageSpeedModal div.modal-content #resources .left table tr:last-child').html(d);
                    });
                    drawResourceChart(result.data.pageStats);
					handlePassedData(result.data.passed);
					handleFailedData(result.data.failed);
					new jQueryCollapse($("#passedInsight, #shouldFix"), {
						query: 'div h6',
						show: function() {							
							this.slideDown(200);
						},
						hide: function() {
							this.slideUp(200);
						},
						accordion: true
					});
            }
        });        
    });
}

function handleFailedData(data){
	$('div#pageSpeedModal div.modal-content #shouldFix').html('');
	 $.each(data, function (index, stat) {
		$('div#pageSpeedModal div.modal-content #shouldFix').append('<div class="outer" id='+index+'><h6 class="google-heading">'+stat.localizedRuleName+'</h6><div class="google-info"><b>Summary: </b>'+stat.summary+'</br><b>Impact: </b>'+stat.ruleImpact+'</br></div></div>');
		if(stat.hasOwnProperty('urlBlocks')){
			$.each(stat.urlBlocks, function (index1, block) {
				$('div#pageSpeedModal div.modal-content #shouldFix #'+index+' .google-info').append('<b>Detail: </b>'+block.header+'</br>');
				if(block.hasOwnProperty('urls')){
					$('div#pageSpeedModal div.modal-content #shouldFix #'+index+' .google-info').append('<b>URLs Info: </b><ul></ul>');
					$.each(block.urls, function (index2, url) {
						$('div#pageSpeedModal div.modal-content #shouldFix #'+index+' .google-info ul').append('<li>'+url+'</li>');
					});
				}
			});
		}		
	 });
}

function handlePassedData(data){
	var node=$('div#pageSpeedModal div.modal-content #passedInsight');
	$(node).html('');
	 $.each(data, function (index, stat) {
		$('div#pageSpeedModal div.modal-content #passedInsight').append('<div class="outer"><h6 class="google-heading">'+stat.localizedRuleName+'</h6><div class="google-info"><b>Summary: </b>'+stat.summary+'</div></div>');
	 });
	
}


function drawResourceChart(stats) {
    var RESOURCE_TYPE_INFO = [
        {label: 'JavaScript', field: 'javascriptResponseBytes', color: 'e2192c'},
        {label: 'Images', field: 'imageResponseBytes', color: 'f3ed4a'},
        {label: 'CSS', field: 'cssResponseBytes', color: 'ff7008'},
        {label: 'HTML', field: 'htmlResponseBytes', color: '43c121'},
        {label: 'Flash', field: 'flashResponseBytes', color: 'f8ce44'},
        {label: 'Text', field: 'textResponseBytes', color: 'ad6bc5'},
        {label: 'Other', field: 'otherResponseBytes', color: '1051e8'},
    ];
    var labels = [];
    var data = [];
    var colors = [];
    var totalBytes = 0;
    var largestSingleCategory = 0;
    for (var i = 0, len = RESOURCE_TYPE_INFO.length; i < len; ++i) {
        var label = RESOURCE_TYPE_INFO[i].label;
        var field = RESOURCE_TYPE_INFO[i].field;
        var color = RESOURCE_TYPE_INFO[i].color;
        if (field in stats) {
            var val = Number(stats[field]);
            totalBytes += val;
            if (val > largestSingleCategory)
                largestSingleCategory = val;
            labels.push(label);
            data.push(val);
            colors.push(color);
        }
    }
    // Construct the query to send to the Google Chart Tools.
    var query = [
        'chs=300x140',
        'cht=p3',
        'chts=' + ['000000', 16].join(','),
        'chco=' + colors.join('|'),
        'chd=t:' + data.join(','),
        'chdl=' + labels.join('|'),
        'chdls=000000,14',
        'chp=1.6',
        'chds=0,' + largestSingleCategory,
    ].join('&');
    var src = 'http://chart.apis.google.com/chart?' + query;
    $('div#pageSpeedModal div.modal-content #resources .right img').attr('src', src);

}

function initStructuredDataModal(){
	$('.modal-trigger').leanModal();
    $('a.structureData').click(function () {
        var node = $('div#pageStructureModal div.modal-content p');
        $(node).html('');
        $.ajax({
            url: 'http://10.207.16.9/SEOBOX/StructuredData?report=' + $('#testDataCount #report').val() +'&key=' + $(this).attr('data-key'),
            type: 'get',
            dataType: 'jsonp',
            crossDomain: true,
            jsonp: 'jsonp',
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error(errorThrown);
            },
            success: function (result, text, response) {
                  $(node).html(result.data);  
            }
        });        
    });
}
