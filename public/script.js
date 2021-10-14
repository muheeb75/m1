$("#generate").click(function(){
	var lorem = $("#lorem");
	lorem.html("");
	var quantity = $("#quantity")[0].valueAsNumber;
	var data = ["Imran", "Moin", "Maqsood", "Akthar","Shaguftha"];
	for(var i = 0; i < quantity; i++){
		
        if(data[i] != undefined){
            lorem.append("<p>"+data[i]+"</p>");
        }else{
            var bool = true;
        }
	}
    if(bool){
        alert('Limit exceeded!!!');
    }
})

$("#copy").click(function() {
	var range = document.createRange();
	range.selectNode($("#lorem")[0]);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	}
)