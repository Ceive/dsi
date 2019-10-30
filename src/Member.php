<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class Member
 * @package Ceive\Dsi
 */
class Member{
	
	/** @var bool  */
	public $nullable = false;
	
	/** @var  Type[] */
	public $types = [];
	
	/**
	 * @param Type $type
	 * @return $this
	 */
	public function addType(Type $type){
		$this->types[] = $type;
		return $this;
	}
	
	
	/**
	 * @param bool $nullable
	 * @return $this
	 */
	public function setNullable($nullable = true){
		$this->nullable = $nullable;
		return $this;
	}
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		
		if(is_null($value) && !$this->nullable){
			return false;
		}
		
		foreach($this->types as $type){
			if($type->check($value)){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Получить варианты возможных типов для данного свойства
	 * @return Type[]
	 */
	public function choices(){
		return $this->types;
	}
	
	/**
	 * Узнать, возможен ли NULL как значение этого свойства
	 * @return bool
	 */
	public function isNullable(){
		return $this->nullable;
	}
}


