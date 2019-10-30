<?php
/**
 * @Creator Alexey Kutuzov <lexus27.khv@gmail.com>
 * @Author: Alexey Kutuzov <lexus27.khv@gmai.com>
 * @Project: ceive.dsi
 */

namespace Ceive\Dsi\Autocomplete;
use Ceive\Dsi\Type\TypeObject;

/**
 * @Author: Alexey Kutuzov <lexus27.khv@gmail.com>
 * Class ObjectManager
 * @package Ceive\Dsi\Autocomplete
 */
class ObjectManager{
	
	/** @var ObjectNestable[] */
	protected $aliased = [];
	
	/** @var ObjectNestable[] */
	protected $classes = [];
	
	/** @var ObjectInWay[] */
	protected $locations = [];
	
	/**
	 * @param TypeObject $object
	 * @param null $alias
	 * @return $this
	 */
	public function register(TypeObject $object, $alias = null){
		
		if($object instanceof ObjectInWay){
			$this->locations[] = $object;
		}else if($object->classname && $object->classname !== 'object'){
			$this->classes[$object->classname] = $object;
		}
		
		if($alias){
			$this->aliased[$alias] = $alias;
		}
		
		return $this;
	}
	
	/**
	 * @param $alias
	 * @return mixed|null
	 */
	public function getByAlias($alias){
		return isset($this->aliased[$alias])?$this->aliased[$alias]:null;
	}
	
	/**
	 * @param $location
	 * @return array
	 */
	public function getByLocation($location){
		$a = [];
		foreach($this->locations as $o){
			if($o->hasLocation($location)){
				$a[] = $o;
			}
		}
		return $a;
	}
	
	/**
	 * @param $classname
	 * @return mixed|null
	 */
	public function getByClassname($classname){
		return isset($this->classes[$classname])?$this->classes[$classname]:null;
	}
	
	
}


