function PagesWidget(config){

    bufferStart();
    var pageStartIndex = config.hasOwnProperty('startIndex') ? config.startIndex : 3;
    var pageIndex = pageStartIndex;
    var titleItems = [];

    function startPage(){
        echo("<div class='page'>");
    }

    function endPage(){
        echo("</div>");
    }

    this.next = function(config){

        if(config == undefined)
            config = {};

        if(config.hasOwnProperty('title'))
            titleItems.push({
                title : config.title,
                page  : pageIndex
            });

        if(pageIndex > pageStartIndex) {
            endPage();
        }
        startPage();

        pageIndex++;

    };

    this.end = function(){

        pageIndex++;
        endPage();

        var content = bufferFlush();

        include('templates/title.html', {
            titleItems : titleItems
        });

        echo(content);

    };

    return this;

}