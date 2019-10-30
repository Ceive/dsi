<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder;


use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeAny
 * @package Ceive\Dsi\Builder
 */
class TypeAny extends Type{
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		return true;
	}
}


