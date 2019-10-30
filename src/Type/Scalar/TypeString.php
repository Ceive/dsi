<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type\Scalar;

use Ceive\Dsi\Type\TypeScalar;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeString
 * @package Ceive\Dsi\Type\Scalar
 */
class TypeString extends TypeScalar{
	
	public function check($value){
		return is_string($value);
	}
}


