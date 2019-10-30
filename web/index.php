<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

include '../vendor/autoload.php';
?>
<div id="template-engine">
	
</div>
<div id="autocomplete" class="autocomplete">
	
</div>

<button id="getStructureButton" >Получить структуру</button>
<pre id="view-structure"></pre>
<div id="uisi" class="ui-structure-designer">
	
</div>
<!--div class="ui-structure-designer">
	
	<section class="value value-object">
		
		<section class="member">
			<div class="member-key">profile</div>
			<div class="member-types">
				<span class="type type-object">object</span>
			</div>
			<div class="member-value">
				<section class="value value-object">
					<div class="stickers">
						<div class="type type-object">object</div>
					</div>
					
					<section class="member">
						<div class="member-key">username</div>
						<div class="member-types">
							<span class="type type-string">string</span>
						</div>
						<div class="member-value"> <span class="value value-string">Алешка</span> </div>
					</section>
					
					<section class="member">
						<div class="member-key">password</div>
						<div class="member-types">
							<span class="type type-string">string</span>
						</div>
						<div class="member-value"> <span class="value value-string">@JFTL@</span> </div>
					</section>
					
					<section class="member">
						<div class="member-key">last_login</div>
						<div class="member-types">
							<span class="type type-string">string</span>
							<span class="type type-null">null</span>
						</div>
						<div class="member-value"> <span class="value value-null">null</span> </div>
					</section>
					
					<section class="member">
						<div class="member-key">last_info</div>
						<div class="member-types">
							<span class="type type-string">string</span>
							<span class="type type-null">null</span>
						</div>
						<div class="member-value"> <span class="value value-null">null</span> </div>
					</section>
				
				</section>
			</div>
		</section>
	
	</section>
</div-->


<style>
	
	
	.ui-structure-designer{
		font-size:14px;
		color: black;
		font-family: Ubuntu, sans-serif;
	}
	
	.value{
		position: relative;
	}
	.value > .stickers{
		position: absolute;
		left: 0;
		top: -10px;
	}
	.value > .stickers * {
		font-size: 12px;
		text-transform: lowercase;
	}
	.value.value-object{
		/*border-left: 1px solid orangered;*/
	}
	
	.value.value-object .member{
		position:relative;
		display: table-row;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 10px;
		/*border-top: 1px dashed orangered;*/
	}
	.value.value-object .member > *{
		display: table-cell;
	}
	.value.value-object .member-key{
		padding: 10px 10px;
		/*min-width: 100px;*/
		color: #710092;
		font-size: 16px;
		font-weight: bolder;
	}
	.value.value-object .member-types{
		display: flex;
		flex-direction: column;
		padding: 10px 10px;
		min-width: 50px;
	}
	.value.value-object .member-value{
		padding: 10px 10px;
		min-width: 150px;
	}
	.value.value-array{
		
	}
	.value.value-string{
		width:100%;
		color: #27981f;
		padding: 5px;
		border: none;
		border-bottom: 1px dashed #d1d1d1;
	}
	.value.value-string:focus {
		outline: none;
	}
	.value.value-integer{
		width:100%;
		padding: 10px;
		border: none;
		border-bottom: 1px dashed gray;
	}
	.value.value-float{
		width:100%;
		padding: 10px;
		border: none;
		border-bottom: 1px dashed gray;
	}
	.value.value-null{
		width:100%;
		color: #0000de;
		font-weight: bolder;
		text-transform: uppercase;
	}
	.value.value-boolean{
		color: #0000de;

		border: none;
		font-weight: bolder;
		text-transform: uppercase;
	}
	.value.value-boolean:focus {
		outline: none;
	}
	
	.type{
		color: #0000de;
		font-size: 12px;
		text-align: left;
		text-transform: uppercase;
		cursor: pointer;
	}
	.type:hover{
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.27);
	}
	.type.type-object{  }
	.type.type-array{  }
	.type.type-string{  }
	.type.type-integer{  }
	.type.type-float{  }
	.type.type-object{  }
	.type.type-object{  }
	.type.type-object{  }
	.type.type-null{  }

	.value-array > button {
		width: 100%;
		background: #f9f9f9;
		border: 1px solid #dedede;
		border-radius: 2px;
		padding: 5px;
		box-sizing: border-box;
		cursor: pointer;
	}
	.value-array > button:hover {
		background: #ededed;
	}
	.value-array > button:focus {
		outline: none;
	}











	.autocomplete-frame {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.breadcrumbs {
		display:  flex;
		flex-direction: row;
		padding: 5px;
	}
	.breadcrumbs .breadcrumbs-back {background:  floralwhite;border: 1px solid antiquewhite;cursor:  pointer;font-weight:  bolder;color: darkgray;font-size: 24px;}
	.breadcrumbs .breadcrumbs-path {padding: 5px;background:  ghostwhite;flex: 1;}

	.autocomplete-object {

	}

	.autocomplete-object-members {

	}


	.autocomplete-member {
		width: 100%;
		display: table-row;
	}
	.autocomplete-member > * {
		padding: 5px 10px;
	}
	.autocomplete-member-key {
		display:  table-cell;
	}
	.autocomplete-member-types {
		display: table-cell;
	}

	.autocomplete-member-types > * {
		padding: 2px;
	}
	.container {
		border-top: 1px solid lightgoldenrodyellow;
	}

	div#autocomplete {
		font-family: Ubuntu, sans-serif;
		border: 1px solid lightgoldenrodyellow;
		width: 350px;
		margin: 0 auto;
		background: #fdfdfd;
	}
	div#autocomplete * {
		font-size: 16px;
	}

	.autocomplete-member-key {
		cursor: pointer;
	}
	.autocomplete-member-key:hover {
		text-shadow: 1px 1px 1px #00000029;
	}

	.autocomplete-member-key {}

	span.path-segment {
		color: #77d4bb;
		font-weight: bolder;
	}

	.selected {
		padding: 5px;
		border-top: 1px solid lightgoldenrodyellow;
	}




	.template-autocomplete{
		position: absolute;
		top: 50px;
		left: 50px;
		z-index: 2;
		background: white;
		border: 1px solid yellow;
		box-shadow: 2px 2px 15px #00000047;
	}



	.template-area{
		padding: 5px;
		border: 1px solid lightgray;
		border-radius: 2px;
		min-height: 150px;
	}


</style>

<script src="require.js"></script>
<script src="DSI/ceive.dsi.js"></script>
<script>
	
</script>


<script>
	require(['main']);
	
	var car = {
		
		wheels: 4, 	// колеса
		
		doors: 5,	// двери
		
		color: 'dark',	// цвет
		
		engine: {
			cylinders: 6,
			fuel: 'ai92',
			volume: '2.5L',
			oil: '5w30'
		},
		
		passengers: [
			{ name: 'Lesha', role: 'driver' },
			{ name: 'Anna', role: 'FR' },
			{ name: 'Vadik', role: 'RR' },
			{ name: 'Anna', role: 'RL' }
		]
		
	};
	
	
	
</script>