<?php
/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Autocomplete;


use Ceive\Dsi\Member;
use Ceive\Dsi\Type;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class ObjectNestable
 * @package Ceive\Dsi\Autocomplete
 */
class ObjectNestable extends Type\TypeObject{
	
	/**
	 * @var array
	 */
	protected $path;
	
	/**
	 * @var ObjectNestable|null
	 */
	protected $parent;
	
	/**
	 * @var Type\TypeObject[]
	 */
	protected $wrapped = [];
	
	/**
	 * @var ObjectManager
	 */
	protected $objectsManager;
	
	/**
	 * ObjectNestable constructor.
	 * @param null $path
	 * @param Type\TypeObject[] $types
	 * @param ObjectNestable $parent
	 * @param null $classname
	 */
	public function __construct($path, array $types, ObjectNestable $parent = null, $classname = null){
		$this->path         = $path?:[];
		$this->wrapped      = $types?:[];
		$this->classname    = $classname;
		$this->parent       = $parent;
	}
	
	/**
	 * @return Member[]
	 */
	public function getMembers(){
		$members = call_user_func_array('array_replace', array_map(function(Type\TypeObject $type){
			return $type->getMembers();
		}, $this->wrapped) );
		
		return $members;
	}
	
	/**
	 * @return ObjectNestable
	 */
	public function getParent(){
		return $this->parent;
	}
	
	/**
	 * @param ObjectNestable|null $parent
	 * @return $this
	 */
	public function setParent(ObjectNestable $parent = null){
		$this->parent = $parent;
		return $this;
	}
	
	/**
	 * Метод для получения тип-объекта по пути
	 * @param $path
	 * @return ObjectNestable
	 */
	public function in($path){
		
		$members = $this->getMembers();
		
		if(!is_array($path)){
			$path = explode('.', $path);
		}
		$chunk = array_shift($path);
		$type = null;
		if(isset($members[$chunk])){
			$member = $members[$chunk];
			
			foreach($member->choices() as $type){
				if($type instanceof TypeReference){
					$type = $type->getReferencedType();
				}
				
				// Первый вариант с типом TypeObject, то есть другие не беруться во внимание , это нужно решить - так быть не должно
				if($type instanceof Type\TypeObject){
					$nextPath = array_merge($this->path,[$chunk]);
					
					$type = $this->_makeNested($type, $this->objectsManager->getByLocation($nextPath), $nextPath);
				}
			}
			if($type && $path){
				return $type->in($path);
			}
		}
		return $type;
	}
	
	/**
	 * @param Type\TypeObject $type
	 * @param array $additionalObjects
	 * @param $path
	 * @return ObjectNestable|Type\TypeObject
	 */
	protected function _makeNested(Type\TypeObject $type, array $additionalObjects, $path){
		$type = new ObjectNestable($path, $type->classname, array_merge([ $type ], $additionalObjects),$this);
		$type->objectsManager = $this->objectsManager;
		return $type;
	}
	
	
}


