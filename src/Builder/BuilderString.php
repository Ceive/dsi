<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder;

use Ceive\Dsi\Builder;
use Ceive\Dsi\Builder\PseudoYAML\DsiParser;
use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class BuilderString
 * @package Ceive\Dsi\Builder
 */
class BuilderString extends Builder{
	
	
	/**
	 * @param $definition
	 * @return Type
	 */
	public function build($definition){
		return (new DsiParser())->parse($definition);
	}
	
}