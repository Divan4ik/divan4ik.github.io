/**
*
* features:
*  - auto-fix too large or too small params
*  - mobile first!
*  - nice color picker
*  - remove color from cell by second click
*/

(function(g, d, $){

    var App  = App || (function(){

        var workspace,
            rowsInput,
            colsInput,
            startButton,
            inputs,
            isFormValid = true,
            brushInput,
            brushReplacer,
            canvasWidth,
            isMobile = false,
            constraints = {
                min: 6,
                max: 19
            },
            grid = {
                cols: 15,
                rows: 15,
                ceilLength: 20,
                brushColor: '#2980b9'
            };

          	/**
    		 *  Bind Events
    		 *	@return void
    		 */
        var init = function() {

                workspace = $('#grid');
                rowsInput = $('#input_height');
                colsInput = $('#input_width');
                inputs = $('input.params');
                startButton = $('.start');
                brushInput = $('#colorPicker');
                brushReplacer = $("#color-picker-wrapper");
                canvasWidth = $('#root .container').width();
                isMobile = canvasWidth < 400 || false;

                setPredefinedValues();
                bindEvents();
            },

            /**
             *  Events, handlers
             *  @return void
             */
            bindEvents = function() {
                
                inputs.on('change', function(){
                    getInputs();
                    rowsInput.val(grid.rows);
                    colsInput.val(grid.cols);
                });

              
                brushInput.on('change', function() {
                    grid.brushColor = $(this).val();
                  
                    brushReplacer.css({
                      background: grid.brushColor
                    });
                });

                workspace.on('click', '.cell', function() {
                    var cell = $(this),
                        background = cell.hasClass('painted') ? 'white': grid.brushColor;
                    cell.css({background: background}).toggleClass('painted');
                });

                startButton.on('click', function(){
                    if( isFormValid ) makeGrid();
                });
                
              
                // make brushReplacer set right color
                brushInput.trigger('change');
            },

            /**
             *  Get values and change status valid | invalid
             *  @return void
             */
            getInputs = function() {
                grid.rows = fit( Number( rowsInput.val() ) );
                grid.cols = fit( Number( colsInput.val() ) );
                isFormValid = isValidValue(grid.cols) && isValidValue(grid.rows) || false;
                if(isMobile) grid.ceilLength = (canvasWidth/grid.cols).toFixed(0);
            },

            /**
             *  For init values
             *  @return void
             */
            setPredefinedValues = function() {
                rowsInput.val(grid.rows);
                colsInput.val(grid.cols);
                brushInput.val(grid.brushColor);
            },
          
            
            /**
             *  Correct input numbers by max in min
             *  @return void
             */
            fit = function(val) {
                return val > constraints.max ? constraints.max : val < constraints.min ?  constraints.min : val;
            },
            
            /**
             *  Helper Function
             *  @param String val
             *	@return void
             */
            isValidValue = function(val) {
                return typeof val === "number" &&
                        !isNaN(val) &&
                        val >= constraints.min &&
                        val <= constraints.max;
            },


            /**
             *  Make grid function
             *  @return void
             */
            makeGrid = function() {
              
                
                var tableHtml = $('<table class="table"></table>'),
                    rowHtml = $('<tr class="row"></tr>'),
                    cellHtml = $('<td width="'+grid.ceilLength+'" height="'+grid.ceilLength+'" class="cell"></td>');

                for(var r = 0; r < grid.rows; r++) {
                    var row = rowHtml.clone();
                    for(var c = 0; c < grid.cols; c++) {
                        var cell = cellHtml.clone();
                        row.append(cell);
                    }
                    tableHtml.append(row);
                }

                workspace.html('').append(tableHtml);
            };

        /**
         *  Public Interface
         *
         */
        return {
            makeGrid: makeGrid,
            init: init
        }

    })();

    g.App = App;

    $(function(){

        App.init();
      
      
    });


})(this, this.document, jQuery);