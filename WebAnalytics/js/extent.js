/* current view */
var currentView = 0;

/* counts */
var totalTests, passedTests, failedTests, fatalTests, warningTests, errorTests, skippedTests, unknownTests;
var totalSteps, passedSteps, failedSteps, fatalSteps, warningSteps, errorSteps, infoSteps, skippedSteps, unknownSteps;

/* global chart instance vars */
var testChart, stepChart;

function hideElement(el) {
    el.removeClass('displayed').addClass('hide');
}

function showElement(el) {
    el.addClass('displayed').removeClass('hide');
}

/* fixed-containers */
var ct; // current page id
var chartHeight = 0;

var currentBrowserIE = detectIE();

$(function() {

    ct = $('#test-view');

    var timer = false;
    timer = setInterval(function() {
        _adjustSize();
    }, 200);

    $('._addedTable').mousemove(function() {
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


/* -- Check if current page is test or category --*/
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

        setTimeout(function() {
            if ($('.charts').is(':visible')) chartHeight = 275;
        }, 200);
    } else if (n == 1) ct = $('#categories-view');
    else if (n == 2) ct = $('#exceptions-view');
    else return;

    var timer = setTimeout(function() {
        _adjustSize();
        clearTimeout(timer);
    }, 100);
}
/* -- Check if current page is test or category --*/

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

    if ($(window).width() < 992) ct.find('._addedCell2').css({
        'width': Math.round($(window).width() - 5 - ct.find('._addedCell1').width()) + 'px'
    });
    else ct.find('._addedCell2').css({
        'width': Math.round($(window).width() - 0 - 18 - ct.find('._addedCell1').width()) + 'px'
    });

    _restrictSize();
}

function _restrictSize() {
    var cell = ct.find('._addedCell1');
    if (cell.width() > Math.round($(window).width() * 0.6)) {
        cell.css({
            'width': Math.round($(window).width() * 0.6) + 'px'
        });
        _adjustSize();
    }
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
/* /fixed-containers */

/* sidenav toggle */
$('.button-collapse > i').click(function() {
    $('.side-nav').toggleClass('hide-on-med-and-down');
});

/* theme selector */
$('.theme-selector').click(function() {
    $('body').toggleClass('dark');
});

/* enable dashboard checkbox [TOPNAV] */
$('#enableDashboard').click(function() {
    var t = $(this);
    t.toggleClass('enabled enabled darken-3 darken-4 blue grey').children('i').toggleClass('active');
    $('#dashboard-view').toggleClass('hide').children('div').toggleClass('hide').siblings('.charts').toggleClass('hide');
    t.hasClass('enabled') ? redrawCharts() : null;

    setTimeout(function() {
        _updateCurrentStage(0);
    }, 200);
});

/* enable dashboard checkbox [TOPNAV] */
$('#refreshCharts').click(function() {
    $(this).toggleClass('enabled enabled darken-3 darken-4 blue grey').children('i').toggleClass('active');
});

/* side-nav navigation [SIDE-NAV] */
$('.analysis').click(function() {
    $('body').addClass('hide-overflow');
    $('.container > .row').addClass('hide');

    var el = $(this);
    var cls = el.children('a').prop('class');

    $('#' + cls).removeClass('hide');

    if (cls == 'test-view') {
        if ($('#enableDashboard').hasClass('enabled') && $('#dashboard-view').hasClass('hide')) $('#enableDashboard').click().addClass('enabled');
    } else {
        if (cls == 'dashboard-view' || cls == 'testrunner-logs-view') $('body').removeClass('hide-overflow');

        // if any other view besides test-view, show all divs of dashboard-view
        $('#dashboard-view > div').removeClass('hide');

        if (cls == 'dashboard-view') {
            redrawCharts();
        }
    }

    $('#slide-out > .analysis').removeClass('active');
    el.addClass('active');
});

/* test-dashboard settings [DASHBOARD] */
$('#dashboard-view .test-count-setting').click(function() {
    $('#test-count-setting').openModal();
});

/* step-dashboard settings [DASHBOARD] */
$('#dashboard-view .step-status-filter').click(function() {
    $('#step-status-filter').openModal();
});

/* refresh charts when chart setting is saved */
$('.modal-footer').click(function() {
    redrawCharts();
});

/* view category info [CATEGORIES] */
$('.category-item').click(function(evt) {
    $('#cat-collection .category-item').removeClass('active');
    $('#cat-details-wrapper .cat-container').html('');

    var el = $(this).addClass('active').find('.cat-body').clone();
    $('#cat-details-wrapper .cat-name').text($(this).find('.category-name').text());
    $('#cat-details-wrapper .cat-container').append($(el));
});

/* category filter by status */
$('#cat-details-wrapper, #exception-details-wrapper').click(function(evt) {
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

/* view exception info [EXCEPTIONS] */
$('.exception-item').click(function(evt) {
    $('#exception-collection .exception-item').removeClass('active');
    $('#exception-details-wrapper .exception-container').html('');

    var el = $(this).addClass('active').find('.exception-body').clone();
    $('#exception-details-wrapper .exception-name').text($(this).find('.exception-name').text());
    $('#exception-details-wrapper .exception-container').append($(el));
});

/* view test info [TEST] */
$('.test').click(function() {
    var t = $(this);

    $('#test-collection .test').removeClass('active');
    $('#test-details-wrapper .test-body').html('');

    var el = t.addClass('active').find('.test-body').clone();
    $('#test-details-wrapper .details-name').html(t.find('.test-name').html());
    $('#test-details-wrapper .details-container').append($(el));

    var collapsible = $('#test-details-wrapper .collapsible');
    if (collapsible.length > 0) {
        collapsible.collapsible({
            accordion: true
        });
    }
});

/* move up and down to browse tests */
$(window).keydown(function(e) {
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
$('.step-filters').click(function(evt) {
    $('.details-container').find('tbody > tr').removeClass('displayed hide');

    var cls = $(evt.target).parent().attr('status');
    if (cls.indexOf('clear') < 0) {
        $('.details-container').find('tbody > tr').removeClass('displayed hide');

        $('.details-container td.status.' + cls).parent().addClass('displayed');
        $('.details-container tbody > tr').not('.displayed').addClass('hide');
    }
});

/* toggle search */
$('.mdi-action-search, .fa-search').click(function() {
    $(this).toggleClass('active');
	$('.validate').toggle();
    var s = $('.search > .input-field');
    s.animate({
        width: s.css('width') == '0px' ? '200px' : '0px'		
    }, 200).toggleClass('enabled', 200);
});

/* filter tests by text in test and categories view */
$.fn.dynamicTestSearch = function(id) {
    var target = $(this);
    var searchBox = $(id);

    searchBox.off('keyup').on('keyup', function() {
        pattern = RegExp(searchBox.val(), 'gi');

        if (searchBox.val() == '') {
            target.removeClass('hide').addClass('displayed');
        } else {
            target.each(function() {
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

/* clicking a section on pie chart will automatically filter tests by status */
$('#test-analysis').click(

function(evt) {
    var label = testChart.getSegmentsAtEvent(evt)[0].label;

    $('#tests-toggle li').filter(

    function() {
        return ($(this).text() == label);
    }).click();
});

/* clicking the category tag will automatically filter tests by category */
$('#test-details-wrapper').click(function(evt) {
    var el = $(evt.target);

    if (el.hasClass('category')) {
        var label = el.text();

        $('#category-toggle a').filter(

        function() {
            return ($(this).text() == label);
        }).click();
    }
});

/* filter tests by status [TEST] */
$('#tests-toggle li').click(function() {
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
    redrawCharts();
});

/* filter tests by category [TEST] */
$('#category-toggle li').click(function() {
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
    redrawCharts();
});

/* clear filters button */
$('#clear-filters').click(function() {
    resetFilters();
});

$(document).ready(function() {
    /* init */
    $('select').material_select();
    $('#refreshCharts').addClass('enabled').children('i').addClass('active');

    /* test count setting */
    /* init */
    $('#parentWithoutNodesAndNodes').click();
    $('#test-count-setting input').click(function() {
        $('#test-count-setting').removeClass('parentWithoutNodes parentWithoutNodesAndNodes childNodes');
        $('#test-count-setting').addClass($(this).prop('id'));
    });

    /* check all checkboxes for step-dashboard filter to allow filtering the steps to be displayed [DASHBOARD] */
    $('#step-status-filter input').prop('checked', 'checked');
    $('#step-status-filter input').click(function() {
        $('#step-status-filter').toggleClass($(this).prop('id').replace('step-dashboard-filter-', ''));
    });

    /* select the first category item in categories view by default */
    $('.category-item').eq(0).click();

    /* select the first exception item in exceptions view by default */
    $('.exception-item').eq(0).click();

    /* select the first test in test's view by default */
    $('.test').eq(0).click();

    /* bind the search functionality on Tests, Categories and Exceptions view */
    $('#test-collection .test').dynamicTestSearch('#test-view #searchTests');
    $('#cat-collection .category-item').dynamicTestSearch('#categories-view #searchTests');
    $('#exception-collection .exception-item').dynamicTestSearch('#exceptions-view #searchTests');

    /* if only header row is available for test, hide the table [TEST] */
    $('.table-results').filter(function() {
        return ($(this).find('tr').length == 1);
    }).hide(0);

    resetFilters(function() {
        $('#dashboard-view').addClass('hide');
    });
});

/* action to perform when 'Clear Filters' option is selected [TEST] */
function resetFilters(cb) {
    $('.dropdown-content, .dropdown-content li').removeClass('active');
    $('.test, .node-list > li').addClass('displayed').removeClass('hide');
    $('#test-view .tests-toggle > i, #test-view .category-toggle > i').removeClass('active');
    redrawCharts();

    if (cb) {
        cb();
    }
}

/* formats date in mm-dd-yyyy hh:mm:ss [UTIL] */
function formatDt(d) {
    return d.getFullYear() + '-' + ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2) + ' ' + ('00' + d.getHours()).slice(-2) + ':' + ('00' + d.getMinutes()).slice(-2) + ':' + ('00' + d.getSeconds()).slice(-2);
}

/* finds test by its name and extentId  [UTIL] */
function findTestByNameId(name, id) {
    $('.test').each(function() {
        var t = $(this);

        if (t.find('.test-name').text().trim() == name && t.attr('extentid') == id) {
            $('.analysis > .test-view').click();

            t.click();
            return;
        }
    });
}

/* refresh and redraw charts [DASHBOARD] */
function redrawCharts() {
    if (!$('#refreshCharts').hasClass('enabled')) {
        return;
    }

    refreshData();

    if ($('#dashboard-view').hasClass('hide')) {
        return;
    }

    testChart.segments[0].value = passedTests;
    testChart.segments[1].value = failedTests;
    testChart.segments[2].value = fatalTests;
    testChart.segments[3].value = errorTests;
    testChart.segments[4].value = warningTests;
    testChart.segments[5].value = skippedTests;
    testChart.segments[6].value = unknownTests;
    stepChart.segments[0].value = passedSteps;
    stepChart.segments[1].value = infoSteps;
    stepChart.segments[2].value = failedSteps;
    stepChart.segments[3].value = fatalSteps;
    stepChart.segments[4].value = errorSteps;
    stepChart.segments[5].value = warningSteps;
    stepChart.segments[6].value = skippedSteps;
    stepChart.segments[7].value = unknownSteps;

    $('#test-analysis, #step-analysis').html('');
    $('ul.doughnut-legend').html('');

    testsChart();
    stepsChart();

    $('ul.doughnut-legend').addClass('right');
}

/* update data for dashboard [DASHBOARD] */
function refreshData() {
    var el = $('#test-count-setting');

    totalTests = $('#test-collection .test:not(.hasChildren), #test-collection .test-node').length;
    passedTests = $('#test-collection .test.displayed .node-list > li.pass.displayed, #test-collection .test.displayed.pass:not(.hasChildren)').length;
    failedTests = $('#test-collection .test.displayed .node-list > li.fail.displayed, #test-collection .test.displayed.fail:not(.hasChildren)').length;
    fatalTests = $('#test-collection .test.displayed .node-list > li.fatal.displayed, #test-collection .test.displayed.fatal:not(.hasChildren)').length;
    warningTests = $('#test-collection .test.displayed .node-list > li.warning.displayed, #test-collection .test.displayed.warning:not(.hasChildren)').length;
    errorTests = $('#test-collection .test.displayed .node-list > li.error.displayed, #test-collection .test.displayed.error:not(.hasChildren)').length;
    skippedTests = $('#test-collection .test.displayed .node-list > li.skip.displayed, #test-collection .test.displayed.skip:not(.hasChildren)').length;
    unknownTests = $('#test-collection .test.displayed .node-list > li.unknown.displayed, #test-collection .test.displayed.unknown:not(.hasChildren)').length;

    if (el.hasClass('parentWithoutNodes')) {
        totalTests = $('#test-collection .test.displayed').length;
        passedTests = $('#test-collection .test.displayed.pass').length;
        failedTests = $('#test-collection .test.displayed.fail').length;
        fatalTests = $('#test-collection .test.displayed.fatal').length;
        warningTests = $('#test-collection .test.displayed.warning').length;
        errorTests = $('#test-collection .test.displayed.error').length;
        skippedTests = $('#test-collection .test.displayed.skip').length;
        unknownTests = $('#test-collection .test.displayed.unknown').length;
    } else if (el.hasClass('childNodes')) {
        totalTests = $('#test-collection .test-node').length;
        passedTests = $('#test-collection .test.displayed .node-list > li.pass.displayed').length;
        failedTests = $('#test-collection .test.displayed .node-list > li.fail.displayed').length;
        fatalTests = $('#test-collection .test.displayed .node-list > li.fatal.displayed').length;
        warningTests = $('#test-collection .test.displayed .node-list > li.warning.displayed').length;
        errorTests = $('#test-collection .test.displayed .node-list > li.error.displayed').length;
        skippedTests = $('#test-collection .test.displayed .node-list > li.skip.displayed').length;
        unknownTests = $('#test-collection .test.displayed .node-list > li.unknown.displayed').length;
    }

    $('.t-pass-count').text(passedTests);
    $('.t-fail-count').text(failedTests + fatalTests);
    $('.t-warning-count').text(warningTests);
    $('.t-fatal-count').text(fatalTests);
    $('.t-error-count').text(errorTests);
    $('.t-skipped-count').text(skippedTests);
    $('.t-others-count').text(warningTests + errorTests + skippedTests + unknownTests);
/*
	var percentage = Math.round((passedTests * 100) / (passedTests + failedTests + fatalTests + warningTests + errorTests + unknownTests + skippedTests)) + '%';
    $('.pass-percentage.panel-lead').text(percentage);
    $('#dashboard-view .determinate').attr('style', 'width:' + percentage);
*/
    totalSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status, #test-collection .test.displayed .node-list > li.displayed td.status').length;
    passedSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.pass, #test-collection .test.displayed .node-list > li.displayed td.status.pass').length;
    failedSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.fail, #test-collection .test.displayed .node-list > li.displayed td.status.fail').length;
    fatalSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.fatal, #test-collection .test.displayed .node-list > li.displayed td.status.fatal').length;
    warningSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.warning, #test-collection .test.displayed .node-list > li.displayed td.status.warning').length;
    errorSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.error, #test-collection .test.displayed .node-list > li.displayed td.status.error').length;
    infoSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.info, #test-collection .test.displayed .node-list > li.displayed td.status.info').length;
    skippedSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.skip, #test-collection .test.displayed .node-list > li.displayed td.status.skip').length;
    unknownSteps = $('#test-collection .test.displayed > .test-body > .test-steps > table td.status.unknown, #test-collection .test.displayed .node-list > li.displayed td.status.unknown').length;

    if ($('#step-status-filter').hasClass('pass')) {
        passedSteps = 0;
    }
    if ($('#step-status-filter').hasClass('fail')) {
        failedSteps = 0;
    }
    if ($('#step-status-filter').hasClass('fatal')) {
        fatalSteps = 0;
    }
    if ($('#step-status-filter').hasClass('warning')) {
        warningSteps = 0;
    }
    if ($('#step-status-filter').hasClass('error')) {
        errorSteps = 0;
    }
    if ($('#step-status-filter').hasClass('info')) {
        infoSteps = 0;
    }
    if ($('#step-status-filter').hasClass('skip')) {
        skippedSteps = 0;
    }
    if ($('#step-status-filter').hasClass('unknown')) {
        unknownSteps = 0;
    }

    $('.s-pass-count').text(passedSteps);
    $('.s-fail-count').text(failedSteps + fatalSteps);
    $('.s-warning-count').text(warningSteps);
    $('.s-error-count').text(errorSteps);
    $('.s-skipped-count').text(skippedSteps);
    $('.s-others-count').text(warningSteps + errorSteps + skippedSteps + unknownSteps + infoSteps);
    $('.total-tests > .panel-lead').text(totalTests);
    $('.total-steps > .panel-lead').text(totalSteps);
}

/* dashboard chart options [DASHBOARD] */
var options = {
    segmentShowStroke: false,
    percentageInnerCutout: 55,
	animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : true,
    legendTemplate: '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++) {%><li><%if(segments[i].label && segments[i].value){%><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%=segments[i].label%><%}%></li><%}%></ul>'
};

/* tests view chart [DASHBOARD] */
function testsChart() {
    var data = [{
        value: passedTests,
        color: '#00af00',
        highlight: '#32bf32',
        label: 'Pass'
    }, {
        value: failedTests,
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'Fail'
    }, {
        value: fatalTests,
        color: '#8b0000',
        highlight: '#a23232',
        label: 'Fatal'
    }, {
        value: errorTests,
        color: '#ff6347',
        highlight: '#ff826b',
        label: 'Error'
    }, {
        value: warningTests,
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'Warning'
    }, {
        value: skippedTests,
        color: '#1e90ff',
        highlight: '#4aa6ff',
        label: 'Skip'
    }, {
        value: unknownTests,
        color: '#222',
        highlight: '#444',
        label: 'Unknown'
    }];

    var ctx = $('#test-analysis').get(0).getContext('2d');
    testChart = new Chart(ctx).Doughnut(data, options);
    drawLegend(testChart, 'test-analysis');
}

/* steps view chart [DASHBOARD] */
function stepsChart() {
    var data = [{
        value: passedSteps,
        color: '#00af00',
        highlight: '#32bf32',
        label: 'Pass'
    }, {
        value: infoSteps,
        color: '#46BFBD',
        highlight: '#5AD3D1',
        label: 'Info'
    }, {
        value: failedSteps,
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'Fail'
    }, {
        value: fatalSteps,
        color: '#8b0000',
        highlight: '#a23232',
        label: 'Fatal'
    }, {
        value: errorSteps,
        color: '#ff6347',
        highlight: '#ff826b',
        label: 'Error'
    }, {
        value: warningSteps,
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'Warning'
    }, {
        value: skippedSteps,
        color: '#1e90ff',
        highlight: '#4aa6ff',
        label: 'Skip'
    }, {
        value: unknownSteps,
        color: '#222',
        highlight: '#444',
        label: 'Unknown'
    }];

    var ctx = $('#step-analysis').get(0).getContext('2d');
    stepChart = new Chart(ctx).Doughnut(data, options);
    drawLegend(stepChart, 'step-analysis');
}

/* draw legend for test and step charts [DASHBOARD] */
function drawLegend(chart, id) {
    var helpers = Chart.helpers;
    var legendHolder = document.getElementById(id);
    legendHolder.innerHTML = chart.generateLegend();

    helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index) {
        helpers.addEvent(legendNode, 'mouseover', function() {
            var activeSegment = chart.segments[index];
            activeSegment.save();
            activeSegment.fillColor = activeSegment.highlightColor;
            chart.showTooltip([activeSegment]);
            activeSegment.restore();
        });
    });

    Chart.helpers.addEvent(legendHolder.firstChild, 'mouseout', function() {
        chart.draw();
    });
    $('#' + id).after(legendHolder.firstChild);
}

testsChart();
stepsChart();
$('ul.doughnut-legend').addClass('right'); 
$( document ).ready(function() {
	$('li.analysis.waves-effect.active').click();			    
	var total=$('.total-tests .panel-lead').text();
	var passed=$('.t-pass-count').text();
	var percentage = Math.round((passed * 100) / (total));
	var pieData = [{
			  value: percentage,
			  color:"#3F9F3F"
			},
			{
			  value : 100-percentage,
			  color : "#eceff5"
			}];	
		var ctx = document.getElementById("percentage").getContext('2d');
		stepChart = new Chart(ctx).Doughnut(pieData, options);	
	$('.pass-percentage.panel-lead').text(percentage+ '%');
    $('#dashboard-view .determinate').attr('style', 'width:' + percentage+ '%');		
});	