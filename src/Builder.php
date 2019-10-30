<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Builder
 * @package Ceive\Dsi
 */
abstract class Builder{
	
	/**
	 * @param $definition
	 * @return Type
	 */
	abstract public function build($definition);
	
}