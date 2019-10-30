<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type\Scalar;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeInteger
 * @package Ceive\Dsi\Type\Scalar
 */
class TypeInteger extends TypeNumeric{
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		return is_integer($value) || is_float($value);
	}
}


