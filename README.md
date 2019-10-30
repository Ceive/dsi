Data Structure Interface
==============================================

Example 
	
	/**
	 * Data Structure Interface
	 */
	$a = <<<DSI
	
	pattern: {string|null}
	pattern_options{}
	params{}
	
	reference: 
		<string>
		<object>
			module: string
			controller: string
			action: string
			
	rules[]
		key:
		expected:
		mode: &strict | &stabilized
		strict: boolean
		stabilized: boolean
		
	options{}
	
	DSI;
