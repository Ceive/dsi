<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type;


use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeNull
 * @package Ceive\Dsi\Type
 */
class TypeNull extends Type{
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		return is_null($value);
	}
}


