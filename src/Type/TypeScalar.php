<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type;


use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeScalar
 * @package Ceive\Dsi\Type
 */
class TypeScalar extends Type{
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		return is_scalar($value);
	}
}


