<?php
/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Autocomplete;

use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class TypeReference
 * @package Ceive\Dsi\Type
 * Специальный тип который декорирует получение типа благодаря внутренней ссылке
 *
 */
class TypeReference extends Type{
	
	/**
	 *
	 * Благодаря значению в $reference мы сможем получить тип по ключу из специального пула типов. как Ceive\Data\Autocomplete\Autocomplete в Ceive\Data\Autocomplete
	 * Например ссылка на класс (значение в $reference воспринимается как имя класса)
	 * Например ссылка на какойто псевдо-субъект (значение в $reference воспринимается как название субъекта)
	 *
	 * @var string
	 */
	public $reference;
	
	/**
	 * @var Type
	 */
	public $referencedType;
	
	public function __construct($reference){
		$this->reference = $reference;
	}
	
	/**
	 * @param $value
	 * @return bool
	 */
	public function check($value){
		return $this->getReferencedType()->check($value);
	}
	
	/**
	 * @return Type|null
	 */
	public function getReferencedType(){
		if(!$this->referencedType){
			$this->referencedType = $this->_findReferencedType($this->reference);
		}
		return $this->referencedType;
	}
	
	/**
	 * @param $reference
	 * @return Type|null
	 */
	protected function _findReferencedType($reference){
		return null;
	}
}

