/* 
Orginal Page: http://thecodeplayer.com/walkthrough/jquery-multi-step-form-with-progress-bar 

*/
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate

$(".next").on("click", function(){
	current_fs = $(this).parents("fieldset");
	next_fs = $(this).parents("fieldset").next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	current_fs.hide();
});

$(".previous").on("click", function(){
	current_fs = $(this).parents("fieldset");
	previous_fs = $(this).parents("fieldset").prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	current_fs.hide();
});

$("input[name='student']").on("change", function(){
	if(this.value == "yes") {
		$("#studentQuestions *").prop("disabled", false)
	} else {
		$("#studentQuestions *").prop("disabled", true)
	}
});

$(".usmap-select").on("click", function() {
	$(".usmap-select").removeAttr('selected')
	$(this).attr('selected', 'selected')
	// Aria label
	$(".usmap-select").attr('aria-selected', 'false') // Set all selectable elements to false
	$(this).attr('aria-selected', 'true') // Set newly selected element to true
	// Set input value
	$("#geography").val($(this).data('region'))
})