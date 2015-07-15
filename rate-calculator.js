// Title:   Rate Calculator 
// Author:  Mathew Fleisch
// Contact: mathew dot fleisch at gmail dot com
// Last update: 03.03.2014 09:15:00 PST
// Description:
//   Marin Clean Energy had me develop this tool to allow 
//   customers to see the estimated cost of MCE's service 
//   and the default electric service (PG&E), based on the
//   customer's specific usage for a certain time period. 
//   This tool is controlled by a json file that will 
//   allow MCE a way to update ever changing rates, on
//   their own.

//console.log("Rate Calculator JS Loaded...");


jQuery(document).ready(function($) {
	log("Rate Calculator Initialized");

	if(window.location.href.match(/\?admin=true/)) {
		log("Admin portal:");
		$(".admin_header").live("click", function() { 
			var raw_id = $(this).attr("id");
			log("Button Click: "+raw_id);
			switch(raw_id) {
				case (raw_id.match(/admin_header_global_vars/) ? raw_id : false): 
					var target_controller = raw_id.replace(/admin_header_global_vars_/, '');
					log("Target Controller Extracted: "+target_controller);
					if($("#admin_global_vars_wrapper_"+target_controller).hasClass("wrapper_invisible")) { 
						$("#admin_global_vars_wrapper_"+target_controller).slideDown(400, function() {
							$(this).removeClass("wrapper_invisible").addClass("wrapper_visible");
						});
					} else { 
						$("#admin_global_vars_wrapper_"+target_controller).slideUp(400, function() {
							$(this).removeClass("wrapper_visible").addClass("wrapper_invisible");
						});
					}
					break;
				case (raw_id.match(/admin_dynamic_rates/) ? raw_id : false): 
					var target_controller = raw_id.replace(/admin_dynamic_rates_/, '');
					log("Target Controller Extracted: "+target_controller);
					if($("#level_two_"+target_controller).hasClass("wrapper_invisible")) { 
						$("#level_two_"+target_controller).slideDown(400, function() {
							$(this).removeClass("wrapper_invisible").addClass("wrapper_visible");
						});
					} else { 
						$("#level_two_"+target_controller).slideUp(400, function () {
							$(this).removeClass("wrapper_visible").addClass("wrapper_invisible");
						});
					}
					break;
				case (raw_id.match(/admin_description_input/) ? raw_id : false): 
					var target_controller = raw_id.replace(/admin_description_input_/, '');
					log("Target Controller Extracted: "+target_controller);
					if($("#descriptions_"+target_controller).hasClass("wrapper_invisible")) { 
						$("#descriptions_"+target_controller).slideDown(600, function() {
							$(this).removeClass("wrapper_invisible").addClass("wrapper_visible");
						});
					} else { 
						$("#descriptions_"+target_controller).slideUp(600, function (){
							$(this).removeClass("wrapper_visible").addClass("wrapper_invisible");
						});
					}
					break;
				case (raw_id.match(/admin_test_values/) ? raw_id : false): 
					var target_controller = raw_id.replace(/admin_test_values_/, '');
					log("Target Controller Extracted: "+target_controller);
					if($("#test_values_"+target_controller).hasClass("wrapper_invisible")) { 
						$("#test_values_"+target_controller).slideDown(400, function() {
							$(this).removeClass("wrapper_invisible").addClass("wrapper_visible");
						});
					} else { 
						$("#test_values_"+target_controller).slideUp(400, function (){
							$(this).removeClass("wrapper_visible").addClass("wrapper_invisible");
						});
					}
					break;
			}
		});
		$.ajax({
			url: window.activeRateFilename,
			dataType: "json",
			success: function(data) {
				var rates = data['rates'];
				console.log(rates);
				window.master_data = data;
				log("Data loaded... parsing");
				$("#rate-calculator").append(
					 '<div class="calcAdmin_wrapper">'
					 	+'<style>'
					 		+'.calcAdmin_inner { position: relative; }'
					 		+'.admin_description_input_wrapper hr { border-top:1px dashed #444; }'
					 		+'.admin_global_vars_wrapper { border: 1px solid black; margin: 0 0 10px 0; width: 600px; text-align:center;}'
					 		+'.admin_dynamic_rates_wrapper { border: 1px solid black;margin: 0 0 10px 0; width: 600px; text-align:center; }'
					 		+'.admin_description_input_wrapper { border: 1px solid black;margin: 0 0 10px 0; width: 600px; text-align:center; }'
					 		+'.admin_test_values_wrapper { display:block;border: 1px solid black;margin: 0 0 10px 0; width: 600px; text-align:center;float:right;width:370px; }'
					 		+'.admin_rate_schedule_wrapper { width: 1000px;border:1px solid black;padding:10px; } '
					 		+'.admin_inner_wrapper { margin: 10px 0 0 0; } ' 
					 		+'.admin_input_checkbox { width: 250px; }'
					 		+'.admin_header { width: auto; height:40px; background-color: #ccc; cursor: pointer; padding: 5px; font-weight:bold;text-align:left; }'
					 		+'.admin_input_title { width:250px;display:inline-block;margin:0 5px 10px 0;text-align:right; }'
					 		+'.admin_input { width:250px; }'
					 		+'.admin_textarea { width:250px;height:200px;margin:0 0 10px 0; }'
					 		+'.admin_description_textarea { width:350px;height:200px;margin:0 10px 10px 0;float:right; }'
					 		+'.wrapper_invisible { display:none; }'
					 	+'</style>'
						+'<h2>Set Calculator Values</h2>'
						//+'<textarea rows="10" cols="90">'++'</textarea>'
						+'<div class="calcAdmin_inner"></div>'
					+'</div>'
				);		
				for(var i = 0; rates.length; i++) {
					var rateSchedule = rates[i]['rate_schedule'];
					var controller = str_to_class(rateSchedule);
					var groups = [];
					for(var j = 0; j < rates[i]['time_period_info'].length; j++) {
						var group = rates[i]['time_period_info'][j]['time_period_group'];
						var group_class = str_to_class(group);
						groups[group_class] = group;
					}
					var pcia = rates[i]['level_two'][0]['PCIA'];
					var franchiseFee = rates[i]['level_two'][0]['franchiseFee'];
					var level_three_admin = rates[i]['level_three'][0];
					var level_three_abrs = level_three_admin['rateAbrs'].split(/,/);
					var descriptions = rates[i]['descriptions'][0];

					//log(level_three_admin);

					//Set global variables
					$(".calcAdmin_inner").append(
						'<div class="admin_rate_schedule_wrapper" id="admin_rate_schedule_'+controller+'">'
							+'<h3>'+rateSchedule+'</h3>'
							+'<div class="admin_test_values_wrapper">'
								+'<div class="admin_header" id="admin_test_values_'+controller+'">Test Values</div>'
								+'<div class="wrapper_invisible admin_inner_wrapper" id="test_values_'+controller+'">'
								+'Test (100 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 100)+'</span><br />'
								+'Test (300 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 300)+'</span><br />'
								+'Test (500 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 500)+'</span><br />'
								+'Test (700 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 700)+'</span><br />'
								+'Test (900 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 900)+'</span><br />'
								+'Test (1100 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 1100)+'</span><br />'
								+'Test (1300 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 1300)+'</span><br />'
								+'Test (1500 kWh): <span class="calc-val">'+calculate_rate(controller, "0", 1500)+'</span><br />'
								+'</div>'
							+'</div>'
							+'<div class="admin_global_vars_wrapper">'
								+'<div class="admin_header" id="admin_header_global_vars_'+controller+'">Global Variables</div>'
								+'<div class="wrapper_invisible admin_inner_wrapper" id="admin_global_vars_wrapper_'+controller+'">'
									+'<span class="admin_input_title">Rate Schedule Name: </span>'
									+'<input type="text" class="admin_input" id="admin_rate_schedule_name_input_'+controller+'" value="'+rateSchedule+'" /><br />'
										+'<span class="admin_input_title">Enabled</span>'
									+'<input type="checkbox" class="admin_input_checkbox" id="admin_rate_schedule_enabled" '+(rates[i]['schedule_enabled'] ? 'checked="checked"' : '')+' /><br />'
									+'<span class="admin_input_title">Rate Schedule Description:</span>'
									+'<textarea class="admin_textarea" id="admin_rate_schedule_description_input_'+controller+'">'
										+rates[i]['rate_schedule_description']
									+'</textarea><br />'
									+'<span class="admin_input_title">PCIA</span>'
									+'<input type="text" class="admin_input" id="admin_pcia_input_'+controller+'" value="'+pcia+'" /><br />'
									+'<span class="admin_input_title">Franchise Fee</span>'
									+'<input type="text" class="admin_input" id="admin_franchiseFee_input_'+controller+'" value="'+franchiseFee+'" /><br />'
								+'</div>'
							+'</div>'
							+'<div class="admin_dynamic_rates_wrapper" >'
								+'<div class="admin_header" id="admin_dynamic_rates_'+controller+'">Secondary (Dynamic) Variables</div>'
								+'<div class="wrapper_invisible admin_inner_wrapper" id="level_two_'+controller+'">'
								+'</div>'
							+'</div>'
							+'<div class="admin_description_input_wrapper">'
								+'<div class="admin_header" id="admin_description_input_'+controller+'">Descriptions</div>'
								+'<div class="wrapper_invisible admin_inner_wrapper" id="descriptions_'+controller+'">'
								+'</div>'
							+'</div>'
							+'<br class="clear" />'
						+'</div><hr />'
					);
					//Set secondary dynamic variables

					for(var j = 0; j < level_three_abrs.length; j++) {
						if(level_three_abrs.hasOwnProperty(j)) {
							var tmp = level_three_abrs[j];
							$("#level_two_"+controller).append(
								'<span class="admin_input_title" id="admin_level_three_title_'+controller+'">'+tmp+': </span>'
								+'<input type="text" class="admin_input" id="admin_level_three_'+str_to_class(tmp)+'_'+controller+'" value="'+level_three_admin[tmp]+'" /><br />'
							);
						}	
					}
					for(var key in descriptions) {
						if(descriptions.hasOwnProperty(key)) {
							$("#descriptions_"+controller).append(
								'<span class="admin_title" id="description_'+str_to_class(key)+'_'+controller+'">'+key.replace(/_description/, '').replace(/_/g, ' ')+': </span>'
								+'<textarea class="admin_description_textarea" id="description_input_'+str_to_class(key)+'_'+controller+'">'
										+descriptions[key]
								+'</textarea><br class="clear" /><hr />'
							);
						}
					}

					for(var j in groups) {
						if(groups.hasOwnProperty(j)) {
							$(".admin_rate_schedule_"+controller).append(groups[j]+'<br />');
						}
					}
				}
			},
			error: function (xhr, ajaxOptions, thrownError){
				log("JSON Error: "+thrownError+"\nXHR: "+xhr);
			}
		});
	} else { 
		$.ajax({
			url: window.activeRateFilename,
			dataType: "json",
			success: function(data) {
				var rates = data['rates'];
				window.master_data = data;
				//log(data);
				$("#rate-calculator").append(
					 '<div class="rate-schedule-selector-wrapper">'
						+'<h3 class="rate-schedule-title">Residential</h3>'
						+'<select class="rate-schedules-res"></select>'
					+'</div>'
					+'<div class="rate-schedule-selector-wrapper">'
						+'<h3 class="rate-schedule-title">Commercial</h3>'
						+'<select class="rate-schedules-com"></select>'
					+'</div>'
					+'<br class="clear" />'
					+'<div class="rate-descriptions"></div>'
					+'<div class="rate-calculations"></div>'
					+'<div id="rate-output"></div>'
					+'<div class="rate-info-boxes"></div>'
				);
				
				var first = null;
				for(var i = 0; i < rates.length; i++){
					var tier = rates[i];
					
					var rateSchedule = tier['rate_schedule'];
					if(tier['schedule_enabled']) {
						var controller = str_to_class(rateSchedule);
						if(!first) { first = controller; }
						var rsDescription = tier['rate_schedule_description'];
						//log("title: "+rateSchedule);//+"\ndescription: "+rsDescription);
						
						//Create select menus for residential and commercial customers	
						if(controller.match(/^com/)) {
							$(".rate-schedules-com").append('<option class="rate-schedule-select" value="'+controller+'_controller">'+rateSchedule+'</option>');
						} else {
							$(".rate-schedules-res").append('<option class="rate-schedule-select" value="'+controller+'_controller">'+rateSchedule+'</option>');
						}
						$(".rate-descriptions").append('<div class="rs-description" id="'+controller+'_description">'+rsDescription+'</div>');
						
						
						
						//Generate all hover boxes to make loading them faster
						$.each(tier['descriptions'][0], function(key, val) {
							//log(key+": "+val);
							$(".rate-info-boxes").append('<div class="rate-info-box" id="rib_'+controller+'_'+str_to_class(key)+'">'+val+'<span class="info-arrow"></span></div>');
						});
						
						
						//Create groups for all input boxes in a specific season, to be contained and styled separately
						for(var j = 0; j < tier['time_period_info'].length; j++) {
							var group = tier['time_period_info'][j]['time_period_group'];
							var group_class = str_to_class(group);
							//log("Group: "+controller+"_"+group_class);	
							$(".rate-calculations").append(
								 '<div class="group-wrapper rsGroup_'+controller+'" id="group_'+controller+'_'+group_class+'">' 
								+'<h3 class="input-title">'+group+'</h3>'
								+'</div>'
								//+'<span class="smallclear">&nbsp;</span>'
							);
						}
						
						
						var gcrnt  = "";
						var gprev  = "";
						var gfirst = "";
						var glast  = "";
						var gtrack = 0;
						for(var j = 0; j < tier['time_period_rates'].length; j++) {
						
							//$(".rate-calculations").append('<div class="calculation-data" id="'+controller+'_calc_'+j+'"></div>');
							var rate = tier['time_period_rates'][j];
							for(var x = 0; x < tier['time_period_info'].length; x++) {
								if(rate['time_period'].match(tier['time_period_info'][x]['time_period_group'])) {
									var rateInfo = tier['time_period_info'][x];
									if(parseInt(rateInfo['number_in_group']) === (gtrack+1)) { glast = "glast"; gtrack = 0; }
									if(!gcrnt) { gfirst = "gfirst"; } else { gfirst = ""; }
									gcrnt = rateInfo['time_period_group'];
									if(gprev !== gcrnt) {
										gprev  = gcrnt;
										gfirst = "gfirst";
										if((gtrack+1) < parseInt(rateInfo['number_in_group']) ) { glast = ""; }
									}
									//log("  + NumInGroup: "+parseInt(rateInfo['number_in_group'])+"    gTrack: "+(gtrack+1)+"    gfirst: "+gfirst+"   glast: "+glast);
									gtrack++;
								}
							}
							/*
							*/
							log(
								 "\nTime Period: "+rate['time_period']
								+"\nMCE Rate: "+rate['mceRate']
								+"\nPGE Rate: "+rate['pgeRate']
								+"\nPCIA: "+tier['level_two'][0]['PCIA']
								+"\nFranchise Fee: "+tier['level_two'][0]['franchiseFee']
							);
							if(rate['time_period'] && rate['mceRate'] && rate['pgeRate'] && tier['level_two'][0]['PCIA'] && tier['level_two'][0]['franchiseFee']) {
								// group_'+rateInfo['time_period_group']+' '+gfirst+' '+glast+'
								$("#group_"+controller+"_"+str_to_class(rateInfo['time_period_group'])).append(
									 '<div class="usage-input-wrapper" id="'+controller+'_input_'+j+'">'
									+'<div class="usage-descriptor">'+rate["time_period"].replace(/Summer\s*|Winter\s*/, '')+' Usage:</div>'
									+'<input type="text" class="usage-text-input controller_'+controller+' iteration_'+j+'" '
									+'id="'+controller+'_text_'+j+'" value="500">'
									+'<div class="usage-descriptor right">(kWh)</div>'
									+(tier['level_three'][0]['demand_rates'] 
									? 
										 '<br class="clear" />'
										+'<div class="usage-descriptor">'
											+(rate['time_period'].match(/Off/) ? 'Max' : rate["time_period"].replace(/Summer\s*|Winter\s*/, ''))
											+' Demand:'
										+'</div>'
										+'<input type="text" class="demand-text-input" id="'+controller+'_demand_'+j+'" value="1">' 
										+'<div class="usage-descriptor right">(kWh)</div>'
									: '')
									+'</div>'
									//+(glast ? '<span class="smallclear">&nbsp;</span>' : '')
								);
							} else {
								log(
									"Error… Missing data in json file for "+rateSchedule+"["+j+"]:\n"
									+"  ^--> Minimum requirements show that each time period must have an MCE Rate, PGE Rate, PCIA, and Franchise Fee."
									+"  ^--> Time Period: "+rate['time_period']
									+"  ^--> MCE Rate: "+rate['mceRate']
									+"  ^--> PGE Rate: "+rate['pgeRate']
									+"  ^--> PCIA: "+tier['level_two'][0]['PCIA']
									+"  ^--> Franchise Fee: "+tier['level_two'][0]['franchiseFee']
								);
							}					
						}
					}
				}
				$(".rate-schedules-res").change();
							
				//$(".rate-buttons").append('<br class="clear" />');
			},
			error: function (xhr, ajaxOptions, thrownError){
				log("JSON Error: "+thrownError+"\nXHR: "+xhr);
			}
		});
	}


	window.master_data;
	window.level_2_calculations_hidden = true;
	window.level_3_calculations_hidden = true;
	
	$(".rate-schedules-res, .rate-schedules-com").live('change focus', function(e) {
	
		//Set target tier - aka: controller
		var controller = $(this).val().replace(/_controller/, "");//.attr('id').replace(/_controller/, "");
		window.activeView = controller;
		
		//Slow animation compensation.
		$(".rs-description").hide();
		$(".group-wrapper").hide().css('display', 'none');
		//$(".usage-input-wrapper").hide();
		
		//Fade in target tier.
		//$(".rsGroup_"+controller).css("display", "inline-block");
		$("#"+controller+"_description").fadeIn(300);
		$(".rsGroup_"+controller).fadeIn(300).css('display', 'inline-block');
		//$(".controller_"+controller).parent().fadeIn(300);
		calculate_rate(controller, "0", $("#"+controller+"_text_0").val());
	});
	
	$(".usage-text-input, .demand-text-input").live("keyup click focus focusout", function(e) {
		//log(e.keyCode);
		if($(this).attr('id').match(/demand/)) { var demand = parseFloat($(this).val()); } else { var demand = 0; }
		//Send usage value to calculate_rate(), and ignore demand value
		var that = "#"+$(this).attr('id').replace(/demand/, "text");
		if($(that.replace(/text/, "demand"))) {
			if($(that.replace(/text/, "demand")).val() > 0) { 
				var demand = $(that.replace(/text/, "demand")).val(); 
			}
		}
		//log("Input text: "+that);
		if(e.type === "focus") { $(that).select(); }
		if(e.type === "focusout") {
			if(!$(that).val() || !isNumber($(that).val())) {
				//log("\n\n\n\nBLUR: "+$(that).attr("id")+"\n\n\n");
				$(that).val(0);
			}
		}
		var crnt_val = parseInt($(that).val());
		//log('crnt_val: '+crnt_val);
		
		if(crnt_val < 1) { $(that).val(Math.abs(crnt_val)); } else {	
			//Down arrow -> -10
			if(e.keyCode === 40) { $(that).val(crnt_val-10); }
		}
		
		//Up arrow -> +10
		if(e.keyCode === 38) { $(that).val(crnt_val+10); }
		
		var tmp = new Array();
		var existing_controller,existing_iteration,existing_usage = null;
		//log(" new controller:"+$(this).parent().attr("id"));
		
		if($("#rate-output").attr("class").length) {
			//log("Existing rate class: "+$("#rate-output").attr("class"));
			var exist = $("#rate-output").attr("class").split(/_usage_/);
			if(exist.length === 2) {
				tmp = exist[1].split(/_/);
				existing_controller = exist[0];
				existing_iteration  = tmp[0];
				existing_usage      = tmp[1];
				if(tmp.length === 3) {
					existing_demand = tmp[2];
				} else {
					existing_demand = 0;
				}
			}
			//for(var e in exist) { log("exist: "+exist[e]); }
		}
		var usage = parseInt($(that).val());
		if(parseInt(usage) > -1) {
			var classes = $(that).attr("id").split(/_demand_|_text_/);
			var controller = classes[0];
			var iteration = classes[1];

			/*
			log(
				 "Run calculator if one of the existing values differs from a new value:\n"
				+"   Existing Controller["+existing_controller+"] ?= Current Controller["+controller+"]\n"
				+"   Existing Iteration["+existing_iteration+"] ?= Current Iteration["+iteration+"]\n"
				+"   Existing Usage["+existing_usage+"] ?= Current Usage["+usage+"]\n"
				+"   Existing Demand["+existing_demand+"] ?= Current Demand["+demand+"]"
			);
			*/
			if(existing_controller !== controller || existing_iteration !== iteration || parseInt(existing_usage) !== parseInt(usage) || existing_demand !== demand) {
				//log("   calculate_rate("+controller+", "+iteration+", "+usage+")");
				calculate_rate(controller, iteration, usage);
			//} else {
			//	log("   Do NOT run calculator…");
			}
		}
	});
	
	
	$(".show_hide_level_three").live("click", function() {
		if($(this).attr("class").match(/hidden/)) {
			$(".calculation-output-level-3").slideDown(400);
			$(".level_three_subtotal_value").slideUp(150);
			$(".show_hide_level_three").removeClass("hidden").addClass("shown").text("Collapse Calculations");
			window.level_3_calculations_hidden = false;
		} else {
			$(".level_three_subtotal_value").fadeIn(300);
			$(".calculation-output-level-3").slideUp(400);
			$(".show_hide_level_three").removeClass("shown").addClass("hidden").text("Expand Calculations");
			window.level_3_calculations_hidden = true;
		}
	});
	
	$(".calculation-header").live("click", function() {
		if($(this).attr("class").match(/hidden/)) {
			$(".calculation-output-level-2, .calculation-output-subtotal-3").slideDown(400);
			$(".calculation-output-spacer").hide(400);
			$(".calculation-header").removeClass("hidden").addClass("shown").css("background-image", "url('"+window.pathToUpTri+"')");
			window.level_2_calculations_hidden = false;
		} else {
			$(".calculation-output-level-2, .calculation-output-subtotal-3").slideUp(400);
			$(".calculation-output-spacer").show(400);
			$(".calculation-header").removeClass("shown").addClass("hidden").css("background-image", "url('"+window.pathToDownTri+"')");
			$(".calculation-output-level-3").slideUp(400);
			$(".level_three_subtotal, .level_three_subtotal_value").slideDown(200);
			//$(".level_three_subtotal_value").show();
			$(".show_hide_level_three").removeClass("shown").addClass("hidden").text("Expand Calculations");
			window.level_2_calculations_hidden = true;
		}
	});
	
	
	$(".calculation-output-level-3").live("mouseenter mouseleave mousemove click", function(e) {
		var that = $(this);
		//log("BLAH: "+that.parent().attr("class"));
		//if() { var pgeTrue = true; } else { var pgeTrue = false; }
		var that_id = $(that).attr("id");
		var controller = $(that).parent().parent().attr("class").replace(/_usage.*$/, "");
		//var top_offset = $("#zone-branding-wrapper").height()+$(".region-menu-inner").height()+15;
		if(that_id) {
			var info = $("#rib_"+controller+"_"+$(that).attr("id")+"_description");
			var info_width = info.width();
			var info_height = info.height();
			//log("info_height: "+info_height);
			//When the box is larger than one line, it needs to be nudged up a bit
			//if(info_height > 50) { top_offset = top_offset+8; }
			
			//log("Show/Hide Info Box: "+info.attr("id"));
			if(e.type === 'mouseenter') {		
				//log("activate hover: #rib_"+controller+"_"+$(that).attr("id")+"_description");
				$(".rate-info-box").fadeOut(100);
				var new_y = $("#"+that_id).position().top+(info_height > 50 ? 8 : 18);
				//log("  y: "+new_y);
				info.css("top", new_y);//.css("left", new_x)
				//info.css("top", that.offset().top-7).css("left", that.offset().left-info_width);
				
				
				if($(that).attr("data-value")) {
					var data_value = $(that).attr("data-value");
					var tmp_html = info.html();
					if(info && tmp_html && data_value) {
						info.html(tmp_html.replace(/\{data\}/, data_value));
					} else {
						log(
							"Error... Missing data to show pop-up:"
							+"\n  ^--> info: "+info.attr('id')
							+"\n  ^--> tmp_html: "+tmp_html
							+"\n  ^--> data_value: "+data_value
						);
					}
				}
				
				info.fadeIn(100);
				clearTimeout(window.infoTimeout);
			}
			if(e.type === 'mouseleave') {				
				window.infoTimeout = setTimeout(function(){
			        info.fadeOut(100);
				}, window.infoTimeoutTime);
			}
			if(e.type === 'mousemove') {
				if(that.attr("class").match(/pge/)) { 
					var off_set = 0;
					$(".rate-info-box").css("width", window.defaultToolTipWidth+"px");
					if($(window).width() > 979) { off_set = 123; }
					if($(window).width() > 1219) { off_set = 243; }
					if($(window).width() < 740) { off_set = -10; $(".rate-info-box").css("width", $(".rate-output-mce").width()+"px"); }
					var x = this.offsetLeft+off_set;
					$(".info-arrow").removeClass("left-aligned");
				} else {
					var off_set = 0;
					if($(window).width() > 979) { off_set = 5; }
					var x = this.offsetLeft+$(".rate-output-mce").width()+15+off_set;
					$(".info-arrow").addClass("left-aligned");
				}
				var y = $(that).offsetTop;
				info.css("top", y).css("left", x);
				//log("x: "+x+"    y: "+y+"\n");
			}
		}
		
	});
	
	//http://jsonlint.com/
	//http://www.jsoneditoronline.org/

	
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function log(msg) { 
		if(console) { console.log(msg); } 
	}
	function str_to_class(str) {
		str = str.replace(/\//, "");
		str = str.replace(/\s\s/, "_");
		str = str.replace(/\s|-/g, "_");
		str = str.toLowerCase();
		return str;
	}
	function calculate_rate(controller, iteration, usage) {
		log("\n ------------------------ \n\nfunction calculate_rate();");
		controller = controller.replace(/_input_.*/, '');
		log("Usage: "+usage+"\nController: "+controller+"\nIteration: "+iteration);
		
		var rate = "#"+controller+"_calc_"+iteration;
		var demand_used = false;
		var users_demand = 0;
		var demand_rates = new Array();
		var usages = new Array();
		var percentages = new Array();
		var demand_html = "";
		var mceRates_level_3 = "";
		var pgeRates_level_3 = "";
		var total_usage = 0;
		var primaryUsage = 0;
		var level_three_calcs = "";
		var level_three_combined_rate = 0;
		var level_three_combined_rate = 0;
		var level_three_subtotal = 0;
		var level_three_prev_subtotal = 0;
		var level_three_subtotal = 0;
		var demand_subtotal = 0;
		var cia_subtotal = 0;
		var distro_subtotal = 0;
		var sub_total = 0;
		var pgePrice = 0;
		var pgeRate  = 0;
		var pgeRatePrice = 0;
		var mcePrice = 0;
		var mceRate  = 0;
		var mceRatePrice = 0;
		var dataFound = false;
		var t1 = 0;
		var t2 = 0;
		var t3 = 0;
		var t4 = 0;
		var pt1 = 0;
		var pt2 = 0;
		var pt3 = 0;
		var pt4 = 0;
		var CIA = "";
		var distro = "";
		var CIA_used = false;
		var t1_log = "";
		var t2_log = "";
		var t3_log = "";
		var t4_log = "";
		
		$(".group-wrapper").removeClass("active");
		
		if(!iteration) { iteration = "0"; }
		var that = '#'+controller+'_text_'+iteration;
		
		if(controller.match(/^res/)) {
			//log("residential customer");
			$(".rate-schedules-res").css("opacity", "1.0");
			$(".rate-schedules-com").css("opacity", "0.5");
		} else {
			//log("commercial customer");
			$(".rate-schedules-com").css("opacity", "1.0");
			$(".rate-schedules-res").css("opacity", "0.5");
		}
		
		
		//controller:\""+that+"\", iteration:\""+iteration+"\", usage:\""+usage+"\"
		if(usage > -1 && controller && iteration > -1) {
			log("Usage: "+usage+"\nController: "+controller+"\nIteration: "+iteration);
			$(that).val(usage);
			for(var i = 0; i < window.master_data['rates'].length; i++) {
				var crnt = str_to_class(window.master_data['rates'][i]['rate_schedule']);
				log("Crnt: "+crnt);
				if(crnt === controller) {
					
					dataFound = true;
					
					//Set target rate schedule based on var "controller"
					var schedule = window.master_data['rates'][i];
					for(var j = 0; j < schedule['time_period_rates'].length; j++){
						if(schedule['time_period_rates'][j]['primary']) {
							var primary = j;
							log("Primary: "+schedule['time_period_rates'][j]['time_period']);
						}
					}
					
					//Short hand for target time period (Summer Peak, Summer Partial Peak, Summer Off Peak, Winter Peak, etc)
					var target_time_period = schedule['time_period_rates'][iteration]['time_period'];
					log("    time_period: "+target_time_period);
					var time_period = target_time_period;
					
					//Short hand for target time period's season (Summer and Winter)
					var time_period_group = schedule['time_period_rates'][iteration]['time_period_group'];
					if(time_period_group === "Summer") { var not_group = "Winter"; } else { var not_group = "Summer"; }
					$("#group_"+controller+"_"+str_to_class(time_period_group)).addClass("active");		
					log("    time_period_group: #group_"+controller+"_"+str_to_class(time_period_group));
					
					//"level_three_data" and "level_three_vars" and "level_three_subtotal" all refer to basic
					//delivery charges that only need to be multiplied by the season's combined usage
					var level_three_data = new Array();
					var level_three_vars = schedule['level_three'][0]['rateAbrs'].split(/,/);
					for(var j = 0; j < level_three_vars.length; j++) {
						var tmp_l3 = level_three_vars[j];
						level_three_data[str_to_class(tmp_l3)] = parseFloat(schedule['level_three'][0][tmp_l3]);
						log("    Level 3 ["+j+"]: "+tmp_l3+" = "+level_three_data[str_to_class(tmp_l3)]);
					}
					//Cannot calculate now, because total usage is calculated later, and is necessary in calculations
					
					log("Build demand based calculations: "+schedule['level_three'][0]['demand_rates']);
					if(schedule['level_three'][0]['demand_rates']) {
						demand_used = true;
						demand_rates = schedule['level_three'][0]['demand_rates'].split(/,/);
						users_demand = parseFloat($("#"+controller+"_demand_"+iteration).val());	
						log("User's Demand: "+users_demand);
						//Build HTML for demand charges
						if(demand_used && demand_rates && users_demand > -1) {
							for(var j = 0; j < demand_rates.length; j++) {
								var demand_name = demand_rates[j];
								var demand_rate = parseFloat(schedule['level_three'][0][demand_name]);
								if(!demand_name.match(not_group)) {
									demand_subtotal = demand_subtotal+(users_demand*demand_rate);
									log('    Demand['+demand_name+']: '+demand_rate);
									demand_html = demand_html.concat(									
										 '<div class="calculation-output-level-3 mce-output-level-3" id="'+str_to_class(demand_name)+'_dmd" data-value="'+demand_rate+'">'
										 	+'(&nbsp;<span class="level-three-sub-title">'+demand_name.replace(/mer|ter/, '')+' Dmd:</span>'
										 	+'<span class="calc-val">'+(users_demand*demand_rate).toFixed(2)+'</span>&nbsp;)&nbsp;+'
										 +'</div>'
									);
								}
							}
						}			
					}
										
					
					//Since the CIA calculations are dependent on the percentage of each time period within a season,
					//the hover boxes have to be completely overwritten each time a new usage is entered.
					$("#rib_"+controller+"_cia_t1_description").html(schedule['descriptions'][0]['CIA_T1_description']);
					$("#rib_"+controller+"_cia_t2_description").html(schedule['descriptions'][0]['CIA_T2_description']);
					$("#rib_"+controller+"_cia_t3_description").html(schedule['descriptions'][0]['CIA_T3_description']);
					$("#rib_"+controller+"_cia_t4_description").html(schedule['descriptions'][0]['CIA_T4_description']);
					
					break;
				}
			}
			if(dataFound) {
				log("Match Found");
				var offset = 0;
				for(var j = 0; j < schedule['time_period_info'].length; j++) {
					if(schedule['time_period_info'][j]['time_period_group'] === time_period_group) {
						var group_info = schedule['time_period_info'][j];
						var last_threshold = group_info['T1_threshold']+group_info['T2_threshold']+group_info['T3_threshold'];
						var number_in_group = parseInt(group_info['number_in_group']);
						log("match found: "+group_info['time_period_group']);
						break;
					} else {
						offset = parseInt(schedule['time_period_info'][j]['number_in_group']);
					}
					log("Not: "+schedule['time_period_info'][j]['time_period_group']);
				}
				
				log("Offset: "+offset);
				for(var s = offset; s < (number_in_group+offset); s++) {
					var tmp = (parseInt($("#"+controller+"_text_"+s).val()) ? parseInt($("#"+controller+"_text_"+s).val()) : usage);
					log("   Usage["+s+"]: "+tmp);
					usages.push(tmp);
					total_usage = total_usage+tmp;
					mceRatePrice = mceRatePrice+(tmp*+schedule['time_period_rates'][s]['mceRate']);
					mceRates_level_3 = mceRates_level_3.concat(
						 '<div class="calculation-output-level-3 mce-output-level-3" id="'+str_to_class(schedule['time_period_rates'][s]['time_period'])+'_mcerate" data-value="'+schedule['time_period_rates'][s]['mceRate']+'">'
						 	+'(&nbsp;<span class="level-three-sub-title">'+schedule['time_period_rates'][s]['time_period'].replace(/Summer\s|Winter\s/, '')+':</span>'
						 	+'<span class="calc-val">'+(tmp*+schedule['time_period_rates'][s]['mceRate']).toFixed(2)+'</span>&nbsp;)&nbsp;+'
						 +'</div>'
					);					
					pgeRatePrice = pgeRatePrice+(tmp*+schedule['time_period_rates'][s]['pgeRate']);
					pgeRates_level_3 = pgeRates_level_3.concat(
						 '<div class="calculation-output-level-3 pge-output-level-3" id="'+str_to_class(schedule['time_period_rates'][s]['time_period'])+'_pgerate" data-value="'+schedule['time_period_rates'][s]['pgeRate']+'">'
						 	+'(&nbsp;<span class="level-three-sub-title">'+schedule['time_period_rates'][s]['time_period'].replace(/Summer\s|Winter\s/, '')+':</span>'
						 	+'<span class="calc-val">'+(tmp*+schedule['time_period_rates'][s]['pgeRate']).toFixed(2)+'</span>&nbsp;)&nbsp;+'
						 +'</div>'
					);
					
					if(primary === s) {
						primaryUsage = tmp;
					}
				}
				if(!primaryUsage) { primaryUsage = total_usage; }
				
				//If a demand value is present, add specific mce/pge demand rates to the calculations
				if(demand_used) {
					for(var s = offset; s < (number_in_group+offset); s++) {
						var tmp = parseInt($("#"+controller+"_demand_"+s).val());
						mceRatePrice = mceRatePrice+(tmp*+schedule['time_period_rates'][s]['mce_demand']);
						mceRates_level_3 = mceRates_level_3.concat(
							 '<div class="calculation-output-level-3 mce-output-level-3" id="mce_'+str_to_class(schedule['time_period_rates'][s]['time_period'])+'_demand" data-value="'+schedule['time_period_rates'][s]['mce_demand']+'">'
							 	+'(&nbsp;<span class="level-three-sub-title">'+schedule['time_period_rates'][s]['time_period'].replace(/Summer\s|Winter\s|mer|ter/, '')+' Dmd:</span>'
							 	+'<span class="calc-val">'+(tmp*+schedule['time_period_rates'][s]['mce_demand']).toFixed(2)+'</span>&nbsp;)&nbsp;+'
							 +'</div>'
						);					
						pgeRatePrice = pgeRatePrice+(tmp*+schedule['time_period_rates'][s]['pge_demand']);
						pgeRates_level_3 = pgeRates_level_3.concat(
							 '<div class="calculation-output-level-3 pge-output-level-3" id="pge_'+str_to_class(schedule['time_period_rates'][s]['time_period'])+'_demand" data-value="'+schedule['time_period_rates'][s]['pge_demand']+'">'
							 	+'(&nbsp;<span class="level-three-sub-title">'+schedule['time_period_rates'][s]['time_period'].replace(/Summer\s|Winter\s|mer|ter/, '')+' Dmd:</span>'
							 	+'<span class="calc-val">'+(tmp*+schedule['time_period_rates'][s]['pge_demand']).toFixed(2)+'</span>&nbsp;)&nbsp;+'
							 +'</div>'
						);
					}
				} 
				
				var pciaPrice = parseFloat(total_usage*schedule['level_two'][0]['PCIA']);
				var franFeePrice = parseFloat(total_usage*schedule['level_two'][0]['franchiseFee']);
				//var additional_charges = parseFloat((primaryUsage*schedule['level_two'][0]['PCIA'])+(tmp*schedule['level_two'][0]['franchiseFee']));
				var additional_charges = pciaPrice+franFeePrice;
				var pciaRate = schedule['level_two'][0]['PCIA'];
				var franFeeRate = schedule['level_two'][0]['franchiseFee'];
				
				log("Total Usage: "+total_usage);
				//var tCIA = "";
				var ratios = new Array();
				for(var s = 0; s < number_in_group; s++) {
					var tmp = (parseInt(usages[s])/parseInt(total_usage));
					ratios[s] = (parseInt(usages[s])/parseInt(total_usage));
					log(ratios[s]+" :ratio["+s+"]: "+tmp+" = "+usages[s]+" / "+total_usage);
					var crnt= schedule['time_period_rates'][(offset+s)];
					if(crnt['distribution']) {
						distro_subtotal = parseFloat(distro_subtotal)+(usages[s]*crnt['distribution']);
						distro = distro.concat(
							'<div class="calculation-output-level-3 mce-output-level-3" id="'+str_to_class(crnt['time_period'])+'_dist" data-value="'+crnt['distribution']+'">'
							 	+'(&nbsp;<span class="level-three-sub-title">'+crnt['time_period'].replace(/Summer\s|Winter\s/, '')+' Dist:</span>'
							 	+'<span class="calc-val">'+(usages[s]*crnt['distribution']).toFixed(2)+'</span>&nbsp;)&nbsp;+'
							 +'</div>'
						);
					}
					if(!tmp) { tmp = "0"; }
					//log("1tmp: "+tmp);
					if(crnt['CIA_T1_rate']) {
						CIA_used = true;
						//log("Initialize CIA: "+tmp.toFixed(3)+"\n  -> T1 sub total: "+t1.toFixed(3)+"\n  -> T2 sub total: "+t2.toFixed(3)+"\n  -> T3 sub total: "+t3.toFixed(3)+"\n  -> T4 sub total: "+t4.toFixed(3));
						pt1 = t1;
						pt2 = t2; 
						pt3 = t3;
						pt4 = t4;
						//log("T1: "+crnt['CIA_T1_rate']);
						percentages.push(tmp);
						
						//log("  ?--: is total_usage["+total_usage+"] > T1_threshold["+parseFloat(group_info['T1_threshold'])+"]");
						if(total_usage > parseFloat(group_info['T1_threshold'])) {					
							t1 = (t1)+(((tmp*group_info['T1_threshold']).toFixed(5))*(crnt['CIA_T1_rate']));
							if(number_in_group < 2) { 
								t2 = (t2)+(((tmp*group_info['T2_threshold']).toFixed(5))*(crnt['CIA_T2_rate']));
							}
							
							t1_log = t1_log.concat(
								 (number_in_group > 1 ? '\n' : '' )+"[("
								+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
								+group_info['T1_threshold']+":T1_threshold)"
								+" * "
								+crnt['CIA_T1_rate']+":T1_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
								//+(t1 !== 0 ? ':'+t1.toFixed(2) : '')
								+" + "
							);
						} else { 
							if(number_in_group < 2) {
								t1 = total_usage*crnt['CIA_T1_rate']; 
								t1_log = t1_log.concat("[("
									+total_usage+":total_usage)"
									+" * "
									+crnt['CIA_T1_rate']+":T1_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
									+" + "
								);
							} else {
								t1 = (t1)+(((tmp*total_usage).toFixed(5))*(crnt['CIA_T1_rate']));
								t1_log = t1_log.concat((number_in_group > 1 ? '\n' : '' )+"[("
									+total_usage+":total_usage)"
									+" * "
									+crnt['CIA_T1_rate']+":T1_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
									//+(t1 !== 0 ? ':'+t1.toFixed(2) : '')
									+" + "
								);
							}
							t2 = 0; t3 = 0; t4 = 0; 
						}
						//log("  ?--: is total_usage["+total_usage+"] > (T1_threshold+T2_threshold ["+(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold']))+"])");
						if(total_usage > (parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold']))) {
							if(number_in_group > 1) {
								//t2 = parseFloat(t2)+parseFloat(((tmp*(total_usage-group_info['T1_threshold'])).toFixed(5))*(crnt['CIA_T2_rate']));
								t2 = parseFloat(t2)+((tmp*group_info['T2_threshold'])*crnt['CIA_T2_rate']);
							} else {
								//Applicable Schedules: 
								//t2 = (total_usage-parseFloat(group_info['T1_threshold']))*crnt['CIA_T2_rate']; 
								
								//Applicable Schedules: RES-1, RES-6
								t2 = (group_info['T2_threshold']*crnt['CIA_T2_rate']);
							}
							t3 = (t3)+(((tmp*group_info['T3_threshold']).toFixed(5))*(crnt['CIA_T3_rate']));
						
							t2_log = t2_log.concat((number_in_group > 1 ? '\n' : '' )+"[("
								+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
								+group_info['T2_threshold']+":T2_threshold ~ "+(tmp*group_info['T2_threshold']).toFixed(2)+")"
								+" * "
								+crnt['CIA_T2_rate']+":T2_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate] ~ "
								+"$"+((tmp*group_info['T2_threshold'])*crnt['CIA_T2_rate']).toFixed(2)
								//+(t2 !== 0 ? ':'+t2.toFixed(2) : '')
								+" + ");
						} else { 
							if((total_usage-parseFloat(group_info['T1_threshold'])) > 0) {
								if(number_in_group > 1) {
									t2 = parseFloat(t2)+parseFloat(((tmp*(total_usage-group_info['T1_threshold'])).toFixed(5))*(crnt['CIA_T2_rate']));
								} else {
									t2 = (total_usage-parseFloat(group_info['T1_threshold']))*crnt['CIA_T2_rate']; 
								}
								
								t2_log = t2_log.concat((number_in_group > 1 ? '\n' : '' )+"[("
									+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
									+(total_usage-group_info['T1_threshold'])+":remaining_usage)"
									+" * "
									+crnt['CIA_T2_rate']+":T2_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
									+((tmp*(total_usage-group_info['T1_threshold'])).toFixed(5))*(crnt['CIA_T2_rate'])
									//+(t2 !== 0 ? ':'+t2.toFixed(2) : '')
									+" + "
								);
							} else { 
								t2 = 0; 
								t2_log = t2_log.concat((number_in_group > 1 ? '\n' : '' )+"[(0:remaining_usage * "
									+crnt['CIA_T2_rate']+":T2_threshold)] + ");
							}
							t3 = 0; t4 = 0; 
						}
						//log("  ?--: is total_usage["+total_usage+"] > (T1_threshold+T2_threshold+T3_threshold ["+(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold'])+parseFloat(group_info['T3_threshold']))+"])");
						if(total_usage > (parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold'])+parseFloat(group_info['T3_threshold']))) {
							t4 = (t4)+(((usages[s]-((tmp*group_info['T1_threshold'])+(tmp*group_info['T2_threshold'])+(tmp*group_info['T3_threshold'])))*(crnt['CIA_T4_rate'])));
							t3_log = t3_log.concat((number_in_group > 1 ? '\n' : '' )+"[("
								+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
								+group_info['T3_threshold']+":T3_threshold)"
								+" * "
								+crnt['CIA_T3_rate']+":T3_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
								//+(t3 !== 0 ? ':'+t3.toFixed(2) : ':0.00')
								+" + "
							);

						} else { 
							if((total_usage-(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold']))) > 0) {
								t3 = (total_usage-(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold'])))*crnt['CIA_T3_rate'];
								
								t3_log = t3_log.concat((number_in_group > 1 ? '\n' : '' )+"[("
									+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
									+(total_usage-(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold']))).toFixed()
									+":remaining_usage)"
									//+((total_usage-(parseFloat(group_info['T1_threshold'])+parseFloat(group_info['T2_threshold'])))*crnt['CIA_T3_rate']).toFixed(2)
									+" * "
									+crnt['CIA_T3_rate']+":T3_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")+"_rate]"
									//+(t3 !== 0 ? ':'+t3.toFixed(2) : ':0.00')
									+" + "
								);
							} else { 
								t3 = 0; 
								t3_log = t3_log.concat("[(0:remaining_usage * "
									+crnt['CIA_T3_rate']+":T3_"+crnt['time_period'].replace(/Summer\s|Winter\s/, "").replace(/\s/g, "_")
									+"_threshold)] + "
								);
							}
							t4 = 0; 
						}
						//log("T4: "+((tmp*group_info['T1_threshold'])+(tmp*group_info['T2_threshold'])+(tmp*group_info['T3_threshold'])));
						CIA_used = true;
					}
					
					t4_log = t4_log.concat((number_in_group > 1 ? '\n' : '' )+"[\n&nbsp;&nbsp;"+usages[s]+"-"
						+"{<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;("
						+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
						+group_info['T1_threshold']+":T1_threshold)<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ "
						+"("+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
						+group_info['T2_threshold']+":T2_threshold)<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ "
						+"("+((tmp*100).toFixed() >= 99.999999 ? '' : (tmp*100).toFixed()+'% of ')
						+group_info['T3_threshold']+":T3_threshold)<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}"
						+" * "+crnt['CIA_T4_rate']+":T4_rate<br />]"
						//+(t4 !== 0 ? ':'+t4.toFixed(2) : '')
						+" + "
					);
				}
				t1_log = t1_log.substring(0, t1_log.length-3);
				t2_log = t2_log.substring(0, t2_log.length-3);
				t3_log = t3_log.substring(0, t3_log.length-3);
				t4_log = t4_log.substring(0, t4_log.length-3);
				t1_log = t1_log.concat("\n    = "+t1.toFixed(2)+"<span class=\"info-arrow\"></span>");
				t2_log = t2_log.concat("\n    = "+t2.toFixed(2)+"<span class=\"info-arrow\"></span>");
				t3_log = t3_log.concat("\n    = "+t3.toFixed(2)+"<span class=\"info-arrow\"></span>");
				t4_log = t4_log.concat("\n    = "+t4.toFixed(2)+"<span class=\"info-arrow\"></span>");
				for(var w = 0; w < ratios.length; w++) {
					log("ratios["+w+"]: "+ratios[w]);
				}
				if(CIA_used) {
					log("CIA T1 [0 - "+group_info['T1_threshold']+"]: \n"+t1_log+"\n");
					var t1_html = $("#rib_"+controller+"_cia_t1_description").html();
					if(t1_html) {
						var tmp_html = 
							 "[Usage Range: 0 - "+group_info['T1_threshold']+"]: "
							+t1_log.replace(/\[/g, "\n<br />[").replace(/=/, "\n<br />=");
						$("#rib_"+controller+"_cia_t1_description")
							.css("min-width", "330px")
							.css("max-width", "330px")
							.html(t1_html.replace(/\{CIA_Formula\}/, tmp_html));
						log("#rib_"+controller+"_cia_t1_description: \n"+tmp_html);
					}
					log("CIA T2 ["+(group_info['T1_threshold'])+" - "+(group_info['T1_threshold']+group_info['T2_threshold'])+"]: \n"+t2_log+"\n");
					var t2_html = $("#rib_"+controller+"_cia_t2_description").html();
					if(t2_html) {
						var tmp_html = "[Usage Range: "+(group_info['T1_threshold'])
							+" - "+(group_info['T1_threshold']+group_info['T2_threshold'])+"]: "
							+t2_log.replace(/\[/g, "\n<br />[").replace(/=/, "\n<br />=");
						$("#rib_"+controller+"_cia_t2_description")
							.css("min-width", "330px")
							.css("max-width", "330px")
							.html(t2_html.replace(/\{CIA_Formula\}/, tmp_html));
					}
					log("CIA T3 ["+(group_info['T1_threshold']+group_info['T2_threshold'])+" - "+(group_info['T1_threshold']+group_info['T2_threshold']+group_info['T3_threshold'])+"]: \n"+t3_log+"\n");
					var t3_html = $("#rib_"+controller+"_cia_t3_description").html();
					if(t3_html) {
						var tmp_html = "[Usage Range: "+(group_info['T1_threshold']+group_info['T2_threshold'])
							+" - "+(group_info['T1_threshold']+group_info['T2_threshold']
							+group_info['T3_threshold'])+"]: "
							+t3_log.replace(/\[/g, "\n<br />[").replace(/=/, "\n<br />=");
						$("#rib_"+controller+"_cia_t3_description")
							.css("min-width", "330px")
							.css("max-width", "330px")
							.html(t3_html.replace(/\{CIA_Formula\}/, tmp_html));
					}
					log("CIA T4 ["+(group_info['T1_threshold']+group_info['T2_threshold']+group_info['T3_threshold'])+"+]: \n"+t4_log+"\n");
					var t4_html = $("#rib_"+controller+"_cia_t4_description").html();
					if(t4_html) {
						var tmp_html = "[Usage Range: "+(group_info['T1_threshold']+group_info['T2_threshold']+group_info['T3_threshold'])+"+]: <br />"
						+t4_log.replace(/=/, "\n<br />=");
						$("#rib_"+controller+"_cia_t4_description")
							.css("min-width", "330px")
							.css("max-width", "330px")
							.html(t4_html.replace(/\{CIA_Formula\}/, tmp_html));
					}
					/*
					CIA = CIA.concat(
					 '<div class="calculation-output-level-3" id="cia_t1">'
					 	+'(&nbsp;<span class="level-three-sub-title">CIA T1:</span>'
					 	+'<span class="calc-val">'+(t1).toFixed(2)+'</span>&nbsp;)&nbsp;+'
					 +'</div>'
					 +'<div class="calculation-output-level-3" id="cia_t2">'
					 	+'(&nbsp;<span class="level-three-sub-title">CIA T2:</span>'
					 	+'<span class="calc-val">'+(t2).toFixed(2)+'</span>&nbsp;)&nbsp;+'
					 +'</div>'
					 +'<div class="calculation-output-level-3" id="cia_t3">'
					 	+'(&nbsp;<span class="level-three-sub-title">CIA T3:</span>'
					 	+'<span class="calc-val">'+(t3).toFixed(2)+'</span>&nbsp;)&nbsp;+'
					 +'</div>'
					 +'<div class="calculation-output-level-3" id="cia_t4">'
					 	+'(&nbsp;<span class="level-three-sub-title">CIA T4:</span>'
					 	+'<span class="calc-val">'+(t4).toFixed(2)+'</span>&nbsp;)&nbsp;+'
					 +'</div>'
					);
					*/
					//log("t1: "+t1.toFixed(2)+"\nt2: "+t2.toFixed(2)+"\nt3: "+t3.toFixed(2)+"\nt4: "+t4.toFixed(2));
					cia_subtotal = parseFloat(t1+t2+t3+t4);
					/*
					*/
					CIA = CIA.concat(
						 '<div class="calculation-output-level-3 mce-output-level-3" id="cia_t4">'
						+'(&nbsp;<span class="level-three-sub-title">Conservation Incentive Adjustment:</span>'
					 	+'<span class="calc-val">'+(cia_subtotal).toFixed(2)+'</span>&nbsp;)&nbsp;+'
					 	+'</div>'
					);
				}
				
				//Build HTML for delivery charges
				for(var cls in level_three_vars) {
					level_three_calcs = level_three_calcs.concat(
						 '<div class="calculation-output-level-3 mce-output-level-3" id="'+str_to_class(level_three_vars[cls])+'" data-value="'+level_three_data[str_to_class(level_three_vars[cls])]+'">'
						 	+'(&nbsp;<span class="level-three-sub-title">'+level_three_vars[cls]+':</span>'
						 	+'<span class="calc-val">'+(total_usage*level_three_data[str_to_class(level_three_vars[cls])]).toFixed(2)+'</span>&nbsp;)&nbsp;+'
						 +'</div>'
					);
					level_three_prev_subtotal = level_three_subtotal;
					level_three_subtotal = parseFloat(level_three_subtotal)+parseFloat(total_usage*parseFloat(level_three_data[str_to_class(level_three_vars[cls])]));
					level_three_combined_rate = parseFloat(level_three_combined_rate)+parseFloat(level_three_data[str_to_class(level_three_vars[cls])]);
					log("Level 3 Subtotal: "+total_usage+" * "+parseFloat(level_three_data[str_to_class(level_three_vars[cls])])+" = "+parseFloat(total_usage*parseFloat(level_three_data[str_to_class(level_three_vars[cls])])).toFixed(2)+" + ("+level_three_prev_subtotal+") = "+level_three_subtotal);
				}	
				level_three_subtotal = parseFloat(level_three_subtotal+sub_total);
					
				//level_three_calcs = level_three_calcs.concat();
				
				mcePrice = (level_three_subtotal)+(demand_subtotal)+(distro_subtotal)+(cia_subtotal)+(mceRatePrice)+(additional_charges);
				pgePrice = (level_three_subtotal)+(demand_subtotal)+(distro_subtotal)+(cia_subtotal)+(pgeRatePrice);
				if(window.level_2_calculations_hidden) { window.level_3_calculations_hidden = true; }
				
				$("#rate-output").removeClass().addClass(controller+"_usage_"+iteration+"_"+usage+(users_demand ? '_'+users_demand : '')).html(
					 '<div class="rate-output-mce">'
						+'<div class="calculation-header '+(window.level_2_calculations_hidden ? 'hidden' : 'shown')+'">MCE '+time_period_group+'</div>'
						+'<div class="calculation-output-subtotal-3">'
							+'<button class="show_hide_level_three '+(window.level_3_calculations_hidden ? 'hidden' : 'shown')+'">'
								+(window.level_3_calculations_hidden ? 'Expand Calculations' : 'Collapse Calculations')
							+'</button>'
							+'<br />'
							+'<div class="level_three_subtotal">Delivery Charges:<br />'
								+'<span class="calc-val level_three_subtotal_value">'+(level_three_subtotal+cia_subtotal+demand_subtotal+distro_subtotal).toFixed(2)+'</span>'
							+'</div>'
						+'</div>'
						+level_three_calcs
						+(distro ? distro : '')
						+(CIA ? CIA : '')
						+(demand_used ? demand_html : '')
						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'
							+(level_three_subtotal+cia_subtotal+demand_subtotal+distro_subtotal).toFixed(2)
						+'</span></div>'
						//+(CIA ? '<div class="calculation-output-subtotal-3">CIA:<br />' : '')
						//+(CIA ? '<span class="calc-val level_three_subtotal_value">'+(cia_subtotal).toFixed(2)+'</span></div>' : '')
						//+(CIA ? CIA : '')
						//+(CIA ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(cia_subtotal).toFixed(2)+'</span></div>' : '')
						
						//+(demand_used ? '<div class="calculation-output-subtotal-3">Demand Charges:<br />' : '')
						//+(demand_used ? '<span class="calc-val level_three_subtotal_value">'+(demand_subtotal).toFixed(2)+'</span></div>' : '')
						//+(demand_used ? demand_html : '')
						//+(demand_used ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(demand_subtotal).toFixed(2)+'</span></div>' : '')	
											
						//+(distro ? '<div class="calculation-output-subtotal-3">Distribution Charges:<br />' : '')
						//+(distro ? '<span class="calc-val level_three_subtotal_value">'+(distro_subtotal).toFixed(2)+'</span></div>' : '')
						//+(distro ? distro : '')
						//+(distro ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(distro_subtotal).toFixed(2)+'</span></div>' : '')			
						+'<div class="calculation-output-subtotal-3">MCE Generation Charges:<br />'
							+'<span class="calc-val level_three_subtotal_value">'+(mceRatePrice).toFixed(2)+'</span>'
						+'</div>'
						+mceRates_level_3
						//+'<div class="calculation-output-level-3 mce-output-level-3" id="pcia" data-value="'+pciaRate+'">(&nbsp;PCIA: $'+(pciaPrice).toFixed(2)+'&nbsp;)&nbsp;+</div>'
						//+'<div class="calculation-output-level-3 mce-output-level-3" id="franchisefee" data-value="'+franFeeRate+'">'
						//	+'(&nbsp;Franchise Fee: $'+(franFeePrice).toFixed(2)+'&nbsp;)&nbsp;+'
						//+'</div>'
						//+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(mceRatePrice+additional_charges).toFixed(2)+'</span></div>'
						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(mceRatePrice).toFixed(2)+'</span></div>'
						+'<div class="calculation-output-subtotal-3">Additional PG&amp;E Fees: <br />'
							+'<span class="calc-val level_three_subtotal_value">'+(additional_charges).toFixed(2)+'</span>'
						+'</div>'
						+'<div class="calculation-output-level-3" id="pcia" data-value="'+pciaRate+'">(&nbsp;PCIA: $'+(pciaPrice).toFixed(2)+'&nbsp;)&nbsp;+</div>'
						+'<div class="calculation-output-level-3" id="franchisefee" data-value="'+franFeeRate+'">'
							+'(&nbsp;Franchise Fee: $'+(franFeePrice).toFixed(2)+'&nbsp;)&nbsp;+'
						+'</div>'
						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(additional_charges).toFixed(2)+'</span></div>'
						+'<div class="calculation-output-spacer">&nbsp;</div>'
						+'<div class="calculation-ouput-level-1">Total: <span class="calc-val">'+(mcePrice).toFixed(2)+'</span></div>'
					+'</div>'
					
					+'<div class="rate-output-pge">'
						+'<div class="calculation-header '+(window.level_2_calculations_hidden ? 'hidden' : 'shown')+'">PG&E '+time_period_group+'</div>'
						+'<div class="calculation-output-subtotal-3">'
							+'<button class="show_hide_level_three '+(window.level_3_calculations_hidden ? 'hidden' : 'shown')+'">'
								+(window.level_3_calculations_hidden ? 'Expand Calculations' : 'Collapse Calculations')
							+'</button>'
							+'<br />'
							+'<div class="level_three_subtotal">Delivery Charges:<br />'
							+'<span class="calc-val level_three_subtotal_value">'+(level_three_subtotal+cia_subtotal+demand_subtotal+distro_subtotal).toFixed(2)+'</span></div>'
						+'</div>'
						+level_three_calcs.replace(/mce-output-level-3/g, "pge-output-level-3")
						+(distro ? distro.replace(/mce-output-level-3/g, "pge-output-level-3") : '')
						+(CIA ? CIA.replace(/mce-output-level-3/g, "pge-output-level-3") : '')
						+(demand_used ? demand_html.replace(/mce-output-level-3/g, "pge-output-level-3") : '')
						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'
							+(level_three_subtotal+cia_subtotal+demand_subtotal+distro_subtotal).toFixed(2)
						+'</span></div>'
						//+(CIA ? '<div class="calculation-output-subtotal-3">CIA:<br />' : '')
						//+(CIA ? '<span class="calc-val level_three_subtotal_value">'+(cia_subtotal).toFixed(2)+'</span></div>' : '')
						//+(CIA ? CIA : '')
						//+(CIA ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(cia_subtotal).toFixed(2)+'</span></div>' : '')
						
						//+(demand_used ? '<div class="calculation-output-subtotal-3">Demand Charges:<br />' : '')
						//+(demand_used ? '<span class="calc-val level_three_subtotal_value">'+(demand_subtotal).toFixed(2)+'</span></div>' : '')
						//+(demand_used ? demand_html : '')
						//+(demand_used ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(demand_subtotal).toFixed(2)+'</span></div>' : '')	
														
						//+(distro ? '<div class="calculation-output-subtotal-3">Distribution:<br />' : '')
						//+(distro ? '<span class="calc-val level_three_subtotal_value">'+(distro_subtotal).toFixed(2)+'</span></div>' : '')
						//+(distro ? distro : '')
						//+(distro ? '<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(distro_subtotal).toFixed(2)+'</span></div>' : '')
						+'<div class="calculation-output-subtotal-3">PG&amp;E Generation Charges:<br />'
							+'<span class="calc-val level_three_subtotal_value">'+(pgeRatePrice).toFixed(2)+'</span>'
						+'</div>'
						+pgeRates_level_3
						//+'<div class="calculation-output-level-3">&nbsp;</div>'
						//+'<div class="calculation-output-level-3">&nbsp;</div>'

						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">'+(pgeRatePrice).toFixed(2)+'</span></div>'
						+'<div class="calculation-output-subtotal-3">Additional PG&amp;E Fees:<br /> '
							+'<span class="calc-val level_three_subtotal_value">0.00</span>'
						+'</div>'
						+'<div class="calculation-output-level-3" id="pcia" data-value="'+pciaRate+'">(&nbsp;PCIA: $0.00&nbsp;)&nbsp;+</div>'
						+'<div class="calculation-output-level-3" id="franchisefee" data-value="'+franFeeRate+'">'
							+'(&nbsp;Franchise Fee: $0.00&nbsp;)&nbsp;+'
						+'</div>'
						+'<div class="calculation-output-level-3 sub-total">= <span class="calc-val">0.00</span></div>'
						+'<div class="calculation-output-spacer">&nbsp;</div>'
						+'<div class="calculation-output-level-1">Total: <span class="calc-val">'+(pgePrice).toFixed(2)+'</span></div>'
					+'</div>'
				);
				$(".calc-val").formatCurrency({ negativeFormat: '-$%n', roundToDecimalPlace: -1 });
				if(window.level_2_calculations_hidden) { 
					$(".calculation-output-subtotal-3, .calculation-output-level-2").hide();
					$(".calculation-output-spacer").show(); 
				} else { 
					$(".calculation-output-subtotal-3, .calculation-output-level-2").show(); 
					$(".calculation-output-spacer").hide();
				}
				if(window.level_3_calculations_hidden) { 
					$(".calculation-output-level-3").hide();
					$(".level_three_subtotal_value").show(); 
				} else { 
					$(".calculation-output-level-3").show(); 
					$(".level_three_subtotal_value").hide();
				}
				$("#rate-output").fadeIn(300);
				return (mcePrice).toFixed(2);
			} else { log('Error... Could not match "'+crnt+'" to any existing rate schedules'); }
		} else {
			if(usage){
				log("Error: Missing controller and iteration, so cannot find variables.");
			}
			$(that).val("");
		}
	}
});

