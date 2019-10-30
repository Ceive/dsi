<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeIterable
 * @package Ceive\Dsi\Type
 */
class TypeIterable extends TypeArray{
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		if(!is_array($value) || !$value instanceof \Traversable){
			return false;
		}
		if($this->each){
			foreach($value as $item){
				if(!$this->each->check($item)){
					return false;
				}
			}
		}
		
		return true;
	}
	
	
}


