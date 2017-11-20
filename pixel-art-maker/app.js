/**
*
* features:
*  - auto-fix too large or too small params
*  - mobile first!
*  - nice color picker
*  - remove color from cell by second click
*/

(function(g, d, $){

    const Generator = function() {
        var app_environment = this;
        return function(element) {
            try {
                return new Library[element];
            } catch (Exception) {
                throw new Error('element "' + element + '" doesnt exists');
            }
        }
    };



    let App = (function(){

        let workspace,
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
                cellLength: 20,
                brushColor: '#2980b9'
            };

          	/**
    		 *  Initialization
    		 *	@return void
    		 */
        const init = function() {

                workspace = $('.workspace');
                rowsInput = $('#input_height');
                colsInput = $('#input_width');
                inputs = $('input.params');
                startButton = $('.start');
                brushInput = $('#colorPicker');
                brushReplacer = $("#color-picker-wrapper");
                canvasWidth = $('#root .container').width();
                isMobile = canvasWidth < 400 || false;
                if(isMobile) grid.celllLength = (canvasWidth/grid.cols).toFixed(0);
                //setPredefinedValues();
                //bindEvents();
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
                    let cell = $(this),
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
              
                
                let tableHtml = $('<table class="table"></table>'),
                    rowHtml = $('<tr class="row"></tr>'),
                    cellHtml = $('<td width="'+grid.ceilLength+'" height="'+grid.ceilLength+'" class="cell"></td>');

                for(let r = 0; r < grid.rows; r++) {
                    let row = rowHtml.clone();
                    for(let c = 0; c < grid.cols; c++) {
                        let cell = cellHtml.clone();
                        row.append(cell);
                    }
                    tableHtml.append(row);
                }

                workspace.html('').append(tableHtml);
            },

            test = function() {
                this.init();
                let table = new Table(workspace);
                table.setCellWidth = grid.cellLength;
                table.createMatrix(grid.rows, grid.cols);
                console.log(table);
                table.render();

            };

        /**
         *  Public Interface
         *
         */
        return {
            makeGrid: makeGrid,
            init: init,
            test: test
        }

    })();


    class TableElement {
        constructor() {
            this.name;
            this.element;
        }

        html() {
            return this.element;
        }
    }

    class Cell extends TableElement {

        constructor(sideWidth) {
            super();
            this.cellWidth;
            this.name = 'cell';
            this.element = $('<td class="cell"></td>');
        }

        html() {
            let newHtml = this.element
            this.element.attr('width', 20);
            this.element.attr('height', 20);
            this.element.on('click', this.onCLick);
            return this.element;
        }

        onCLick() {
            console.log(this);
        }
        
        paint(color) {
            this.element.css({'background-color': color});
        };
    };

    class Row extends TableElement {
        constructor() {
            super();
            this.name = 'row';
            this.element = $('<tr class="row"></tr>');
            this.cells = [];
        }
    }

    class Table {
        constructor(node) {
            this.element = node;
            this.name = 'Table';
            this.matrix = [];
            this.create = new Generator();
        }

        addRow() {
            return this.create('row');
        }

        addCell() {
            return this.create('cell');
        }

        render() {
            let table = $('<table class="table"></table>');

            for(let r = 0; r < this.matrix.length; r++) {
                let row = this.matrix[r].html();
                for(let c = 0; c < this.matrix[r].cells.length; c++) {
                    let cell = this.matrix[r].cells[c].html();
                    row.append(cell);
                }
                table.append(row);
            }
            this.element.append(table);
        }

        createMatrix(x, y) {
            
            for(let r = 0; r < x; r++) {

                let row = this.addRow();

                for(let c = 0; c < y; c++) {
                    let cell = this.addCell(this.cellWidth);
                    row.cells.push( cell );
                }

                this.matrix.push(row);
            }
        }
        setCellWidth(width) {
            this.cellWidth = width;
        }
    }

    const Library = {
        cell: Cell,
        row: Row
    };

    g.App = App;
    

    $(function(){

        App.test();
      
    });


})(this, this.document, jQuery);