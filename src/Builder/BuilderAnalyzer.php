<?php
/**
 * @created Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Builder;
use Ceive\Dsi\Autocomplete\ObjectManager;
use Ceive\Dsi\Builder;
use Ceive\Dsi\Member;
use Ceive\Dsi\Type;
use Ceive\Dsi\Type\TypeObject;
use phpDocumentor\Reflection\Types\String_;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class BuilderAnalyzer
 * @package Ceive\Dsi\Builder
 */
class BuilderAnalyzer extends Builder{
	
	
	/**
	 * @var ObjectManager
	 */
	public $manager;
	
	/** @var TypeObject[] */
	public $objects = [];
	
	/**
	 * @param $definition
	 * @return Type
	 */
	public function build($definition){
		$object = null;
		switch(true){
			case is_object($definition):
				$object = $this->inspectObject($definition);
				break;
			case is_array($definition):
				$object = $this->inspectArray($definition);
				break;
		}
		return $object;
	}
	
	/**
	 * @param $definition
	 * @return Type\TypeObject
	 */
	protected function inspectObject($definition){
		$classname = $definition instanceof \stdClass? null :get_class($definition);
		
		$members = [];
		
		foreach(get_object_vars($definition) as $k => $v){
			
			$member = $this->makeMemberByValue($v);
			
			$members[$k] = $member;
			
		}
		$object = new Type\TypeObject($classname);
		$object->setMembers($members);
		
		if($definition instanceof \stdClass){
			$object->extraAllowed = true;
		}
		
		
		if($classname){
			$this->manager->register($object);
		}
		$this->objects[] = $object;
		
		return $object;
	}
	
	/**
	 * @param $definition
	 * @return Type\TypeObject
	 */
	protected function inspectArray($definition){
		$members = [];
		foreach($definition as $k => $v){
			$members[$k] = $this->makeMemberByValue($v);
		}
		$object = new Type\TypeObject(null);
		$object->setMembers($members);
		
		$object->extraAllowed = true;
		
		$this->objects[] = $object;
		
		return $object;
	}
	
	/**
	 * @param $value
	 * @return Member
	 */
	protected function makeMemberByValue($value){
		$member = new Member();
		$type = null;
		
		if(is_null($value)){
			$member->nullable = true;
		}else{
			$type = $this->makeTypeByValue($value);
		}
		if($type){
			$member->addType($type);
		}
		
		return $member;
	}
	
	/**
	 * @param $array
	 * @return Member
	 */
	protected function makeMemberEachByArray($array){
		// TODO: Предполагается что имеется возможность грамотно дополнять мемберы и их типы, добавлять
		// >>>>> типы в мемберы и т.п в будуи сконструированный DSI так как DSI сконструированный по какому то образцу
		// >>>>> данных с проставленными конкретными данными может быть не полной картиной всех возможных типов в свойствах,
		// >>>>> могут быть мулти типовые свойства.
		$member = new Member();
		
		$cases = [];
		$casesValues = [];
		$i = 0;
		foreach($array as $index => $v){
			if($casesValues){
				switch(true){
					case is_scalar($v) && in_array($v, $casesValues):
						continue;
						break;
					
					case is_object($v):
						// todo: Сделать сбор сведений по полю, если объекты одной и той же структы в своих полях имеют разные типы значений === свойства мулти типовые
						array_keys( get_object_vars($v) );
						break;
				}
			}
			$type = $this->makeTypeByValue($v);
			
			$member->addType($type);
			
			$cases[] = $type;
			$casesValues[] = $v;
			$i++;
		}
		
		return $member;
	}
	
	protected function makeTypeByValue($value){
		$type = null;
		switch(true){
			case is_object($value):
				$type = $this->inspectObject($value);
				break;
			case is_array($value):
				//!array_diff( array_map(function($v){ return is_integer($v);},array_keys($value)), [true])
				// ЕСЛИ TRUE то значит все числовые(array_map) индексы(array_keys), diff([true,true,true,true,true], [true])- Расхождения нет, массив пустой
				
				if(!array_diff( array_map(function($v){ return is_integer($v);},array_keys($value)), [true])){
					
					$type = new Type\TypeArray();
					$type->setEach( $this->makeMemberEachByArray($value) );
					
				}else{
					$type = $this->inspectArray($value);
				}
				
				
				break;
			
			case is_string($value):
				$type = new Type\Scalar\TypeString();
				break;
			case is_integer($value):
				$type = new Type\Scalar\TypeInteger();
				break;
			case is_float($value):
				$type = new Type\Scalar\TypeFloat();
				break;
		}
		return $type;
	}
}


