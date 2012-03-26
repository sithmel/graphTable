Authors
=======
Rebecca Murphey (original author) and Maurizio Lupo (refactoring and last enhancements)

Requires
========

- jquery.js (http://jquery.com) -- tested with 1.5.1
- jquery.flot.js (http://code.google.com/p/flot/)

Usage
=====

    $('#myTable').graphTable(graphTableOptionsObject,flotOptionsObject);

- both arguments are optional; defaults will work in most cases but you'll need to include {series: 'columns'} if your data is in columns.
- for details on graphTable options and defaults, see below.
- for details on flot options and defaults, see http://code.google.com/p/flot/

Notes
=====
- this isn't going to work well with tables that use rowspan or colspan
- make sure to use the transform args to transform your cell contents into something flot can understand -- especially important if your cells contain currency or dates

GraphTable options 
==================
      
    series: 'rows', // are the series in rows or columns?
    labels: 0, // index of the cell in the series row/column that contains the label for the series
    xaxis: 0, // index of the row/column (whatever args.series is) that contains the x values

    firstSeries: 1, // index of the row/column containing the first series
    lastSeries: null, // index of the row/column containing the last series; will use the last cell in the row/col if not set
    dataStart: 1, // index of the first cell in the series containing data
    dataEnd: null, // index of the last cell in the series containing data; will use the last cell in the row/col if not set
    numberOfAxis: 1, // number of y variables (default 1)

    /*graph size and position:*/

    position: 'after', // "before" the table, "after" the table, or "replace" the table.
                         // If you pass a dom node or a jquery obj the graph will be appended to it.
    width: null, // set to null to use the width of the table
    height: null, // set to null to use the height of the table

    /* data transformation before plotting */
    dataTransform: null, // function to run on cell contents before passing to flot; string -> string
    labelTransform: null, // function to run on cell contents before passing to flot; string -> string
    xaxisTransform: null // function to run on cell contents before passing to flot; string -> string


