/******************************************************************************
 *
 * jquery.graphTable-0.3.js
 * by rebecca murphey (original author) and Maurizio Lupo (refactoring and last enhancements)
 *
 * http://blog.rebeccamurphey.com
 * rmurphey gmail com
 *
 * http://sithmel.blogspot.com
 * maurizio.lupo gmail com
 *
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 * 21 March 2012
 *
 * requires: 
 *
 *   - jquery.js (http://jquery.com) -- tested with 1.5.1
 *   - jquery.flot.js (http://code.google.com/p/flot/)
 *
 * usage: 
 *
 *   $('#myTable').graphTable(graphTableOptionsObject,flotOptionsObject);
 *
 *   - both arguments are optional; defaults will work in most cases
 *     but you'll need to include {series: 'columns'} if your data is
 *     in columns.
 *   - for details on graphTable options and defaults, see below.
 *   - for details on flot options and defaults, see
 *     http://code.google.com/p/flot/
 *
 * notes:
 *   
 *   - this isn't going to work well with tables that use rowspan or colspan
 *   - make sure to use the transform args to transform your cell contents into
 *     something flot can understand -- especially important if your cells
 *     contain currency or dates
 *
 ******************************************************************************/

(function($) { 
 
 $.fn.graphTable = function(_graphArgs,_flotArgs) {

    var args = {

      /* 
       * options for reading the table -- defaults will work in most cases except
       * you'll want to override the default args.series if your series are in columns 
       * 
       * note that anywhere the word "index" is used, the count starts from 0 at
       * the top left of the table 
       *
       */
      series: 'rows', // are the series in rows or columns?
      labels: 0, // index of the cell in the series row/column that contains the label for the series
      xaxis: 0, // index of the row/column (whatever args.series is) that contains the x values

      firstSeries: 1, // index of the row/column containing the first series
      lastSeries: null, // index of the row/column containing the last series; will use the last cell in the row/col if not set
      dataStart: 1, // index of the first cell in the series containing data
      dataEnd: null, // index of the last cell in the series containing data; will use the last cell in the row/col if not set
      numberOfAxis: 1, // number of y variables (default 1)

      /* graph size and position */
      position: 'after', // before the table, after the table, or replace the table.
                         // If you pass a dom node or a jquery obj the graph will be appended to it.
      width: null, // set to null to use the width of the table
      height: null, // set to null to use the height of the table

      /* data transformation before plotting */
      dataTransform: null, // function to run on cell contents before passing to flot; string -> string
      labelTransform: null, // function to run on cell contents before passing to flot; string -> string
      xaxisTransform: null // function to run on cell contents before passing to flot; string -> string

    }

    // override defaults with user args
    $.extend(true,args,_graphArgs);
    
    /* default to last cell in the row/col for 
     * lastSeries and dataEnd if they haven't been set yet */

    // index of the row/column containing the last series
    if (! args.lastSeries) {
      args.lastSeries = (args.series == 'columns') ? 
        $('tr',$(this)).eq(args.labels).find('th,td').length - 1 : 
        $('tr',$(this)).length - 1;  
    }

    // index of the last cell in the series containing data
    if (! args.dataEnd) {
      args.dataEnd = (args.series == 'rows') ? 
        $('tr',$(this)).eq(args.firstSeries).find('th,td').length - 1:
        $('tr',$(this)).length - 1;
    }

    var getSeries = (args.series == 'rows') ? 
      function ($rows, i){
        return $rows.eq(i).children('td, th');
      }:
      function ($rows, i){
        var n = i + 1;
        return $rows.find('td:nth-child(' + n + '),th:nth-child(' + n + ')');
      };
  

    return $(this).each(function() {
      var i,j, y_axis, $div;
      // use local min/max for y of each graph, based on initial args
      var $table = $(this);

      // make sure the table is a table!
      if (! $table.is('table')) { return; }

      // if no height and width have been set, then set 
      // width and height based on the width and height of the table
      if (! args.width) { args.width = $table.width(); }
      if (! args.height) { args.height = $table.height(); }

      var $rows = $('tr',$table);
      var tableData = new Array();

      var $xaxisRow = getSeries($rows, args.xaxis);

      for (i=args.firstSeries;i<=args.lastSeries;i = i + args.numberOfAxis) {
        var rowData = new Array();
        if (args.labelTransform) { label = args.labelTransform(label); }

        for (j = args.dataStart; j <= args.dataEnd ; j++ ) {
          var labels = [];
          var values = [];

          if($xaxisRow){
              var x = $xaxisRow.eq(j).text();
              // get x
              if (args.xaxisTransform) { x = args.xaxisTransform(x); }
              var test_x = parseFloat(x);
              // get y (more than one)
              values.push(x);
          }
          for (y_axis = 0 ; y_axis < args.numberOfAxis ; y_axis++){
            var $dataRow = getSeries($rows, i + y_axis);
            labels.push( $dataRow.eq(args.labels).text());

            var y = $dataRow.eq(j).text();

            if (args.dataTransform) { y = args.dataTransform(y); }
            var test_y = parseFloat(y);

            values.push(y);
          }

          rowData[rowData.length] = values;
        }
        tableData[tableData.length] = { label: labels.join(', '), data: rowData };
      }

      if(typeof args.position !==  'string'){
        $div = $('<div class="flot-graph" />').appendTo(args.position);
      }
      else{
        switch (args.position) {
          case 'after':
	        $div = $('<div class="flot-graph" />').insertAfter($table);
          break;
          case 'replace':
            $div = $('<div class="flot-graph" />').insertAfter($table);
            $table.remove();
          break;

          default:
            $div = $('<div class="flot-graph" />').insertBefore($table);
          break;
        }
      }

      $div.width(args.width).height(args.height);
      $.plot($div, tableData, _flotArgs);

    });
  };

})(jQuery);
